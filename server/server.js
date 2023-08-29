const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { log } = require("console");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

// app.get("/getRandomGif", async (req, res) => {
//   try {
//     const apiKey = process.env.GIPHY_API_KEY;
//     const response = await fetch(
//       `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}`
//     );
//     const data = await response.json();
//     const randomGifUrl = data.data.url;

//     res.json({ randomGifUrl });
//   } catch (error) {
//     console.error("Error fetching random GIF", error);
//     res.status(500).json({ error: "An error occurred while fetching the GIF" });
//   }
// });

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

  socket.on("fetch_random_gif", async () => {
    try {
      const apiKey = process.env.GIPHY_API_KEY;
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}`
      );
      // const randomGifUrl = response.data.data.image_url;
      const data = await response.json();
      const randomGifUrl = data.data.images.downsized.url;
      socket.emit("random_gif_fetched", randomGifUrl);
      console.log(randomGifUrl);
    } catch (error) {
      console.error("Error fetching random gif", error);
    }
  });

  socket.on("send_message", (message) => {
    socket.to(message.room).emit("incoming_message", message);
  });

  socket.on("disconnect", () => {
    const roomList = convertMapOfSetsToObjectOfArrays(io.sockets.adapter.rooms);
    io.emit("Updated_rooms", roomList);
  });
});

function convertMapOfSetsToObjectOfArrays(mapOfSets) {
  const objectOfArrays = {};

  if (!mapOfSets.has("Lobby")) {
    mapOfSets.set("Lobby", new Set());
  }

  for (const [key, set] of mapOfSets) {
    // if (!set.has(key)) {
    //   objectOfArrays[key] = Array.from(set);
    // }
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

// En funktion som tar in inbyggda listan. rad 32 skickas den in.
// skapar ett objekt, tomt, ibject of arrays, sen loopar vi igenom mapsofset
// key rumsnamnet, set är alla id på alla socket som är inne i rummet
// skapar rad 46 ny nyckel på nytt sett
// Gör om set till array. Map till objekt
// rad 32 33 join room och disconnect, behöver inte leave room, för leavar room när man joinar room
// lyssna på klient från updated room, sätt ett state när vi tar emot den.adapter
// updatedroomlist kommer alltid vara aktuell kmr uppdateras automatiskt när vi byggt logiken på serverv
// Se om vi kan skriva ut alla rum som finns
// Kolla om rummet försvinner om ingen är i det genom funktionen vi byggt

// HANDLEDNING2
// disconnect sker automatiskt när man öppnar/stäng webbläsare/stänger flik
// använd disconnect.
// det är ett set, får ej finnas dubletter, det är som en array utan dubletter
// ett rum måste försvinna från listan om det inte finns användare i.
// har massa rum, användare i rummen, loopar igenom användare i varje rum
//

// HANDLEDNING 1
// Utöka joinroom, en disconnect, gör en variabel som innehåller all data.adapter
// variabeln ska innehålla en lista med objekt
// Ha "logiken" på servern och emitta den till klienten
// En klient kan vara 100 olika, men servern är bara en - ta med det
// servern pratar med databas, men har ingen databas.
// Klienten har ett state som håller koll på vilket rum vi är i.adapter
// klienten - sätter state till det nya rummet - triggar event till server
// det som triggas - joinroom eventet
// vi vill in i nytt rum, så skickas det till join room.
//en egen variabel, const rooms - den måste matcha, finns rummet nej, skapa rum, och se till att användaren är inne
// finns rummet, så ska bara användaren in.
// Logga ut. console. usernames, id?
// leave room - nej, join room disconnect - ja.
// arrayer, objekt,
// Få roomslistan att matcha  (socket.join, leave, disconnect - automatiskt)
// egen lista med username ist för id.
// sista vi gör skickar ut rumslistan.
// pushraden kommer bli längre, if-satser och grejer.
// ist för rooms.push, gör att datatstrukter matchar med vår variabel.

server.listen(3000, () => console.log("Servern är igång"));
