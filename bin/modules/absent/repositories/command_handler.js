const command = require('./command');

const insertDataAbsent = (payloadDataAbsent) => {
    return command.insertData(payloadDataAbsent);
}

const updateDataAbsent = (payloadUpdateAbsent) => {
    return command.updateData(payloadUpdateAbsent)
}

module.exports = {
    insertDataAbsent,
    updateDataAbsent
}
