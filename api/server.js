const logger = require('./logger/logger')
require('dotenv').config({path: './.env'});
const app = require('./app');
const http = require('http');

//- Mock server - redirects to https
let server = http.createServer(app).listen(80);
server.on('listening', onListening);

function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  logger.info(`[${process.env.NODE_ENV}] Listening on this ${bind}`);
}
