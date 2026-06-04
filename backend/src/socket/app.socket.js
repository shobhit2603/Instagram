import { Server } from "socket.io";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import Message from "../models/message.model.js";

export default function (server) {
  const io = new Server(server, {
    cors: {
      origin: config.FRONTEND_URL,
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
      const decoded = jwt.verify(token, config.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(err);
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.join(socket.user.id);

    socket.on("send_message", async (data) => {
      const { message, receiver } = data;
      const senderId = socket.user.id;

      try {
        // Save message to database
        const savedMessage = await Message.create({
          sender: senderId,
          receiver: receiver,
          content: message,
        });

        const messagePayload = {
          _id: savedMessage._id,
          content: savedMessage.content,
          sender: senderId,
          receiver: receiver,
          createdAt: savedMessage.createdAt,
        };

        io.to(receiver).emit("receive_message", messagePayload);

        socket.emit("message_sent", messagePayload);
      } catch (err) {
        console.error("Error saving message:", err);
        socket.emit("message_error", { error: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      socket.leave(socket.user.id);
    });
  });
}
