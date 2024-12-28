export interface SlackPayload {
	attachments: Attachment[];
}

interface Attachment {
	color: string;
	blocks: Block[];
}

interface Block {
	type: string;
	text?: Text;
	fields?: Text[];
	elements?: Element[];
}

interface Text {
	type: string;
	text: string;
}

interface Element {
	type: string;
	text: Text;
	action_id: string;
	url: string;
}
