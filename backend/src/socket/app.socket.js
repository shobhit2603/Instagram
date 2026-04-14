import { Server } from "socket.io";
import { parse } from "cookie";

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
    console.log(parse(cookie));
    next();
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("send_message", (data) => {
      console.log(data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}
