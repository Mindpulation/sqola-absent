const joi = require('joi');

const insert = joi.object({
    emailGuru : joi.string().email({ tlds: { allow: true } }).required(),
    idMapel: joi.string().required(),
    startTime : joi.date().required(),
    endTime : joi.date().required(),
    status : joi.boolean().required(),
    verifiedStatus : joi.boolean().required(),
    present : joi.array().required(),
    noPresent : joi.array().required()
});

module.exports = {
    insert
};
