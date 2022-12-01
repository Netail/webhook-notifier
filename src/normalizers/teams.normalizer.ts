import { Button, Field } from '../interfaces/input';
import { TeamsPayload } from '../interfaces/teams-payload';

export const normalizeTeamsPayload = (
    title: string,
    text: string,
    color: string,
    fields: Field[],
    buttons: Button[]
): TeamsPayload => {
    return {
        '@type': 'MessageCard',
        '@context': 'https://schema.org/extensions',
        themeColor: color,
        summary: title,
        title,
        text,
        sections: [
            {
                facts: fields,
            },
        ],
        potentialAction: buttons.map((button) => ({
            '@type': 'OpenUri',
            name: button.label,
            targets: [
                {
                    os: 'default',
                    uri: button.url,
                },
            ],
        })),
    };
};
