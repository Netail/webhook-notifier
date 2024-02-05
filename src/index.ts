import { getInput, debug, setFailed } from '@actions/core';
import { normalizeColor } from './helpers/color.helper';
import type { Button, Field } from './interfaces/input';
import { normalizeDiscordPayload } from './normalizers/discord.normalizer';
import { normalizeSlackPayload } from './normalizers/slack.normalizer';
import { normalizeTeamsPayload } from './normalizers/teams.normalizer';
import { sendPayload } from './helpers/send-payload.helper';
import { Result } from './interfaces/result';

const run = async (): Promise<void> => {
    try {
        const dryRun = getInput('dry-run').toLowerCase() === 'true';
        debug(`Dry-run: ${dryRun ? '✔' : '❌'}`);

        const discordURL = getInput('discord-url');
        debug(`Discord: ${discordURL ? '✔' : '❌'}`);

        const teamsURL = getInput('teams-url');
        debug(`Teams: ${teamsURL ? '✔' : '❌'}`);

        const slackURL = getInput('slack-url');
        debug(`Slack: ${slackURL ? '✔' : '❌'}`);

        if (!discordURL && !teamsURL && !slackURL)
            throw new Error('No webhooks defined');

        const color = normalizeColor(getInput('color', { required: true }));
        const title = getInput('title', { required: true });
        const text = getInput('text');

        const rawFields = getInput('fields');
        let fields: Field[] = [];
        try {
            if (rawFields) {
                fields = JSON.parse(rawFields);
            }
        } catch (err) {
            setFailed('Failed to parse fields');
        }

        const rawButtons = getInput('buttons');
        let buttons: Button[] = [];
        try {
            if (rawButtons) {
                buttons = JSON.parse(rawButtons);
            }
        } catch (err) {
            setFailed('Failed to parse buttons');
        }

        const failed: Result[] = [];

        if (discordURL) {
            const discordPayload = normalizeDiscordPayload(
                title,
                text,
                color,
                fields,
                buttons
            );

            const result = await sendPayload(
                'Discord',
                discordURL,
                discordPayload,
                dryRun
            );
            if (!result.success) {
                failed.push(result);
            }
        }

        if (slackURL) {
            const slackPayload = normalizeSlackPayload(
                title,
                text,
                color,
                fields,
                buttons
            );

            const result = await sendPayload(
                'Slack',
                slackURL,
                slackPayload,
                dryRun
            );
            if (!result.success) {
                failed.push(result);
            }
        }

        if (teamsURL) {
            const teamsPayload = normalizeTeamsPayload(
                title,
                text,
                color,
                fields,
                buttons
            );

            const result = await sendPayload(
                'Microsoft Teams',
                teamsURL,
                teamsPayload,
                dryRun
            );
            if (!result.success) {
                failed.push(result);
            }
        }

        if (failed.length > 0) {
            setFailed(
                `Failed sending payload to: ${failed.map((e) => e.key).join(',')}`
            );
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
