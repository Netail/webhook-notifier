import { debug } from '@actions/core';
import axios, { isAxiosError } from 'axios';
import { DiscordPayload } from '../interfaces/discord-payload';
import { SlackPayload } from '../interfaces/slack-payload';
import { TeamsPayload } from '../interfaces/teams-payload';

export const sendPayload = async (
    url: string,
    payload: DiscordPayload | TeamsPayload | SlackPayload
): Promise<void> => {
    const host = new URL(url).hostname.replace('www.', '');

    try {
        debug(`Sending payload to: ${host}`);

        await axios.post(url, payload);

        debug(`Successfully sent payload to: ${host}`);
    } catch (err: unknown) {
        if (isAxiosError(err)) {
            throw new Error(
                `Failed sending the payload to: ${host}. ${
                    err.response
                        ? `Webhook returned: ${err.response.status}`
                        : ''
                }`
            );
        } else {
            throw new Error(
                `Failed sending the payload to: ${host}, error: ${err}`
            );
        }
    }
};
