import type { Button, Field } from '../interfaces/input';
import type { TeamsPayload } from '../interfaces/teams-payload';

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
        // Microsoft has deprecated color
        // https://github.com/MicrosoftDocs/msteams-docs/issues/10062#issuecomment-1862178211
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
