/**
 * 原理：
 * 1、数据源统计合约上所有Transfer事件的数据，Transfer事件由以下4个数据组成：id，sender发送地址，recipient接收地址，amount数量
 * 2、将数据全部查询出来以后，将sender组成的数组和recipient组成的数组连接起来，然后去掉重复的地址。成为新的数组addressArr
 * 3、addressArr数组中的地址，币的余额不为0的地址，即是持币地址。
 */

// 数据源接口的url地址
let url = 'https://api.thegraph.com/subgraphs/name/0xa8c81519/my-subgraph';

// 下面演示查询数据的方法。由于接口每次查询的记录数是有上限的，所以我们要分多次查询，才能将全部数据查询出来。

/**
 *  假设该函数为前端使用的httpClient之类的http组件
 * @param {*} url 接口地址 
 * @param {*} param post到接口地址的json数据 
 * @returns 
 */
let post = (url, param) => {
	return new Promise((resolve, reject) => {
		return Promise.resolve();
	});
};

// 首先查询数据源中的第一条数据。
// 初始化查询第一条记录，用到的参数。
let queryStr = "{\n" +
	"bsttransfers(first:1) {\n" +
	"id\n" +
	"sender\n" +
	"recipient\n" +
	"amount\n" +
	"}\n" +
	"}\n";
let queryData = JSON.stringify({
	'query': queryStr,
});
// 获取当前区块高度
let currentBlock = await provider.getBlock(); // 
/**
 * 链接两个数组并去掉重复的元素 
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
function distinct(a, b) {
	let arr = a.concat(b)
	let result = []
	let obj = {}

	for (let i of arr) {
		if (!obj[i]) {
			result.push(i)
			obj[i] = 1
		}
	}

	return result
}
// 远程调用接口，进行查询。查询第一条记录
post(url, queryData).then(async res => {  // 查询到第一条记录后
	let parsedData = JSON.parse(res);
	let id = parsedData.data.bsttransfers[0].id;
	let enpochBlock = ethers.BigNumber.from(id.substring(0, id.indexOf('-'))).sub(1); // 第一条记录起始的区块高度
	let sender = new Array();
	let recipient = new Array();
	while (true) { // 无限循环，每次查10000个块范围内的数据，直到当前区块高度为止。
		if (enpochBlock.gt(currentBlock.number)) {
			break;
		}
		let endBlock = enpochBlock.add(10000);
		// 查询条件参数，查询一万个块高内的数据
		let qStr = "{\n" +
			"bsttransfers(first:1000, where:{id_gt:\"" + enpochBlock.toHexString() + "\",id_lt:\"" + endBlock.toHexString() + "\"}) {\n" +
			"id\n" +
			"sender\n" +
			"recipient\n" +
			"amount\n" +
			"}\n" +
			"}\n";
		let qData = JSON.stringify({
			'query': qStr,
		});
		// 远程调用查询接口
		let res_1 = await post(url, qData);
		let data = JSON.parse(res_1);
		let length = data.data.bsttransfers.length;
		console.log(length);
		data.data.bsttransfers.forEach(e => {
			sender.push(e.sender);
			recipient.push(e.recipient);
		});
		enpochBlock = endBlock;
	}
	console.log(JSON.stringify(sender));
	console.log(JSON.stringify(recipient));
	let holders = distinct(sender, recipient);// 得到筛选的地址列表
	// todo: 查询这个地址列表里地址的余额，余额不为0的地址为持币地址。
});