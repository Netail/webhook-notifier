import * as core from '@actions/core';
import axios from 'axios';
import { DiscordPayload } from '../interfaces/discord-payload';
import { SlackPayload } from '../interfaces/slack-payload';
import { TeamsPayload } from '../interfaces/teams-payload';

export const sendPayload = async (
    url: string,
    payload: DiscordPayload | TeamsPayload | SlackPayload
) => {
    try {
        core.debug(`Sending payload...\n${JSON.stringify(payload)}`);
        axios.post(url, payload);
    } catch (error) {
        core.error(`Failed sending payload...\n${error}`);
    }
};
