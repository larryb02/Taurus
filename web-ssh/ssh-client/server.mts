import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { Pty } from './pty.mts';
import { logger } from '../logger/logger.mts';

// entry point for terminal session

// const dev = process.env.NODE_ENV !== "production";
// const hostname = "localhost";
const port = 3001
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  }
});


io.on("connection", async (socket) => {
  logger.info(`User connected to socket: ${socket.id}`);
  socket.on("sessionData", (destination) => {
    new Pty(socket, "user", destination);
  });
});

httpServer.listen(port, () => {
  logger.info(`server listening on ${port}`);
  // console.log(`server listening on ${port}`);
}), () => { logger.error("Failed to resolve promise."); };