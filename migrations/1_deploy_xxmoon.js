const XXMoon = artifacts.require("XXMoon");
const data = require('./conf');

module.exports = function (deployer, network, accounts) {
    return deployer.deploy(XXMoon).catch(e=>{
        console.error(e);
    });
};
