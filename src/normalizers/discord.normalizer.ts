import { hexToDecimal } from '../helpers/color.helper';
import { DiscordPayload } from '../interfaces/discord-payload';
import { Button, Field } from '../interfaces/input';

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
                    style: 1,
                    ...button,
                })),
            },
        ],
    };
};
