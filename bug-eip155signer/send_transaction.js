////////////////
// SETUP CODE //
////////////////
function expo(eip155Block, before, after) {
    const Web3 = require('web3');

    // const eip155Block = 3;
    //
    // const before = 'public';
    // const after = 'private';

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

    async function runRound(isPrivate) {
        isPrivate ? console.log("Sending private transaction") : console.log("Sending public transaction");

        console.log('Creating a contract on node', nodeNames[0]);

        let options = {from: sender, gas: '4700000'};
        // let options = {from: await web3.eth.accounts[0], gas: '4700000'};
        if (isPrivate) {
            options.privateFor = ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="];
        }

        let transactionHash;

        return TestContract.deploy({
            data: '0x608060405260008055348015601357600080fd5b5060cc806100226000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680637b0cb839146044575b600080fd5b348015604f57600080fd5b5060566058565b005b7f1440c4dd67b4344ea1905ec0318995133b550f168b4ee959a0da6b503d7d2414600080815480929190600101919050556040518082815260200191505060405180910390a15600a165627a7a72305820d0a22dbf268334eae6006b4d59e1f355fb738aa82345685173a2cc90fc6f085c0029'
        }).send(
            options
        ).on('receipt', function (receipt) {
            console.log('Contract address: ', receipt.contractAddress);
        }).on('transactionHash', function (hash) {
            transactionHash = hash;
        }).then(async function () {
            nodeNames.forEach(async (node) => {
                const web3 = new Web3(new Web3.providers.HttpProvider(node));

                const receipt = await web3.eth.getTransactionReceipt(transactionHash);

                if (receipt !== null) {
                    console.log('The transaction was found in node', node);
                } else {
                    console.log('The transaction was not found in node', node);
                }

            });
        });
    }

    //execute the code
    return async function startLooping() {

        let blockNumber = await web3.eth.getBlockNumber();

        //do a private transaction IF:
        // 1. we are one before EIP155 and want to do a private
        // 2. we are at EIP155 and want to do a private
        // 3. randomly otherwise
        let doPrivate;

        if(blockNumber === eip155Block-1) {
            console.log('Forcing this transaction to be', before);
            doPrivate = (before === 'private');
        } else if (blockNumber === eip155Block) {
            console.log('Forcing this transaction to be', after);
            doPrivate = (after === 'private');
        } else {
            doPrivate = (Math.random() >= 0.5);
        }

        //execute the main code
        await runRound(doPrivate);

        //only loop until we are 5 blocks out from the EIP155 signer to handle edge cases
        if (blockNumber < eip155Block + 5) {
            //output round data
            //wait 1 second before printing data to allow main code to finish printing
            setTimeout(async function () {
                let currentBlock = await web3.eth.getBlockNumber();

                console.log('On block', currentBlock);
                if (currentBlock === eip155Block) {
                    console.log("Forking into EIP155");
                }
                console.log();
                console.log();
                console.log();

                //set the next round to run in 2 seconds
                setTimeout(startLooping, 2000);
            }, 1000);
        }

    }
}

module.exports = {
    run: function (eip155Block, before, after) {
        return expo(eip155Block, before, after);
    }
};