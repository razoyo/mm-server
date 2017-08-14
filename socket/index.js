module.exports = function (
  server,
  port
) {

const io = require('socket.io')(server);
  server.listen(port);
  var clients = [];

  io.on('connection', (socket) => {
    console.log('made socket connection, id = ', socket.id);

    socket.on('disconnect', (socket) => {
      // tell other pair it's deleted and remove from clients
      for (let i = 0; i < clients.length; i++) {
        let bRemove = false;
        let client = clients[i];
        if (client.hasOwnProperty('phoneSocketId')) { // check phone
          if (io.sockets.sockets[client.phoneSocketId] == undefined) { // phone disconnected
            bRemove = true;
            if (client.hasOwnProperty('mirrorSocketId')) { // tell mirror
              io.to(client.mirrorSocketId).emit('problem', 'phone disconnected');
            }
          }
        }
        if (!bRemove) { // not phone socket
          if (client.hasOwnProperty('mirrorSocketId')) { // check mirror
            if (io.sockets.sockets[client.mirrorSocketId] == undefined) { // mirror disconnected
              bRemove = true;
              if (client.hasOwnProperty('phoneSocketId')) { // tell phone
                io.to(client.phoneSocketId).emit('problem', 'mirror disconnected');
              }
            }
          }
        }
        if (bRemove) {
          clients.splice(i, 1);
        }
      }
    });
    socket.on('mirror', (code) => {
      let bUpdated = false;
      for (let i = 0; i < clients.length; i++) {
        if (clients[i].mirrorSocketId == socket.id) {
          clients[i].code = code;
          bUpdated = true;
          if (clients[i].hasOwnProperty('phoneSocketId')) {
            socket.broadcast.to(clients[i].phoneSocketId).emit('problem', 'mirror has new code');
            delete clients[i].phoneSocketId;
          }
          break;
        }
      }
      if (!bUpdated) {
        let obj = {};
        obj['mirrorSocketId'] = socket.id;
        obj['code'] = code;
        clients.push(obj);
      }
    });
    socket.on('phone', (code) => {
      let mirrorSocketId = '';
      for (let i = 0; i < clients.length; i++) {
        if (clients[i].code == code &&
            clients[i].hasOwnProperty('mirrorSocketId')) {
          mirrorSocketId = clients[i].mirrorSocketId;
          if (clients[i].hasOwnProperty('phoneSocketId') &&
              clients[i].phoneSocketId !== socket.id) {
            socket.broadcast.to(clients[i].phoneSocketId).emit('problem', '');
          }
          clients[i].phoneSocketId = socket.id;
        }
      }
      if (mirrorSocketId == '') {
        socket.emit('problem', 'no mirror found for that code');
      }
      else {
        socket.broadcast.to(mirrorSocketId).emit('phoneConnected', socket.id);
        socket.emit('mirrorConnected', mirrorSocketId);
      }
    });
  });
};
