web3.eth.defaultAccount = eth.accounts[0];

var testcontractContract = web3.eth.contract([{
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

var privateTxsToSend = 25;

var eventsEmitted = 0;

var testcontract = testcontractContract.new(
    {
        from: web3.eth.accounts[0],
        data: '0x608060405260008055348015601357600080fd5b5060cc806100226000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680637b0cb839146044575b600080fd5b348015604f57600080fd5b5060566058565b005b7f1440c4dd67b4344ea1905ec0318995133b550f168b4ee959a0da6b503d7d2414600080815480929190600101919050556040518082815260200191505060405180910390a15600a165627a7a72305820d0a22dbf268334eae6006b4d59e1f355fb738aa82345685173a2cc90fc6f085c0029',
        gas: '4700000',
        privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]
    }, function (e, contract) {
        if (!contract.address) {
            console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
        } else {

            var privateC = testcontractContract.at(contract.address);

            for (var i = 0; i < privateTxsToSend; i++) {

                privateC.emitEvent({
                    from: eth.accounts[0],
                    privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]
                }, function (err, addr) {
                    console.log("\"" + addr + "\",");

                });

            }

        }
    });




