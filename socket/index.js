const express       = require('express');
const socket        = module.exports;

const path          = require('path');

var socketOn = null;

socket.init = (server, port) => {

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`\nSocket Server [PORT: ${port}]\n`);
  });

  const io = require('socket.io')(server);

  io.on('connection', (socket) => {
    console.log('made socket connection, id = ', socket.id);
    socketOn = socket;
  });
};

socket.toId = (socketId, message, data) => {
  console.log(`socketId = ${socketId}, message = ${message}`);
  if (socketOn) {
    socketOn.broadcast.io(socketId).emit(message, data);
  }
  else {
    throw new Error('socket not initialized');
  }
};
