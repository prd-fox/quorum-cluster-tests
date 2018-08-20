const Web3 = require('web3');

//connect to node 1
let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:22000'));

function setup(blockToExitAt) {

    return async function loop() {

        let blockNumber = await web3.eth.getBlockNumber();

        if (blockNumber < blockToExitAt) {
            console.log('On block', blockNumber);
            setTimeout(loop, 2000);
        }

    }

}

const blockToWaitFor = process.argv.slice(2)[0];

setup(blockToWaitFor)();