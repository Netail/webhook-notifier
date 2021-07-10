import { Button, Field } from '../interfaces/input';
import { TeamsPayload } from '../interfaces/teams-payload';

export class TeamsBuilder {
    private readonly _payload: TeamsPayload;

    constructor(color: string, title: string) {
        this._payload = {
            '@type': 'MessageCard',
            '@context': 'https://schema.org/extensions',
            themeColor: color,
            summary: title,
            title: title,
        };
    }

    text(text: string): TeamsBuilder {
        this._payload.text = text;
        return this;
    }

    fields(fields: Field[]): TeamsBuilder {
        this._payload.sections = [
            {
                facts: fields,
            },
        ];
        return this;
    }

    buttons(buttons: Button[]): TeamsBuilder {
        this._payload.potentialAction = buttons.map((entry) => {
            return {
                '@type': 'OpenUri',
                name: entry.label,
                targets: [
                    {
                        os: 'default',
                        uri: entry.url,
                    },
                ],
            };
        });
        return this;
    }

    build(): TeamsPayload {
        return this._payload;
    }
}
