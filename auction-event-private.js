web3.eth.defaultAccount = eth.accounts[0];

var auctionContract = web3.eth.contract([{
    "constant": true,
    "inputs": [],
    "name": "creator",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "someRandomBid", "type": "uint256"}],
    "name": "closeAuction",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {"inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor"}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "highestBid", "type": "uint256"}],
    "name": "AuctionClosed",
    "type": "event"
}]);

var privateTxsToSend = 1;
var amounts = [];

function calculateAmount(i) {
    return function () {
        return i;
    };
}

for (var i = 0; i < privateTxsToSend; i++) {

    amounts.push(calculateAmount(i));

    var auction = auctionContract.new(
        {
            from: eth.accounts[0],
            data: '0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506101bf806100606000396000f30060806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806302d05d3f14610051578063236ed8f3146100a8575b600080fd5b34801561005d57600080fd5b506100666100d5565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156100b457600080fd5b506100d3600480360381019080803590602001909291905050506100fa565b005b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561018b577fac4a907ec29adcc56774b757ecb1e1b4d597374fc9386107d05e2670259df7d3816040518082815260200191505060405180910390a1610190565b600080fd5b505600a165627a7a723058204a0991b4df609fc89d1df7b47b170ceb42ecf02b6a25321aef4380b2fa10941f0029',
            gas: '4700000',
            privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]
        }, function (e, contract) {

            if (!contract.address) {
                console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
            } else {

                console.log("Contract address: " + contract.address)

                var privateC = auctionContract.at(contract.address);

                privateC.closeAuction(57485763847, {
                    from: eth.accounts[0],
                    privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]
                }, function (err, addr) {
                    console.log("\"" + addr + "\",");
                });
            }

        }
    );

}

