let transactionSender = require("./send_transaction.js");
let loopFunc = transactionSender.run(5, 'private', 'public');
loopFunc();