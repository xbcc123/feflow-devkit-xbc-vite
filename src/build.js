const Builder = require("./build/index.js");
const { deepCloneUnique } = require("./tools/index.js");
const { build: viteBuild, mergeConfig } = require("vite");
const chalk = require("chalk");
const currentConfig = require("./vite/vite.prod.config");
const fs = require("fs");
const builder = new Builder();
let config = {}, importConfig = {};

// 将公共配置绑定到各个环境
function setSingleConfig(options) {
	for (let key in options.devkit.commands) {
		// 单独配置的选项会覆盖公共配置
		// let single = Object.assign(options.devkit.commons, options.devkit.commands[key].options)
		let single = mergeConfig(
			options.devkit.commons,
			options.devkit.commands[key].options,
			false
		)
		single = deepCloneUnique(single, "optionsId")
		// 设置当前当前执行的环境变量
		single.currentEnv = key
		Object.assign(options.devkit.commands[key].options, single)
	}
	return options
}

// 获取配置的config
function getConfig(options, env) {
	options = setSingleConfig(options)
	return options.devkit.commands[env].options
}

/**
 * @function run
 * @desc     创建用于开发过程中的vite打包配置
 *
 * @param {Object}  options                         参数
 *
 * @example
 */

export async function run(ctx, options) {
	importConfig = getConfig(ctx.projectConfig, options.env);
	config = mergeConfig(currentConfig, builder.createProdConfig(importConfig));
	try {
		await viteBuild(config);
		console.log(chalk.cyan("  Build complete.\n"));
	} catch (err) {
		console.log(chalk.red("  Build failed with errors.\n"));
		console.error(err);
		process.exit(1);
	}
}
