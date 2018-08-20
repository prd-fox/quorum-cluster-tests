let transactionSender = require("./send_transaction.js");
let loopFunc = transactionSender.run(5, 'public', 'private');
loopFunc();