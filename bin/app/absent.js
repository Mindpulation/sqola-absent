const absentHandlers =  require('../modules/absent/handlers/handler')
const express = require('express');
const app = express.Router();

app.post("/insert",async (req, res) => {
    await absentHandlers.InsertDataAbsent(req, res)
});
app.get("/update",async (req, res) => {
    await absentHandlers.UpdatePresentStudent(req, res)
});
// app.put("/",async (req, res) => {
//     await studentHandlers.UpdateStudent(req, res)
// });
// app.delete("/:userId",async (req, res) => {
//     await studentHandlers.DeleteStudent(req, res)
// });

module.exports = app;
