import type { Button, Field } from '../interfaces/input';
import type { SlackPayload } from '../interfaces/slack-payload';

export const normalizeSlackPayload = (
	title: string,
	text: string,
	color: string,
	fields: Field[],
	buttons: Button[],
): SlackPayload => {
	return {
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
					{
						type: 'section',
						text: {
							type: 'mrkdwn',
							text,
						},
					},
					{
						type: 'section',
						fields: fields.map((field) => ({
							type: 'mrkdwn',
							text: `*${field.name}*\n${field.value}`,
						})),
					},
					{
						type: 'actions',
						elements: buttons.map((button, index) => ({
							type: 'button',
							text: {
								type: 'plain_text',
								text: button.label,
							},
							url: button.url,
							action_id: `button_${index}`,
						})),
					},
				],
			},
		],
	};
};
