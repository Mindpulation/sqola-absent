const config = require('config')
const Mongo = require('mongooo').Mongooo;
const { save } = require('mongooo').Save;
const { del } = require('mongooo').Delete;
const { find, findOne } = require('mongooo').Find;
const { set } = require('mongooo').Update;
const {uuid : uuidv4} =  require('uuid');
const httpClient = require('../../../helpers/utils/httpClient');

const mongo = new Mongo();

let con;
(async () => {
    con = await mongo.setup(config.get('mongoDbStudentUrl'), config.get('mongoDbStudent'), config.get('mongoDbStudentCol'));
})()

const insertData = async (payloadData) => {
    const result = {
        "err" : true,
        "message" : "Failed to insert absent data"
    }
    try{
        const getStudentClass = async (idMapel) => {
            const daftarMuridByKelas = [];
            const classFromIdMapel = await httpClient.sendRequest('POST', config.get('teacherBaseEndpoint'), config.get('teacherFindEndpoint'), '', '', {"_id" : idMapel});
            const daftarMurid = await httpClient.sendRequest('POST', config.get('studentBaseEndpoint'), config.get('studentFindEndpoint'), '', '', {"class" : classFromIdMapel.class});
            daftarMurid.map( arr => {
                daftarMuridByKelas.push(arr.name);
            });
            return daftarMuridByKelas;
        }
        const payload = {
            "emailGuru" : payloadData.data.email,
            "idMadel" : payloadData.data.idMapel,
            "startDate" : payloadData.data.startDate,
            "endDate" : payloadData.data.endDate,
            "status" : true,
            "verifyStatus" : false,
            "present" : [],
            "noPresent" : getStudentClass(payloadData.data.idMapel)
        }
        const dbResult = await save(con, payload);
        if(dbResult) {
            result.err = false;
            result.message = "Success inserted absent"
        }
    }catch (e) {
        const tickets = uuidv4;
        result.err = true,
        result.message = "Something went wrong"
        result.ticketId = tickets
        new Error(`Error : ${e}, ticketId : ${tickets}`);
        console.log(`command-insertData [x] Error : ${e}, \nTicketId : ${tickets}`);
    }
    console.log(result)
    return result;
}

const updateData = async (payloadData) => {
    const result = {
        "err" : true,
        "message" : "Failed to update present data"
    };
    try{
        const payload = {
            "idMapel" : payloadData.data.idMapel,
            "endDate" : { $lt: payloadData.data.endDate },
        }

        const namaMurid = await httpClient.sendRequest('POST', config.get('studentBaseEndpoint'), config.get('studentFindEndpoint'), '', '', {"email" : payloadData.data.email});
        const dbResult = await find(con, payload);
        if(!dbResult){
            return {
                err : true,
                message : "Absent was expired"
            }
        }
        const swapNoPresentToPresent = async () => {
            let insertToPresent = await set(con, dbResult._id, { $push : { present : namaMurid } });
            let deleteNoPresent = await set(con, dbResult._id, { $pull : { noPresent : namaMurid } });
            return await Promise.all([insertToPresent, deleteNoPresent])
        }

        if(swapNoPresentToPresent().length !== 2){
            result.err = true,
            result.message = "Failed absent"
        } else {
            result.err = false,
            result.message = "Success to absent"
        }
    }catch (e) {
        const tickets = uuidv4;
        result.err = false,
        result.message = "Something went wrong"
        result.ticketId = tickets
        new Error(`Error : ${e}, ticketId : ${tickets}`);
        console.log(`command-compareData [x] Error : ${e}, \nTicketId : ${tickets}`);
    }
    console.log("Ini result signin : ", result)
    return result;
}
//
// const updateData = async (payloadData) => {
//     const result = {
//         "err" : true,
//         "message" : "Failed to update student data"
//     };
//     try{
//         const payloads = (payloadData) => {
//             delete payloadData.data.findEmail
//             const data = {
//                 ...payloadData.data
//             }
//             return data
//         }
//         const dbResult = await set(con, {"email" : payloadData.data.findEmail}, payloads(payloadData));
//         if(!dbResult){
//             result.err = true,
//                 result.message = "Failed to update student data"
//         } else {
//             result.err = false,
//                 result.message = "Success to update"
//         }
//     }catch (e) {
//         const tickets = uuidv4;
//         result.status = false,
//             result.result = "Something went wrong"
//         result.ticketId = tickets
//         new Error(`Error : ${e}, ticketId : ${tickets}`);
//         console.log(`command-updateData [x] Error : ${e}, \nTicketId : ${tickets}`);
//     }
//     return result;
// }
//
// const deleteDataStudent = async (payloadData) => {
//     const result = {
//         "err" : true,
//         "message" : "Failed to delete student data"
//     };
//     try{
//         const dbResult = await del(con, payloadData.data)
//         if(dbResult == null || dbResult == undefined || dbResult == ""){
//             result.err = true,
//                 result.message = "Email not found"
//         } else {
//             result.err = false,
//                 result.message = "Success to delete user ", payloadData.data;
//         }
//     }catch (e) {
//         const tickets = uuidv4;
//         result.err = true,
//             result.message = "Something went wrong"
//         result.ticketId = tickets
//         new Error(`Error : ${e}, ticketId : ${tickets}`);
//         console.log(`command-deleteData [x] Error : ${e}, \nTicketId : ${tickets}`);
//     }
//     return result;
// }
//
// const findData = async (payloadData) => {
//     const result = {
//         "err" : true,
//         "message" : "Failed to find student data"
//     };
//     try{
//         const dbResult = await find(con, payloadData.data, {});
//         if(dbResult == null || dbResult == undefined || dbResult == ""){
//             result.err = true,
//                 result.message = "Data not found"
//         } else {
//             result.err = false,
//                 result.message = dbResult;
//         }
//     }catch (e) {
//         const tickets = uuidv4;
//         result.err = true,
//             result.message = "Something went wrong"
//         result.ticketId = tickets
//         new Error(`Error : ${e}, ticketId : ${tickets}`);
//         console.log(`command-findData [x] Error : ${e}, \nTicketId : ${tickets}`);
//     }
//     return result;
// }

module.exports = {
    insertData,
    // compareData,
    updateData,
    // deleteDataStudent,
    // findData
}
