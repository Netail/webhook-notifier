import { Jimp } from 'jimp';
import type { Button, Field } from '../interfaces/input';
import type { TeamsPayload } from '../interfaces/teams-payload';

export const normalizeTeamsPayload = async (
	title: string,
	text: string,
	color: string,
	fields: Field[],
	buttons: Button[],
): Promise<TeamsPayload> => {
	const colorStrip = new Jimp({ width: 1, height: 3, color: `#${color}` });
	const colorStripBase64 = await colorStrip.getBase64('image/png');

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
					msteams: {
						width: 'Full',
					},
					backgroundImage: {
						url: colorStripBase64,
						fillMode: 'RepeatHorizontally',
					},
				},
			},
		],
	};
};
