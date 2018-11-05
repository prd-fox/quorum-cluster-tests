const Web3 = require('web3');

// List of nodes we're checking for transactions.
const nodeNames = [
    'localhost:22000',
    'localhost:22001',
    'localhost:22006'
];

const web3 = new Web3(new Web3.providers.HttpProvider("http://" + nodeNames[0]));

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

// Checks nodes for transactions.
async function checkNode(nodeName, transactionHashes, contract) {

    const newweb3 = new Web3(new Web3.providers.HttpProvider(`http://${nodeName}`));

    const outputObject = {
        receiptCount: 0,
        receipts: [],
        logCount: 0,
        logs: [],
        eventCount: 0,
        events: [],
    };

    const promises = [];

    transactionHashes.forEach((hash) => {
        promises.push(newweb3.eth.getTransactionReceipt(hash));
    });

    // console.log("here1");

    const receipts = await Promise.all(promises);
    // console.log("here2");
    receipts.forEach((receipt) => {
        if (Array.isArray(receipt.logs) && receipt.logs.length > 0) {
            outputObject.receiptCount += 1;
            outputObject.receipts.push(receipt.blockNumber);
        }
    });

    const pLogs = await web3.eth.getPastLogs({
        fromBlock: '0x0',
        toBlock: 'latest',
        address: contract.address,
    });

    // console.log("here3");

    pLogs.forEach((log) => {
        outputObject.logCount += 1;
        outputObject.logs.push(log.blockNumber);
    });

    // console.log("here4");

    const reEvents = await contract.getPastEvents('TestEvent', {
        fromBlock: 0,
        toBlock: 'latest',
    });

    // console.log("here5");

    reEvents.forEach((e) => {
        outputObject.eventCount += 1;
        outputObject.events.push(e.blockNumber);
    });

    console.log('In node', nodeName, ':');
    console.log('\t', outputObject.receiptCount, 'transactions were found using transactionHash');
    console.log('\tThis node can see transactions in the following blocks:', outputObject.receipts.toString());
    console.log('\t', outputObject.logCount, 'logs were found, using web3.eth.getPastLogs()');
    console.log('\tThis node can see logs in the following blocks:', outputObject.logs.toString());
    console.log('\t', outputObject.eventCount, 'events were found, using web3.eth.Contract.getPastEvents()');
    console.log('\tThis node can see events in the following blocks:', outputObject.events.toString());
    console.log();
}

module.exports = async () => {
    console.log('Creating a contract private for partner A');

    const instance = await TestContract.deploy({
        data: '0x608060405260008055348015601357600080fd5b5060cc806100226000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680637b0cb839146044575b600080fd5b348015604f57600080fd5b5060566058565b005b7f1440c4dd67b4344ea1905ec0318995133b550f168b4ee959a0da6b503d7d2414600080815480929190600101919050556040518082815260200191505060405180910390a15600a165627a7a72305820d0a22dbf268334eae6006b4d59e1f355fb738aa82345685173a2cc90fc6f085c0029'
    }).send(
        {from: '0xed9d02e382b34818e88b88a309c7fe71e65f419d', gas: '4700000', privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]}
    ).then(function(newContractInstance){
        return newContractInstance; // instance with the new contract address
    });

    let counter = 0;

    const transactionHashes = [];

    console.log('Creating transactions private for partner A');

    const interval = setInterval(async () => {

        const res = await instance.methods.emitEvent()
            .send({from: '0xed9d02e382b34818e88b88a309c7fe71e65f419d', gas: '4700000', privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]})
            .then(function(result) {return result;});

        console.log(res.transactionHash);
        transactionHashes.push(res.transactionHash);
        counter++;
        if (counter === 10) {
            clearInterval(interval);
        }
    }, 1000);

    let counter1 = 0;

    const internal2 = setInterval(async () => {
        counter1++;

        console.log("After", counter1 * 10, "minutes");

        nodeNames.forEach(async (node) => {
            await checkNode(node, transactionHashes, instance);
        });

        if (counter1 === 18) {
            clearInterval(internal2);
        }

    }, 600000);

};