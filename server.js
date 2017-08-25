/**
 * This is the main Express app.
 */

// Dependencies
const express       = require('express');
const express_socket= require('express');
const favicon       = require('serve-favicon');
const fs            = require('fs');
const http          = require('http');
const path          = require('path');

// Express Middleware
const bodyParser    = require('body-parser');
const morgan        = require('morgan');

// This app's modules
const socket        = require('./socket');

// Read `.env` into `process.env`
require('dotenv').config({
  silent: true,
});

// Load nconf environment variable defaults
require('nconf').env().defaults({
  NODE_ENV: 'development',
});

// Load environment
const env = require('./env');
// Create Express App
const main = express();

// HTTPS Forwarding
// Needed for Heroku / Load Balancers
main.enable('trust proxy');

// Body parsing
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: true }));

// Get session ID from header
main.use((req, res, next) => {
  req.sessionID = req.get('x-session') || null;
  next();
});

//Serve Angular App to Browser upon GET / request
main.use(express.static(path.join(__dirname, 'dist')));
var faviconPath = path.join(__dirname, 'dist/assets', 'razoyo-favicon.gif');
if (fs.existsSync(faviconPath)) {
  main.use(favicon(faviconPath));
}


// Logging
main.use(morgan('short'));
//
// Use API routes
main.use(require('./api')(env));

// Start the HTTP server
const server = http.createServer(main);

// Start the socket server
const app = http.createServer(express_socket);

// Initialize socket.io
socket.init(app, env.SOCKET_PORT);

server.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`\nExpress Server [PORT: ${env.PORT}] [NODE_ENV: ${env.NODE_ENV}]\n`);
});
