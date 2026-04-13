import app from "../app.js";
import { Server } from "socket.io";
import http from "http";

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });

  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });
});

export default server;
