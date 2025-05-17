// import * as os from 'node:os';
import * as pty from 'node-pty';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
// import next from 'next';
import { Pty } from './pty.mjs';

// entry point for terminal session

// const dev = process.env.NODE_ENV !== "production";
// const hostname = "localhost";
const port = 3001
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
});


io.on("connection", async (socket) => {
  console.log("user connected to socket");
  new Pty(socket);

});

httpServer.listen(port, () => {
  console.log(`server listening on ${port}`);
}), () => { console.log(`failed to resolve promise.`) };