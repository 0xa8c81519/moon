'use strict'
const log4jsConfig = {
	appenders: {
		stdout: { type: 'stdout' },
		noodle: {
			type: 'dateFile',
			//文件名为= filename + pattern, 设置为alwaysIncludePattern：true
			filename: 'logs/moons',
			pattern: 'yyyy-MM-dd.log',
			//包含模型
			alwaysIncludePattern: true
		}
	},
	categories: { default: { appenders: ["stdout", "noodle"], level: "debug" } }
};
const config = {
	accountsSize: 10,
	bsc_mainnet: {
		chainId: 56,
		rpc: {
			url: 'https://bsc-dataseed.binance.org/',
		},
	},
	bsc_testnet: {
		chainId: 97,
		rpc: {
			url: 'https://data-seed-prebsc-2-s2.binance.org:8545/',
		},
	},
	dev: {
		chainId: 5777,
		rpc: {
			url: 'http://127.0.0.1:8545/',
		},
	},
};

module.exports = { log4jsConfig: log4jsConfig, default: config };
