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
    const host = new URL(url).hostname.replace('www.', '');

    try {
        debug(`Payload: ${JSON.stringify(payload)}`);

        if (dryRun) {
            return { key, success: true };
        }

        debug(`Sending ${key} payload to`);

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            debug(`Successfully sent ${key} payload to`);
            return { key, success: true };
        } else {
            error(
                `Failed sending the payload to: ${host}. API returned HTTP status ${response.status}`
            );
            return { key, success: false };
        }
    } catch (err) {
        if (err instanceof Error) {
            error(
                `Failed sending the payload to: ${host}. Error:`,
                err.message
            );
        }

        return { key, success: false };
    }
};
