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

  socket.on("join_room", (room, username) => {
    socket.leave(socket.room);
    socket.join(room);
    socket.room = room;
    socket.username = username;
    const roomList = convertMapOfSetsToObjectOfArrays(io.sockets.adapter.rooms);
    io.emit("Updated_rooms", roomList);
  });

  socket.on("user_typing", (data) => {
    socket.to(socket.room).emit("typing_status", data.isTyping, data.username);
  });

  socket.on("send_message", (message) => {
    socket.to(message.room).emit("incoming_message", message);
  });

  socket.on("disconnect", () => {
    const roomList = convertMapOfSetsToObjectOfArrays(io.sockets.adapter.rooms);
    io.emit("Updated_rooms", roomList);

    socket.to(socket.room).emit("user_disconnected");
  });
});

function convertMapOfSetsToObjectOfArrays(mapOfSets) {
  const objectOfArrays = {};

  if (!mapOfSets.has("Lobby")) {
    mapOfSets.set("Lobby", new Set());
  }

  for (const [key, set] of mapOfSets) {
    if (!set.has(key)) {
      const userArray = Array.from(set).map((socketId) => {
        const socket = io.sockets.sockets.get(socketId);
        return socket ? socket.username : "Unknown";
      });
      objectOfArrays[key] = userArray;
    }
  }

  return objectOfArrays;
}

server.listen(3000, () => console.log("Servern är igång"));
