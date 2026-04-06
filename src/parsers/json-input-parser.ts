import { setFailed } from "@actions/core";

export const parseJSONInput = <T>(key: string, input: string): T | null => {
	try {
		return JSON.parse(input) as T;
	} catch {
		setFailed(`Failed to parse ${key}`);
		return null;
	}
};
