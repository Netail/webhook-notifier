import { error } from 'node:console';
import { debug } from '@actions/core';
import type { DiscordPayload } from '../interfaces/discord-payload';
import type { Result } from '../interfaces/result';
import type { SlackPayload } from '../interfaces/slack-payload';
import type { TeamsPayload } from '../interfaces/teams-payload';

export const sendPayload = async (
	key: string,
	url: string,
	payload: DiscordPayload | TeamsPayload | SlackPayload,
	dryRun: boolean,
): Promise<Result> => {
	try {
		debug(`Payload: ${JSON.stringify(payload)}`);

		if (dryRun) {
			return { key, success: true };
		}

		const response = await fetch(url.trim(), {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (response.ok) {
			debug(`Successfully sent payload to ${key}`);
			return { key, success: true };
		}

		error(
			`Failed sending the payload to ${key}. API returned HTTP status ${response.status}`,
		);

		return { key, success: false };
	} catch (err) {
		if (err instanceof Error) {
			error(`Failed sending the payload to ${key}`);
		}

		return { key, success: false };
	}
};
