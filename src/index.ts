import core from '@actions/core';
import { normalizeColor } from './helpers/color.helper';
import type { Button, Field } from './interfaces/input';
import { normalizeDiscordPayload } from './normalizers/discord.normalizer';
import { normalizeSlackPayload } from './normalizers/slack.normalizer';
import { normalizeTeamsPayload } from './normalizers/teams.normalizer';
import { sendPayload } from './helpers/send-payload.helper';

const run = async (): Promise<void> => {
    try {
        const discordURL = core.getInput('discord-url');
        core.debug(`Discord: ${discordURL ? '✔' : '❌'}`);

        const teamsURL = core.getInput('teams-url');
        core.debug(`Teams: ${teamsURL ? '✔' : '❌'}`);

        const slackURL = core.getInput('slack-url');
        core.debug(`Slack: ${slackURL ? '✔' : '❌'}`);

        if (!discordURL && !teamsURL && !slackURL)
            throw new Error('No webhooks defined');

        const title = core.getInput('title', { required: true });
        const text = core.getInput('text');
        const color = normalizeColor(
            core.getInput('color', { required: true })
        );
        const fields: Field[] = JSON.parse(core.getInput('fields'));
        const buttons: Button[] = JSON.parse(core.getInput('buttons'));

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
        core.setFailed(err.message);
    }
};

run();
