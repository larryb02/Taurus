"use client";
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { useEffect, useRef } from 'react';
// import { io, Socket } from 'socket.io-client';
import { socket } from '../socket';

export default function terminal() { // need to resolve naming conflicts...
//   useEffect(() => {
//     const term = new Terminal();
//     console.log(`New terminal instance created`);
//     if (document.getElementById('terminal')) {
//       term.open(document.getElementById('terminal') as HTMLElement);
//     }

//     socket.connect();
//     socket.on("connect", () => {
//       // console.log(destination.destination);
//       socket.emit("sessionData", props.destination);
//       console.log("Connected: ", socket.id);
//     });

//     term.onData(data => {
//       console.log(`sending input event: ${data}`);
//       socket.emit("terminal:input", data);
//     });

//     socket.on("pty:output", (chunk) => {
//       console.log("Received data from pty", chunk);
//       term.write(chunk);
//     });

//     socket.on("disconnect", () => {
//       console.log(`Disconnected from Socket ${socket.id}`);
//     });

//     return () => {
//       socket.off('connect');
//       socket.off('pty:output');
//       socket.off('pty:disconnect');
//       socket.disconnect();
//       term.dispose();
//     };
//   }, []);



  return (
    <div>
      <div id="terminal"></div>
    </div>
  );
}