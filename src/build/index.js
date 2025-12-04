const path = require("path");
const { mergeConfig } = require("vite");
const { deepCopy } = require("../tools/index.js");
const fs = require("fs");
const { visualizer } = require('rollup-plugin-visualizer');

function getPath(filename) {
	let currDir = process.cwd()
	while (!fs.existsSync(path.join(currDir, filename))) {
		currDir = path.join(currDir, "../")

		// unix跟目录为/， win32系统根目录为 C:\\格式的
		if (currDir === "/" || /^[a-zA-Z]:\\$/.test(currDir)) {
			return ""
		}
	}
	return currDir
}

// 当前运行的时候的根目录
let projectRoot = getPath(".feflowrc.json")

if (!projectRoot) {
	projectRoot = getPath(".feflowrc.js")
}

const baseConfig = {
	resolve: {},
	plugins: [],
};

class Builder {
	// 创建dev配置
	createDevConfig(options) {
		const devConfig = deepCopy(baseConfig);
		devConfig.mode = "development";
		// 设置打包插件
		// let devPlugins = [];
		// devConfig.plugins = devPlugins;
		// 设置启动服务端口号 本地服务配置
		devConfig.server = this.setDevServer(options.devServer);
		return mergeConfig(this.mixCreateConfig(options), devConfig);
	}

	// 创建prod配置
	createProdConfig(options) {
		const prodConfig = deepCopy(baseConfig);
		prodConfig.mode = "production";

		// 设置打包插件
		let prodPlugins = [];

		// prodConfig.plugins = prodPlugins;

		return mergeConfig(this.mixCreateConfig(options), prodConfig);
	}

	// 公用配置
	mixCreateConfig(options) {
		const mixConfig = deepCopy(baseConfig);
		let mixPlugins = [];

		// 是否启动打包性能分析
		if (options.hasAnalyzer) {
			mixPlugins.push(this.setBundleAnalyzerPlugin(options.analyzer));
		}

		mixConfig.plugins = mixPlugins;
		mixConfig.css = this.setCssConfig(options.isModule);

		// 设置环境变量
		if (options.envs && options.currentEnv) {
			console.log('🔧 Setting environment variables for:', options.currentEnv);
			mixConfig.define = options.envs[options.currentEnv].envObj;
		} else {
			mixConfig.define = {};
		}

		return mixConfig;
	}

	// 设置打包性能分析
	setBundleAnalyzerPlugin(analyzer) {
		if (!analyzer || JSON.stringify(analyzer) === "{}") {
			analyzer = {
				analyzerPort: "4321",
			};
		}
		return visualizer({
			open: true,
			gzipSize: true,
			brotliSize: true,
			filename: "stats.html",
		});
	}

	// 设置别名
	setAlias(alias) {
		let aliasObj = {}
		if (Object.prototype.toString.call(alias) !== "[object Object]") {
			return aliasObj
		}
		for (let key in alias) {
			aliasObj[key] = path.join(projectRoot, `${alias[key]}`)
		}
		return aliasObj
	}

	// 设置 CSS 配置
	setCssConfig(isModule) {
		const cssConfig = {
			preprocessorOptions: {
				less: {
					javascriptEnabled: true,
				},
			},
		};

		// 设置 CSS Modules
		if (isModule) {
			cssConfig.modules = {
				localsConvention: "camelCaseOnly",
				scopeBehaviour: "local",
				generateScopedName: "[path][name]__[local]--[hash:base64:5]",
			};
		}

		return cssConfig;
	}

	setDevServer(devServer) {
		return (
			devServer || {
				port: 1234,
			}
		)
	}
}

module.exports = Builder
