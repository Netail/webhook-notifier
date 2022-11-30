import core from '@actions/core';
import { DiscordPayload } from '../interfaces/discord-payload';
import { SlackPayload } from '../interfaces/slack-payload';
import { TeamsPayload } from '../interfaces/teams-payload';

export const sendPayload = async (
    url: string,
    payload: DiscordPayload | TeamsPayload | SlackPayload,
) => {
    const host = new URL(url).hostname.replace('www.', '');

    core.debug(`Sending payload to: ${host}`);

    const response = await fetch(url, {
        method: 'post',
        body: payload.toString(),
    });

    if (!response.ok) {
        throw new Error(
            `Failed sending payload to: ${host}, status: ${response.status}`
        );
    }

    core.debug(`Successfully sent payload to: ${host}`);
}
