// BiteRoute / Server / socket.js
export const socketHandler = async (io) => {
  io.on("connection", (socket) => {
    console.log("Socket ID:", socket.id);
  });
};
