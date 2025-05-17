// import * as os from 'node:os';
import * as pty from 'node-pty';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import next from 'next';

// entry point for terminal session

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
// const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer);

  
  io.on("connection", async (socket) => {
    console.log("user connected to socket");

    const ptyProcess = pty.spawn("ssh", ["cis-linux2.temple.edu"], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.env.HOME,
      env: process.env
    });

    ptyProcess.onData(chunk => {
      // process.stdout.write(chunk);
      socket.emit("pty:output", chunk);
    });

    socket.on("terminal:input", (chunk) => {
      console.log(`terminal:input event received: ${chunk}`);
      ptyProcess.write(chunk);
    });

    socket.on("disconnect", () => {
      console.log("user has disconnected from socket.");
      ptyProcess.kill();
    });

    ptyProcess.onExit((e) => {
      console.log(`Shell process terminated: ${e.exitCode}`);
    });

  });

  httpServer.listen(3000, () => {
    console.log(`server listening on port 3000`);
  }), () => {console.log(`failed to resolve promise.`)};
});