import { hexToDecimal } from '../helpers/color.helper';
import type { Button, Field } from '../interfaces/input';
import type { DiscordPayload } from '../interfaces/discord-payload';

export const normalizeDiscordPayload = (
    title: string,
    text: string,
    color: string,
    fields: Field[],
    buttons: Button[]
): DiscordPayload => {
    return {
        embeds: [
            {
                title,
                type: 'rich',
                color: hexToDecimal(color),
                description: text,
                fields: fields.map((field) => ({
                    inline: true,
                    ...field,
                })),
            },
        ],
        components: [
            {
                type: 1,
                components: buttons.map((button) => ({
                    type: 2,
                    style: 5,
                    ...button,
                })),
            },
        ],
    };
};
