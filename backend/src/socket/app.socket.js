import { Server } from "socket.io";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js"

export default function (server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const cookie = socket.handshake.headers.cookie;


    if (!cookie) {
      return next(new Error("Authentication error: No token provided"));
    }

    const token = parse(cookie).token;

    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(err);
    }
  });

  io.on("connection", (socket) => {
    console.log('A user connected:', socket.id);
    console.log(socket.user);

    socket.join(socket.user.id);

    socket.on('send_message', data => {
      const { message, receiver } = data;
      io.to(receiver).emit('receive_message', {
        message,
        sender: socket.user.id,
      });
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
      socket.leave(socket.user.id);
    });
  });
}
