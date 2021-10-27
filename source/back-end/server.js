const express       = require('express');
const cors          = require('cors');
var http            = require('http');
const bodyParser    = require('body-parser');
const account      = require('./routers/accounts');
const enms          = require('./routers/enms');
const cron          = require('./routers/cron');
// const morgan      = require('morgan');

const app = express()

app.use(bodyParser.json({limit: '50mb',         extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb',   extended: true}));
// app.use(morgan('tiny'));
app.use(cors());

app.use('/api/accounts',  account);
app.use('/api/enms', enms);
app.use('/api/cron', cron);


var httpServer = http.createServer(app);

httpServer.listen(5000,() => {
    console.log('HTTP Server running on port 5000...');
});

module.exports = httpServer;


