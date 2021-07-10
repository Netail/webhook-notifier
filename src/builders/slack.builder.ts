import { Button, Field } from '../interfaces/input';
import { SlackPayload } from '../interfaces/slack-payload';

export class SlackBuilder {
    private readonly _payload: SlackPayload;

    constructor(color: string, title: string) {
        this._payload = {
            attachments: [
                {
                    color: `#${color}`,
                    blocks: [
                        {
                            type: 'header',
                            text: {
                                type: 'plain_text',
                                text: title,
                            },
                        },
                    ],
                },
            ],
        };
    }

    text(text: string): SlackBuilder {
        this._payload.attachments[0].blocks.push({
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: text,
            },
        });

        return this;
    }

    fields(fields: Field[]): SlackBuilder {
        this._payload.attachments[0].blocks.push({
            type: 'section',
            fields: fields.map((entry) => {
                return {
                    type: 'mrkdwn',
                    text: `*${entry.name}*\n${entry.value}`,
                };
            }),
        });

        return this;
    }

    buttons(buttons: Button[]): SlackBuilder {
        this._payload.attachments[0].blocks.push({
            type: 'actions',
            elements: buttons.map((entry, index) => {
                return {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: entry.label,
                    },
                    url: entry.url,
                    action_id: `button_${index}`,
                };
            }),
        });

        return this;
    }

    build(): SlackPayload {
        return this._payload;
    }
}
