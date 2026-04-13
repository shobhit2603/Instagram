import { io } from "socket.io-client";

let socket;

export const connectSocket = (userId) => {
  if (socket) return;
  socket = io("http://localhost:3000", {
    query: { userId },
  });
  console.log("Socket Connected for user:", userId);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket Disconnected");
  }
};

export const addListener = (event, callback) => {
  if (socket) socket.on(event, callback);
};

export const removeListener = (event, callback) => {
  if (socket) socket.off(event, callback);
};

export const emitEvent = (event, msg) => {
  if (socket) socket.emit(event, msg);
};