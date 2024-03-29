import { debug } from '@actions/core';
import { DiscordPayload } from '../interfaces/discord-payload';
import { SlackPayload } from '../interfaces/slack-payload';
import { TeamsPayload } from '../interfaces/teams-payload';
import { error } from 'console';
import { Result } from '../interfaces/result';

export const sendPayload = async (
    key: string,
    url: string,
    payload: DiscordPayload | TeamsPayload | SlackPayload,
    dryRun: boolean
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
        } else {
            error(
                `Failed sending the payload to ${key}. API returned HTTP status ${response.status}`
            );
            return { key, success: false };
        }
    } catch (err) {
        if (err instanceof Error) {
            error(`Failed sending the payload to ${key}`);
        }

        return { key, success: false };
    }
};
