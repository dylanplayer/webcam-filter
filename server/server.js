const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);

const config = {
  path: '/',
  cors: {
    origin: "*",
  }
};

const io = new Server(httpServer, config);

io.on("connection", (socket) => {
  socket.on('stream', (frame) => {
    socket.broadcast.emit('stream', frame);
    console.log(frame);
  });
});

httpServer.listen(8001, () => {
  console.log('Server watching 8001');
});
