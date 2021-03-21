const Web3 = require("web3");
const {performance, PerformanceObserver} = require("perf_hooks")
// const provider = new Web3.providers.HttpProvider("http://localhost:22000");
const provider = new Web3.providers.WebsocketProvider("ws://localhost:23000");
const web3 = new Web3(provider);

let perfResult;
const perfObserver = new PerformanceObserver((items) => {
    items.getEntries().forEach((entry) => {
        perfResult[entry.name] = entry;
    })
})
perfObserver.observe({entryTypes: ["measure"], buffer: true})

const accAddress = "0x0fbdc686b912d7722dc86510934589e0aaf3b55a";

const abi = [{"constant":true,"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"isWhitelisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address[]","name":"_addr","type":"address[]"}],"name":"isWhitelistedMany","outputs":[{"internalType":"bool[]","name":"","type":"bool[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"removeWhitelist","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address[]","name":"_addrs","type":"address[]"}],"name":"removeWhitelistMany","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"whitelist","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address[]","name":"_addr","type":"address[]"}],"name":"whitelistMany","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];

const bytecode = "0x608060405234801561001057600080fd5b5061063b806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063214e0bb7146100675780633af32abf1461011f5780635edbef251461017b57806378c8cda7146102885780639b19251a146102cc578063a77f7c8c14610310575b600080fd5b61011d6004803603602081101561007d57600080fd5b810190808035906020019064010000000081111561009a57600080fd5b8201836020820111156100ac57600080fd5b803590602001918460208302840111640100000000831117156100ce57600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f8201169050808301925050505050505091929192905050506103c8565b005b6101616004803603602081101561013557600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610404565b604051808215151515815260200191505060405180910390f35b6102316004803603602081101561019157600080fd5b81019080803590602001906401000000008111156101ae57600080fd5b8201836020820111156101c057600080fd5b803590602001918460208302840111640100000000831117156101e257600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f820116905080830192505050505050509192919290505050610459565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b83811015610274578082015181840152602081019050610259565b505050509050019250505060405180910390f35b6102ca6004803603602081101561029e57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506104ef565b005b61030e600480360360208110156102e257600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061055c565b005b6103c66004803603602081101561032657600080fd5b810190808035906020019064010000000081111561034357600080fd5b82018360208201111561035557600080fd5b8035906020019184602083028401116401000000008311171561037757600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f8201169050808301925050505050505091929192905050506105ca565b005b60008090505b8151811015610400576103f38282815181106103e657fe5b60200260200101516104ef565b80806001019150506103ce565b5050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff169050919050565b606080825160405190808252806020026020018201604052801561048c5781602001602082028038833980820191505090505b50905060008090505b83518110156104e5576104ba8482815181106104ad57fe5b6020026020010151610404565b8282815181106104c657fe5b6020026020010190151590811515815250508080600101915050610495565b5080915050919050565b6104f881610404565b61050157610559565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055505b50565b61056581610404565b1561056f576105c7565b60016000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055505b50565b60008090505b8151811015610602576105f58282815181106105e857fe5b602002602001015161055c565b80806001019150506105d0565b505056fea265627a7a72315820f52aef506493a9a05fa316bfbad90bc1fde99de84f3002b4c38b37b51eb1064a64736f6c63430005110032";
const simpleContract = new web3.eth.Contract(abi);

web3.utils.hexToNumber = v => {
    if (!v) {
        return v;
    }
    return parseInt(Number(v), 10);
};

web3.eth.extend({
    methods: [{
        name: 'getExecutionResults',
        call: 'eth_getExecutionResults',
        params: 1
    }]
});

web3.eth.transactionBlockTimeout = 100000;

let globalNonce = 0;

const makeTestParameters = (batchAccountsToPreset, batchSize, positiveReadPercentage, readBatchSize) => {
    return {
        batchAccountsToPreset: batchAccountsToPreset,
        batchSize: batchSize,
        positiveReadPercent: positiveReadPercentage,
        readBatchSize: readBatchSize,
        randomId: JSON.stringify(Math.floor(Math.random() * 10000))
    };
};

const makeAllTestCombinations = (batchAccountsToPreset, batchSize, positiveReadPercentage, readBatchSize) => {
    let parameterSet = [];

    for (let b = 0; b < batchAccountsToPreset.length; b++) {
        for (let c = 0; c < batchSize.length; c++) {
            for (let d = 0; d < positiveReadPercentage.length; d++) {
                for (let e = 0; e < readBatchSize.length; e++) {
                    let para = makeTestParameters(batchAccountsToPreset[b], batchSize[c], positiveReadPercentage[d], readBatchSize[e]);
                    parameterSet.push(para);
                }
            }
        }
    }

    return parameterSet;
};

const createRandomAddress = () => {
    let size = 40;
    let result = [];
    let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

    for (let n = 0; n < size; n++) {
        result.push(hexRef[Math.floor(Math.random() * 16)]);
    }
    return '0x' + result.join('');
}

const testParameters = makeAllTestCombinations(
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10], //number of txns to whitelist accounts
    [10, 200], //number of accounts to whitelist per tx
    [0, 0.5, 1],
    [1, 10, 100] //number of accounts to read per tx
);

// console.log(JSON.stringify(testParameters));
// return;

let testResults = [];

let whitelistedAccountsList = [];

async function deploy() {
    return simpleContract
        .deploy({data: bytecode})
        .send({from: accAddress, gas: 1500000});
}

async function whitelistMany(whitelistContract, batchSize, useExisting, id) {
    let current = [];
    for (let i = 0; i < batchSize; i++) {
        let addr = createRandomAddress();
        if (useExisting) {
            addr = whitelistedAccountsList[Math.floor(Math.random() * whitelistedAccountsList.length)];
        }
        current.push(addr);
        whitelistedAccountsList.push(addr);
    }

    return whitelistContract.methods.whitelistMany(current)
        .send({from: accAddress, gas: 14000000, nonce: globalNonce++, tstId: id})
        .then(function (receipt) {
                return {
                    gas: receipt.gasUsed
                }
            }
        );
}

async function testIsWhitelisted(whitelistContract, addressList, id) {
    return whitelistContract.methods.isWhitelistedMany(addressList)
        .send({from: accAddress, gas: 10000000, nonce: globalNonce++, tstId: id})
        .then(function (receipt) {
            return {gas: receipt.gasUsed};
        });
}

// whitelists addresses already whitelisted
async function whitelistDuplicates(whitelistContract, testSizes) {
    //deploy preset accounts
    performance.mark("write-dup-start")
    let results = [];
    let promises = [];
    for (let i = 0; i < testSizes.batchAccountsToPreset; i++) {
        console.log("Running dup batch " + i + " of " + (testSizes.batchAccountsToPreset));
        promises.push(whitelistMany(whitelistContract, testSizes.batchSize, true, testSizes.randomId + "-writedup"));
    }
    console.log("Waiting for promises...")
    let res = await Promise.all(promises);
    results = results.concat(res);
    performance.mark("write-dup-end")

    let deployBatchMinCost = Infinity;
    let deployBatchMaxCost = 0;
    let gasTotal = 0;

    for (let i = 0; i < results.length; i++) {
        deployBatchMinCost = Math.min(deployBatchMinCost, results[i].gas);
        deployBatchMaxCost = Math.max(deployBatchMaxCost, results[i].gas);
        gasTotal += results[i].gas;
    }
    gasTotal /= results.length;
    let gasPerAddress = gasTotal / testSizes.batchSize;

    return {
        min: deployBatchMinCost,
        max: deployBatchMaxCost,
        range: deployBatchMaxCost - deployBatchMinCost,
        avg: gasTotal,
        avgPerAddress: gasPerAddress
    };
}

async function runReadTest(whitelistContract, testSizes) {
    performance.mark("read-start")

    //deploy preset accounts
    let results = [];
    let promises = [];
    for (let i = 0; i < testSizes.batchAccountsToPreset; i++) {
        console.log("Running reading batch " + i + " of " + (testSizes.batchAccountsToPreset));
        let addrsToSearch = [];
        for (let k = 0; k < testSizes.readBatchSize; k++) {
            let addrToSearch;
            if (testSizes.positiveReadPercent < Math.random()) {
                addrToSearch = whitelistedAccountsList[Math.floor(Math.random() * whitelistedAccountsList.length)];
            } else {
                addrToSearch = createRandomAddress();
            }
            addrsToSearch.push(addrToSearch);
        }
        promises.push(testIsWhitelisted(whitelistContract, addrsToSearch, testSizes.randomId + "-read"));
    }
    console.log("Waiting for promises...")
    let res = await Promise.all(promises);
    results = results.concat(res);

    performance.mark("read-end")

    let deployBatchMinCost = Infinity;
    let deployBatchMaxCost = 0;
    let gasTotal = 0;

    for (let i = 0; i < results.length; i++) {
        deployBatchMinCost = Math.min(deployBatchMinCost, results[i].gas);
        deployBatchMaxCost = Math.max(deployBatchMaxCost, results[i].gas);
        gasTotal += results[i].gas;
    }
    gasTotal /= results.length;
    let gasPerAddress = gasTotal / testSizes.readBatchSize;

    return {
        min: deployBatchMinCost,
        max: deployBatchMaxCost,
        range: deployBatchMaxCost - deployBatchMinCost,
        avg: gasTotal,
        avgPerAddress: gasPerAddress
    };
}

async function runDeployFullTest(whitelistContract, testSizes) {
    //deploy preset accounts
    performance.mark("write-start")
    let results = [];
    let promises = [];
    for (let i = 0; i < testSizes.batchAccountsToPreset; i++) {
        console.log("Running batch " + i + " of " + (testSizes.batchAccountsToPreset));
        promises.push(whitelistMany(whitelistContract, testSizes.batchSize, false, testSizes.randomId + "-write"));
    }
    console.log("Waiting for promises...")
    let res = await Promise.all(promises);
    results = results.concat(res);
    performance.mark("write-end")

    let deployBatchMinCost = Infinity;
    let deployBatchMaxCost = 0;
    let gasTotal = 0;

    for (let i = 0; i < results.length; i++) {
        deployBatchMinCost = Math.min(deployBatchMinCost, results[i].gas);
        deployBatchMaxCost = Math.max(deployBatchMaxCost, results[i].gas);
        gasTotal += results[i].gas;
    }
    gasTotal /= results.length;
    let gasPerAddress = gasTotal / testSizes.batchSize;

    return {
        min: deployBatchMinCost,
        max: deployBatchMaxCost,
        range: deployBatchMaxCost - deployBatchMinCost,
        avg: gasTotal,
        avgPerAddress: gasPerAddress
    };
}


async function run() {
    let header = [
        "id, number of read txs", "number of write txs", "number of addresses per write", "% of reads positive", "addresses read per tx",
        "write avg for tx", "write avg per address",
        "read avg for tx", "read avg for address",
        "write existing avg for tx", "write existing avg for address",
        "reading avg execution time", "write avg execution time", "write existing avg execution time",
        "reading total execution time", "write total execution time", "write existing total execution time"
    ].join(",");

    console.error(header);

    for (let i = 0; i < testParameters.length; i++) {
        console.log("Running test " + (i+1) + "/" + testParameters.length);

        perfResult = {};
        whitelistedAccountsList = [];

        let whitelistContract = await deploy();
        globalNonce = await web3.eth.getTransactionCount(accAddress);

        let deployResult = await runDeployFullTest(whitelistContract, testParameters[i]);
        testResults.push({deploy: deployResult});

        testResults[i]["reading"] = await runReadTest(whitelistContract, testParameters[i]);
        testResults[i]["writedup"] = await whitelistDuplicates(whitelistContract, testParameters[i]);
        console.log("Here")
        testResults[i]["parameters"] = testParameters[i];

        performance.measure("write", "write-start", "write-end")
        performance.measure("writedup", "write-dup-start", "write-dup-end")
        performance.measure("reading", "read-start", "read-end")

        // testResults[i]["timings"] = perfResult;
        testResults[i]["timings"] = {
            reading: 0,//JSON.parse(await web3.eth.getExecutionResults(testParameters[i].randomId + "-read")),
            write: 0,// JSON.parse(await web3.eth.getExecutionResults(testParameters[i].randomId + "-write")),
            writedup: 0// JSON.parse(await web3.eth.getExecutionResults(testParameters[i].randomId + "-writedup")),
        }

        console.error(convertResultToCsv(testResults[i]));

        await sleep(1000);
    }

    // console.error(JSON.stringify(testResults, null, 2));

    return null;
}

function convertResultToCsv(result) {
    // top level
    let deploy = result.deploy;
    let reading = result.reading;
    let writedup = result.writedup;
    let paras = result.parameters;
    let timings = result.timings;

    //individual results
    let deployavg = deploy.avg;
    let deployavgPerAddress = deploy.avgPerAddress;

    let readingavg = reading.avg;
    let readingavgPerAddress = reading.avgPerAddress;

    let writedupavg = writedup.avg;
    let writedupavgPerAddress = writedup.avgPerAddress;

    let timingsReadTime = timings.reading.avg/1000;
    let timingsDeployTime = timings.write.avg/1000;
    let timingsWriteDupTime = timings.writedup.avg/1000;

    return [
        paras.randomId,
        paras.batchAccountsToPreset, paras.batchAccountsToPreset, paras.batchSize, paras.positiveReadPercent, paras.readBatchSize,
        toInt(deployavg), toInt(deployavgPerAddress),
        toInt(readingavg), toInt(readingavgPerAddress),
        toInt(writedupavg), toInt(writedupavgPerAddress),
        toInt(timingsReadTime), toInt(timingsDeployTime), toInt(timingsWriteDupTime),
        toInt(timings.reading.duration), toInt(timings.write.duration), toInt(timings.writedup.duration)
    ].join(",")
}

function toInt(num) {
    return parseInt(num, 10);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    await run();
    process.exit(0);
})();
