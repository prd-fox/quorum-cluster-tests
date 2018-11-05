const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:22000"));

(async function() {

    const pLogs = await web3.eth.getPastLogs({
        fromBlock: '0x0',
        toBlock: 'latest',
        address: '0x1932c48b2bf8102ba33b4a6b545c32236e342f34'
    });

    console.log(JSON.stringify(pLogs));

})();