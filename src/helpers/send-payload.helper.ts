import * as core from '@actions/core';
import axios from 'axios';
import { DiscordPayload } from '../interfaces/discord-payload';
import { SlackPayload } from '../interfaces/slack-payload';
import { TeamsPayload } from '../interfaces/teams-payload';

export const sendPayload = async (
    url: string,
    payload: DiscordPayload | TeamsPayload | SlackPayload
) => {
    const domain = new URL(url).hostname.replace('www.', '');

    try {
        core.debug(`Sending payload to ${domain}`);

        const res = await axios.post(url, payload);

        core.debug(
            `Successfully sent payload to ${domain}. Webhook responded with: ${res}`
        );
    } catch (err) {
        throw new Error(
            `Failed sending payload to ${domain}. ${
                err.response ? `Webhook returned ${err.response.status}` : ''
            }`
        );
    }
};
