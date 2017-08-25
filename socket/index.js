//var socketOn;

module.exports = (server, port) => {

  const io = require('socket.io')(server);
  server.listen(port);

  io.on('connection', (socket) => {
    console.log('made socket connection, id = ', socket.id);
//    socketOn = socket;
  });
};

/*
exports.toId = (socketId, message, data) => {
  socketOn.broadcast.io(socketId).emit(message, data);
};
*/
