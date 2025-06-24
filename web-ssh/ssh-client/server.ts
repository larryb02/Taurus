import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { Pty } from './pty.js';
import { logger } from './logger/logger.js';
// entry point for terminal session 

const port = 3001
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  }
});


io.on("connection", async (socket) => {
  logger.info(`User connected to socket: ${socket.id}`);
  socket.once("connection-info", async (connection_id: number) => {
    try {
      console.log(`Id: ${connection_id} Type: ${typeof connection_id}`);
      const res = await fetch(`http://localhost:8000/api/ssh/connection/${connection_id}`);
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        socket.disconnect();
        console.error(`Failed to fetch: ${res.status} ${res.statusText}`);
      }
      const { username, hostname, credentials } = data;
      const pw = credentials['credentials'];
      new Pty(socket, { username, hostname, pw });
    }
    catch (err) {
      socket.emit("err", "Failed to establish connection")
      socket.disconnect();
      throw new Error(`Failed to fetch: ${err}`);
    }
  });
});

httpServer.listen(port, () => {
  logger.info(`server listening on ${port}`);
  // console.log(`server listening on ${port}`);
}), () => { logger.error("Failed to resolve promise."); };