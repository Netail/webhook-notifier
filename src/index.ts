import * as core from '@actions/core';
import { DiscordBuilder } from './builders/discord.builder';
import { SlackBuilder } from './builders/slack.builder';
import { TeamsBuilder } from './builders/teams.builder';
import { colorCheck } from './helpers/color.helper';
import { sendPayload } from './helpers/send-payload.helper';
import { Button, Field } from './interfaces/input';

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
        const color = colorCheck(core.getInput('color', { required: true }));
        const fields = JSON.parse(core.getInput('fields')) as Field[];
        const buttons = JSON.parse(core.getInput('buttons')) as Button[];

        if (discordURL) {
            let discordPayload = new DiscordBuilder(color, title);

            if (text) discordPayload = discordPayload.text(text);
            if (fields) discordPayload = discordPayload.fields(fields);
            // ! Discord does not support buttons for non-application owned webhooks (yet)
            // if (buttons) discordPayload = discordPayload.buttons(buttons);

            await sendPayload(discordURL, discordPayload.build());
        }

        if (teamsURL) {
            let teamsPayload = new TeamsBuilder(color, title);

            if (text) teamsPayload = teamsPayload.text(text);
            if (fields) teamsPayload = teamsPayload.fields(fields);
            if (buttons) teamsPayload = teamsPayload.buttons(buttons);

            await sendPayload(teamsURL, teamsPayload.build());
        }

        if (slackURL) {
            let slackPayload = new SlackBuilder(color, title);

            if (text) slackPayload = slackPayload.text(text);
            if (fields) slackPayload = slackPayload.fields(fields);
            if (buttons) slackPayload = slackPayload.buttons(buttons);

            await sendPayload(slackURL, slackPayload.build());
        }
    } catch (error) {
        core.setFailed(error.message);
    }
};

run();
