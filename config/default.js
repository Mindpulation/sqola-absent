require('dotenv').config()

module.exports = {
    pathStudentEndpoint: process.env.PATH_STUDENT_ENDPOINT,
    dnsSentryUrl: process.env.DSN_SENTRY_URL,
    ports: process.env.PORT,
    mongoDbStudentUrl: process.env.MONGO_URL,
    mongoDbStudent: process.env.MONGO_DB,
    mongoDbStudentCol: process.env.MONGO_COL,
    teacherBaseEndpoint : process.env.TEACHER_BASE_ENDPOINT,
    teacherFindEndpoint : process.env.TEACHER_FIND_ENDPOINT,
    studentFindEndpoint : process.env.STUDENT_FIND_ENDPOINT,
    studentBaseEndpoint : process.env.STUDENT_BASE_ENDPOINT,
}
