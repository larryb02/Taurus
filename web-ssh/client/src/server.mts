import * as os from 'node:os';
import * as pty from 'node-pty';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import next  from 'next';

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer);

  io.on("connection", async (socket) => {
    console.log("user connected to socket");
    socket.on("disconnect", () => {
      console.log("user has disconnected from socket.");
    })
  })

  httpServer.listen(3000, () => {
    console.log(`server listening on port 3000`);
  });
});



// const ptyProcess = pty.spawn(shell, [], {
//   name: 'xterm-color',
//   cols: 80,
//   rows: 30,
//   cwd: process.env.HOME,
//   env: process.env
// });

// ptyProcess.onData((data) => {
//   process.stdout.write(data);
// });

// ptyProcess.write('ls\r');
// ptyProcess.resize(100, 40);
// ptyProcess.write('ls\r');