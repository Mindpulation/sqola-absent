const command = require('./command');

const insertDataAbsent = (payloadDataSignup) => {
    return command.insertData(payloadDataSignup);
}

module.exports = {
    insertDataAbsent
}
