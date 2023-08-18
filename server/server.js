const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { log } = require("console");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("New user connected: ", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(io.sockets.adapter.rooms);
  });
});

server.listen(3000, () => console.log("Servern är igång"));
