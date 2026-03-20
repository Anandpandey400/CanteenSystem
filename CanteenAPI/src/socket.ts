import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*", // ✅ TEMP allow all (test first)
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"], // ✅ important
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);
  });
};

export const getIO = () => io;