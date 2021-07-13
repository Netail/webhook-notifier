import * as core from '@actions/core';
import axios from 'axios';
import { DiscordPayload } from '../interfaces/discord-payload';
import { SlackPayload } from '../interfaces/slack-payload';
import { TeamsPayload } from '../interfaces/teams-payload';

export const sendPayload = (
    url: string,
    payload: DiscordPayload | TeamsPayload | SlackPayload
) => {
    const domain = new URL(url).hostname.replace('www.', '');

    try {
        core.debug(`Sending payload to ${domain}`);
        axios.post(url, payload);
    } catch (error) {
        throw new Error(`Failed sending payload to ${domain} ${error.response ? `API returned ${error.response.status}` : ''}`);
    }
};
