import { hexToDecimal } from '../helpers/color.helper';
import { DiscordPayload } from '../interfaces/discord-payload';
import { Button, Field } from '../interfaces/input';

export class DiscordBuilder {
    private readonly _payload: DiscordPayload;

    constructor(color: string, title: string) {
        this._payload = {
            embeds: [
                {
                    title,
                    type: 'rich',
                    color: hexToDecimal(color),
                },
            ],
        };
    }

    text(text: string): DiscordBuilder {
        this._payload.embeds[0].description = text;
        return this;
    }

    fields(fields: Field[]): DiscordBuilder {
        this._payload.embeds[0].fields = fields.map((entry) => {
            return {
                ...entry,
                inline: true,
            };
        });
        return this;
    }

    buttons(buttons: Button[]): DiscordBuilder {
        this._payload.components = [
            {
                type: 1,
                components: buttons.map((entry) => {
                    return {
                        type: 2,
                        style: 1,
                        ...entry,
                    };
                }),
            },
        ];
        return this;
    }

    build(): DiscordPayload {
        return this._payload;
    }
}
