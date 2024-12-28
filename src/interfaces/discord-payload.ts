export interface DiscordPayload {
	embeds: Embed[];
	components?: Component[];
}

interface Embed {
	title: string;
	type: string;
	description?: string;
	color: number;
	fields?: Field[];
}

interface Field {
	name: string;
	value: string;
	inline?: boolean;
}

interface Component {
	type: number;
	components: ButtonComponent[];
}

interface ButtonComponent {
	type: number;
	style: number;
	label: string;
	url: string;
}
