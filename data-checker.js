var addrs = [
    "0xb05bf4dd4019d83dde1ab34c365688ed78dcaac65acfdf3699cc004e8b425ad6",
    "0x315bdd80ffe3daa8c96668f199f549f071e14f612364a385152833992d4d8a0f",
    "0x7e977fc4d134a9a4b6e613cbabcb89b5f90bed98fe2e3f7523ce92fd698aab02",
    "0x8f0462875a43b8c4b94ede4c636fc6a65be7c5454927d094209cb4bcab330f90",
    "0x88f7bb3b432bb585868cf46e4d0072ab7e7dae0c543b51f0a77446f966bb3711",
    "0xb56383436bdf38428d462a8bb5f14ab6f15910d5e052a369ef720a901d5ec21e",
    "0x8be563cf0294054a3cf1bec956f77b8e1f52edce2636ce9ab555074a2cd3179a",
    "0x888dfa254e13171896a1716246aa672a2b087cc8cf8eae90e854eb0c628150bc",
    "0xf55708e6cc361d454ee6f494dcafb0cf1a4495aaa4fb04251ba1bd32573dc191",
    "0x6d6647d015ee211d98afa7dda3e63571d3b773ec5e98af745541541b99e10fba",
    "0x498eade51c4b9a5ee9fd05aead3fff2a18c32896aaa5d5e5dffbf638a2d387ef",
    "0xad0d35e4b969c6f2f629e23beee342137a0125f7bd298a27bd8bc75190909c03",
    "0xca8965f4c0359f2a3c6d906b174fc2453338d11f32418590bdbfda568c9e8be6",
    "0xf5c8f1abd1a9ef2b4ee4e4aeff98e7c5f5dd109ad3d095117de274daac167b66",
    "0x6603437488384bec828185810debeb1b9bbe774294b98fbbff526ef4a2997012",
    "0xbf928eabdeaa94319926a414a85800da71d4adeef7f1d462a5a3aa9e1d19f297",
    "0xd699d715e75a959549a7d3646453ffaea2767253fd58a57c739021cfb529987f",
    "0x325f8bcd34673a379b9cdf4c3449e587ec59e270b20e32f3cc7237c5322f509f",
    "0x1264bbbb279a34ad2a29ef548ba42fa435140d87c3a01ee3c7e5f6d869d32fa2",
    "0xfbc3bb42790bd5d21165658d105724942ca2671634758d0adb5ba875bea9eaeb",
    "0x2ba70a12b37c94bd8d2394e51b28c102b035fe33d8e78c7f80d6dcf1d839e1f8",
    "0x770d6c0fb91deb2385bf78af4382c6aad86f900813cb312d79d30e49018c171a",
    "0xaddc21a27e714ca1988b4bbb92a225d5cdc272699d22fbe63cd8062bbd6071bc",
    "0xface47335a7660879309276cb369f777dec00fd9c63887b7d69c402b1f4e2ea9",
    "0x31639e9cd12974ef16b603d3907179a4259735012a1000f52c43292e557c9b92"
];

var tx = "0x66b8c00d08da23d72ea34f4f866ed98a75cf29c00000c2b719a4b14795e2dc58";
var contractaddress = eth.getTransactionReceipt(tx).contractAddress;



var outputObject = {
    found: 0,
    missing: 0,
    logs: [],
};

for (var i = 0; i < addrs.length; i++) {

    var receipt = eth.getTransactionReceipt(addrs[i]);

    if (Array.isArray(receipt.logs) && receipt.logs.length > 0) {
        outputObject.found += 1;
        var removedZeroes = receipt.logs[0].data.replace(/0x0*/, '');
        if (removedZeroes === '') removedZeroes = 0;
        outputObject.logs.push(removedZeroes);
    } else {
        outputObject.missing += 1;
    }

}

console.log(JSON.stringify(outputObject));