const Builder = require("./build/index.js");
const { deepCloneUnique } = require("./tools/index.js");
const { createServer, mergeConfig, defineConfig } = require("vite");
const currentConfig = require("./vite/vite.dev.config");
const fs = require("fs");

let config = {}, importConfig = {};

let build = new Builder();

function setSingleConfig(options) {
	for (let key in options.devkit.commands) {
		let single = mergeConfig(
			options.devkit.commons,
			options.devkit.commands[key].options,
			false
		);
		single = deepCloneUnique(single, "optionsId");
		single.currentEnv = key;
		Object.assign(options.devkit.commands[key].options, single);
	}
	return options;
}

function getConfig(options, env) {
	options = setSingleConfig(options);
	return options.devkit.commands[env].options;
}

module.exports = async (ctx) => {
	importConfig = getConfig(ctx.projectConfig, "dev");

	config = mergeConfig(
		currentConfig,
		build.createDevConfig(importConfig)
	)

	const server = await createServer(config);
	await server.listen();

	server.printUrls();
};
