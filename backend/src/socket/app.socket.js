import { Server } from "socket.io";
import { parse } from "cookie";

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

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
    if (cookie) {
      const parsedCookies = parse(cookie);
      const userId = socket.handshake.auth.userId;
      if (userId) {
        socket.userId = userId;
        return next();
      }
    }
    return next(new Error("Authentication error"));
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id, "User ID:", socket.userId);

    if (socket.userId) {
      userSocketMap[socket.userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      if (socket.userId) {
        delete userSocketMap[socket.userId];
      }
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
}
