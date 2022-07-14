const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//Whenever someone connects this gets executed
io.on("connection", function (socket) {
  console.log("A user connected");
  socket.on("elements-change", (data) => {
    socket.broadcast.emit("get-elements-change", data);
  });

  //Whenever someone disconnects this piece of code executed
  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});
