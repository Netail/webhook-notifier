import { debug, getInput, setFailed } from '@actions/core';
import { normalizeColor } from './helpers/color.helper';
import { sendPayload } from './helpers/send-payload.helper';
import type { Button, Field } from './interfaces/input';
import type { Result } from './interfaces/result';
import { normalizeDiscordPayload } from './normalizers/discord.normalizer';
import { normalizeSlackPayload } from './normalizers/slack.normalizer';
import { normalizeTeamsPayload } from './normalizers/teams.normalizer';
import { parseJSONInput } from './parsers/json-input-parser';

const run = async (): Promise<void> => {
	try {
		const dryRun = getInput('dry-run').toLowerCase() === 'true';
		debug(`Dry-run: ${dryRun ? '✔' : '❌'}`);

		const rawDiscordURL = getInput('discord-url');
		let discordURLs: string[] = [];
		if (rawDiscordURL) {
			const isJSONArray = rawDiscordURL.startsWith('[');

			debug(`Found Discord input ${isJSONArray ? '(Multiple)' : ''}`);

			discordURLs = isJSONArray
				? parseJSONInput<string[]>('discord-url', rawDiscordURL)
				: rawDiscordURL.split(',');
		}

		const rawTeamsURL = getInput('teams-url');
		let teamsURLs: string[] = [];
		if (rawTeamsURL) {
			const isJSONArray = rawTeamsURL.startsWith('[');

			debug(`Found Teams input ${isJSONArray ? '(Multiple)' : ''}`);

			teamsURLs = isJSONArray
				? parseJSONInput<string[]>('teams-url', rawTeamsURL)
				: rawTeamsURL.split(',');
		}

		const rawSlackURL = getInput('slack-url');
		let slackURLs: string[] = [];
		if (rawSlackURL) {
			const isJSONArray = rawSlackURL.startsWith('[');

			debug(`Found Slack input ${isJSONArray ? '(Multiple)' : ''}`);

			slackURLs = isJSONArray
				? parseJSONInput<string[]>('slack-url', rawSlackURL)
				: rawSlackURL.split(',');
		}

		if (
			discordURLs.length === 0 &&
			teamsURLs.length === 0 &&
			slackURLs.length === 0
		)
			throw new Error('No webhooks provided');

		const rawColor = getInput('color', { required: true });
		const color = normalizeColor(rawColor);

		const title = getInput('title', { required: true });
		const text = getInput('text');

		const rawFields = getInput('fields');
		const fields: Field[] = rawFields
			? parseJSONInput<Field[]>('fields', rawFields)
			: [];

		const rawButtons = getInput('buttons');
		const buttons: Button[] = rawButtons
			? parseJSONInput<Button[]>('buttons', rawButtons)
			: [];

		const failed: Result[] = [];

		if (discordURLs.length > 0) {
			const discordPayload = normalizeDiscordPayload(
				title,
				text,
				color,
				fields,
				buttons,
			);

			discordURLs.forEach(async (url, idx) => {
				const result = await sendPayload(
					`Discord[${idx}]`,
					url,
					discordPayload,
					dryRun,
				);
				if (!result.success) {
					failed.push(result);
				}
			});
		}

		if (slackURLs.length > 0) {
			const slackPayload = normalizeSlackPayload(
				title,
				text,
				color,
				fields,
				buttons,
			);

			slackURLs.forEach(async (url, idx) => {
				const result = await sendPayload(
					`Slack[${idx}]`,
					url,
					slackPayload,
					dryRun,
				);
				if (!result.success) {
					failed.push(result);
				}
			});
		}

		if (teamsURLs.length > 0) {
			const teamsPayload = await normalizeTeamsPayload(
				title,
				text,
				color,
				fields,
				buttons,
			);

			teamsURLs.forEach(async (url, idx) => {
				const result = await sendPayload(
					`Microsoft Teams[${idx}]`,
					url,
					teamsPayload,
					dryRun,
				);
				if (!result.success) {
					failed.push(result);
				}
			});
		}

		if (failed.length > 0) {
			setFailed(
				`Failed sending payload to: ${failed.map((e) => e.key).join(', ')}`,
			);
		}
	} catch (err) {
		if (err instanceof Error) {
			setFailed(err.message);
		} else {
			setFailed('Something went wrong...');
		}
	}
};

run();
