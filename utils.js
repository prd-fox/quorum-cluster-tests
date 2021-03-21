function toInt(num) {
    console.log(num);
    return parseInt(num, 10);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createRandomAddress() {
    let size = 40;
    let result = [];
    let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

    for (let n = 0; n < size; n++) {
        result.push(hexRef[Math.floor(Math.random() * 16)]);
    }
    return '0x' + result.join('');
}

function hexToNumber(v) {
    if (!v) {
        return v;
    }
    return parseInt(Number(v), 10);
}

module.exports = {
    toInt,
    sleep,
    createRandomAddress,
    hexToNumber
}