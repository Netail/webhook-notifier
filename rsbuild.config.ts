import { defineConfig } from "@rsbuild/core";

export default defineConfig({
	mode: "production",
	source: {
		entry: {
			index: "./src/index.ts",
		},
	},
	output: {
		target: "node",
		cleanDistPath: true,
		distPath: {
			root: "dist",
		},
		module: true,
	},
});
