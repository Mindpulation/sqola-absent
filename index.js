const config = require('config');
const express = require('express');
const bp = require('body-parser');
const cors = require('cors');

const server = require('./bin/app/server');
const student = require('./bin/app/absent');
const app = express();


app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use(cors());
app.use('/v1/absent', student);
app.use('/', server);

app.listen(config.get('ports'), (err) => {
    const ctx = "index-listenPort";
    (!err) ? console.log(ctx, `[✔] Server running at http://localhost:${config.get('ports')}`, `running server` )
        :
        console.log(ctx, `[x] Something went wrong, msg:${err}`, `Failed running server` )
    new Error({'ctx' : ctx, 'message' : err})

});
