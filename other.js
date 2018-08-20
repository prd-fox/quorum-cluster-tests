//Sends in transactions in a loop, randomly making them public or private

////////////////
// SETUP CODE //
////////////////
const Web3 = require('web3');

// List of nodes we're checking for transactions.
const nodeNames = [
    'http://localhost:22000',
    'http://localhost:22001',
    'http://localhost:22002',
    'http://localhost:22003',
    'http://localhost:22004',
    'http://localhost:22005',
    'http://localhost:22006'
];

//connect to node 1
let web3 = new Web3(new Web3.providers.HttpProvider(nodeNames[0]));

//sender address
const sender = '0xed9d02e382b34818e88b88a309c7fe71e65f419d';

//which event to fire
const eventMethodSignature = 'emitEvent()';

//create the contract
const TestContract = new web3.eth.Contract([{
    "constant": false,
    "inputs": [],
    "name": "emitEvent",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "count", "type": "uint256"}],
    "name": "TestEvent",
    "type": "event"
}]);

///////////////
// MAIN CODE //
///////////////

// Checks all nodes for receipts given a set of transaction hashes
async function checkNode(nodeName, transactionHashes) {
    //connect to the node we're checking
    const web3 = new Web3(new Web3.providers.HttpProvider(nodeName));

    //found is number of receipts found, missing is number missing, logs are the actual logs from found txns
    const outputObject = {found: 0, missing: 0, logs: []};

    const promises = transactionHashes.map((hash) => {
        return web3.eth.getTransactionReceipt(hash);
    });

    const receipts = await Promise.all(promises);

    receipts.forEach((receipt) => {
        if (Array.isArray(receipt.logs) && receipt.logs.length > 0) {
            outputObject.found++;
            let removedZeroes = receipt.logs[0].data.replace(/0x0*/, '') || '0';
            outputObject.logs.push(removedZeroes);
        } else {
            outputObject.missing++;
        }
    });
    return outputObject;
}

async function runRound() {
    let isPrivate = Math.random() >= 0.5;
    isPrivate ? console.log("Sending private transactions") : console.log("Sending public transactions");

    console.log('Creating a contract on node', nodeNames[0]);

    let options = {from: sender, gas: '4700000'};
    // let options = {from: await web3.eth.accounts[0], gas: '4700000'};
    if (isPrivate) {
        options.privateFor = ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="];
    }

    return TestContract.deploy({
        data: '0x608060405260008055348015601357600080fd5b5060cc806100226000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680637b0cb839146044575b600080fd5b348015604f57600080fd5b5060566058565b005b7f1440c4dd67b4344ea1905ec0318995133b550f168b4ee959a0da6b503d7d2414600080815480929190600101919050556040518082815260200191505060405180910390a15600a165627a7a72305820d0a22dbf268334eae6006b4d59e1f355fb738aa82345685173a2cc90fc6f085c0029'
    }).send(
        options
    ).on('receipt', function (receipt) {
        console.log('Contract address: ', receipt.contractAddress);
    }).then(async function (contractInstance) {

        let hashes = [];

        let optionsEvent = {from: sender};
        if (isPrivate) {
            optionsEvent.privateFor = ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="];
        }

        for (let i = 0; i < 1000; i++) {
            console.log(i);
            let currentPromises = [];
            for (let j = 0; j < 10; j++) {
                let current = contractInstance.methods[eventMethodSignature]().send(
                    optionsEvent
                ).on('receipt', function () {
                }).on('transactionHash', function (hash) {
                    hashes.push(hash);
                });

                currentPromises.push(current);
            }

            await Promise.all(currentPromises);
        }

        nodeNames.forEach(async (node) => {
            const results = await checkNode(node, hashes);
            // console.log(results);
            console.log('In node', node, ',', results.found, 'transactions were found and', results.missing, 'were not');
            console.log('This node can see the following logs:', JSON.stringify(results.logs));
        });

    });
}

//execute the code

//the number of sets of txns we have sent in
round = 0;

async function startLooping() {

    //execute the main code
    await runRound();

    //output round data
    //wait 1 second before printing data to allow main code to finish printing
    setTimeout(async function () {
        console.log('Finished round', ++round);
        console.log('On block', await web3.eth.getBlockNumber());
        console.log();
        console.log();
        console.log();

        //set the next round to run in 2 seconds
        setTimeout(startLooping, 2000);
    }, 1000);

}

startLooping();
