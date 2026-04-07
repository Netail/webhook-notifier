export default {
	mode: "production",
	source: {
		entry: {
			index: "./src/index.ts",
		},
	},
	output: {
		target: "node",
		distPath: {
			root: "dist",
		},
	},
};
