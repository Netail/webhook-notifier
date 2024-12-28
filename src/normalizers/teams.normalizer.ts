import type { Button, Field } from '../interfaces/input';
import type { TeamsPayload } from '../interfaces/teams-payload';

export const normalizeTeamsPayload = (
	title: string,
	text: string,
	color: string,
	fields: Field[],
	buttons: Button[],
): TeamsPayload => {
	return {
		type: 'message',
		attachments: [
			{
				contentType: 'application/vnd.microsoft.card.adaptive',
				contentUrl: null,
				content: {
					$schema:
						'http://adaptivecards.io/schemas/adaptive-card.json',
					type: 'AdaptiveCard',
					version: '1.5',
					body: [
						{
							type: 'TextBlock',
							text: title,
							size: 'large',
						},
						{
							type: 'TextBlock',
							text: text,
						},
						{
							type: 'FactSet',
							facts: fields.map(({ name, value }) => ({
								title: name,
								value,
							})),
						},
					],
					actions: buttons.map(({ label, url }) => ({
						type: 'Action.OpenUrl',
						title: label,
						url: url,
					})),
					backgroundImage: {
						url: `https://singlecolorimage.com/get/${color}/1x3`,
						fillMode: 'RepeatHorizontally',
					},
				},
			},
		],
	};
};
