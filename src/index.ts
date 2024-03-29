import { getInput, debug, setFailed } from '@actions/core';
import { normalizeColor } from './helpers/color.helper';
import type { Button, Field } from './interfaces/input';
import { normalizeDiscordPayload } from './normalizers/discord.normalizer';
import { normalizeSlackPayload } from './normalizers/slack.normalizer';
import { normalizeTeamsPayload } from './normalizers/teams.normalizer';
import { sendPayload } from './helpers/send-payload.helper';
import { Result } from './interfaces/result';
import { parseJSONInput } from './parsers/json-input-parser';

const run = async (): Promise<void> => {
    try {
        const dryRun = getInput('dry-run').toLowerCase() === 'true';
        debug(`Dry-run: ${dryRun ? '✔' : '❌'}`);

        const rawDiscordURL = getInput('discord-url');
        let discordURLs: string[] = [];
        if (rawDiscordURL) {
            discordURLs = rawDiscordURL.startsWith('[')
                ? parseJSONInput<string[]>('discord-url', rawDiscordURL)
                : [rawDiscordURL];
        }

        const rawTeamsURL = getInput('teams-url');
        let teamsURLs: string[] = [];
        if (rawTeamsURL) {
            teamsURLs = rawTeamsURL.startsWith('[')
                ? parseJSONInput<string[]>('teams-url', rawTeamsURL)
                : [rawTeamsURL];
        }

        const rawSlackURL = getInput('slack-url');
        let slackURLs: string[] = [];
        if (rawSlackURL) {
            slackURLs = rawSlackURL.startsWith('[')
                ? parseJSONInput<string[]>('slack-url', rawSlackURL)
                : [rawSlackURL];
        }

        if (
            discordURLs.length === 0 &&
            teamsURLs.length === 0 &&
            slackURLs.length === 0
        )
            throw new Error('No webhooks defined');

        const rawColor = getInput('color', { required: true });
        const color = normalizeColor(rawColor);

        const title = getInput('title', { required: true });
        const text = getInput('text');

        const rawFields = getInput('fields');
        let fields: Field[] = rawFields
            ? parseJSONInput<Field[]>('fields', rawFields)
            : [];

        const rawButtons = getInput('buttons');
        let buttons: Button[] = rawFields
            ? parseJSONInput<Button[]>('buttons', rawButtons)
            : [];

        const failed: Result[] = [];

        if (discordURLs.length > 0) {
            const discordPayload = normalizeDiscordPayload(
                title,
                text,
                color,
                fields,
                buttons
            );

            discordURLs.forEach(async (url, idx) => {
                const result = await sendPayload(
                    `Discord[${idx}]`,
                    url,
                    discordPayload,
                    dryRun
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
                buttons
            );

            slackURLs.forEach(async (url, idx) => {
                const result = await sendPayload(
                    `Slack[${idx}]`,
                    url,
                    slackPayload,
                    dryRun
                );
                if (!result.success) {
                    failed.push(result);
                }
            });
        }

        if (teamsURLs.length > 0) {
            const teamsPayload = normalizeTeamsPayload(
                title,
                text,
                color,
                fields,
                buttons
            );

            teamsURLs.forEach(async (url, idx) => {
                const result = await sendPayload(
                    `Microsoft Teams[${idx}]`,
                    url,
                    teamsPayload,
                    dryRun
                );
                if (!result.success) {
                    failed.push(result);
                }
            });
        }

        if (failed.length > 0) {
            setFailed(
                `Failed sending payload to: ${failed.map((e) => e.key).join(', ')}`
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
