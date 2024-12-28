import { setFailed } from '@actions/core';

export const parseJSONInput = <T>(key: string, input: string): T => {
	try {
		return JSON.parse(input) as T;
	} catch (err) {
		setFailed(`Failed to parse ${key}`);
		return {} as T;
	}
};
