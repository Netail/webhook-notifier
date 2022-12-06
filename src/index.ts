import { getInput, debug, setFailed } from '@actions/core';
import { normalizeColor } from './helpers/color.helper';
import type { Button, Field } from './interfaces/input';
import { normalizeDiscordPayload } from './normalizers/discord.normalizer';
import { normalizeSlackPayload } from './normalizers/slack.normalizer';
import { normalizeTeamsPayload } from './normalizers/teams.normalizer';
import { sendPayload } from './helpers/send-payload.helper';

const run = async (): Promise<void> => {
    try {
        const discordURL = getInput('discord-url');
        debug(`Discord: ${discordURL ? '✔' : '❌'}`);

        const teamsURL = getInput('teams-url');
        debug(`Teams: ${teamsURL ? '✔' : '❌'}`);

        const slackURL = getInput('slack-url');
        debug(`Slack: ${slackURL ? '✔' : '❌'}`);

        if (!discordURL && !teamsURL && !slackURL)
            throw new Error('No webhooks defined');

        const title = getInput('title', { required: true });
        const text = getInput('text');
        const color = normalizeColor(getInput('color', { required: true }));
        const fields: Field[] = JSON.parse(getInput('fields'));
        const buttons: Button[] = JSON.parse(getInput('buttons'));

        if (discordURL) {
            const discordPayload = normalizeDiscordPayload(
                title,
                text,
                color,
                fields,
                buttons
            );

            await sendPayload(discordURL, discordPayload);
        }

        if (slackURL) {
            const slackPayload = normalizeSlackPayload(
                title,
                text,
                color,
                fields,
                buttons
            );

            await sendPayload(slackURL, slackPayload);
        }

        if (teamsURL) {
            const teamsPayload = normalizeTeamsPayload(
                title,
                text,
                color,
                fields,
                buttons
            );

            await sendPayload(teamsURL, teamsPayload);
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
