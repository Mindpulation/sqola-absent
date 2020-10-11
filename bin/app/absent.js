const absentHandlers =  require('../modules/absent/handlers/handler')
const express = require('express');
const app = express.Router();

app.post("/insert",async (req, res) => {
    await absentHandlers.InsertDataAbsent(req, res)
});
app.put("/update",async (req, res) => {
    await absentHandlers.UpdatePresentStudent(req, res)
});

module.exports = app;
