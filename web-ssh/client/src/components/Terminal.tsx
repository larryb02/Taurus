"use client";
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export default function terminal() { // need to resolve naming conflicts...
  const term = new Terminal();
  const socketRef = useRef<Socket | null>(null);
  let socket: Socket;


  useEffect(() => {
    if (!socketRef.current) {
      try {
        socket = io("http://localhost:3001");
      }
      catch (err) {
        console.log(`Failed to connect to socket ${err}`);
      }
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Connected: ", socket.id);
      })
    }
    if (document.getElementById('terminal')) {
      term.open(document.getElementById('terminal') as HTMLElement);
    }
    term.onData(data => {
      console.log(`sending input event: ${data}`);
      socket.emit("terminal:input", data);
    });
  
    socket.on("pty:output", (chunk) => {
      term.write(chunk);
    });
  
    socket.on("disconnect", () => {
      console.log(`Disconnected from Socket ${socket.id}`);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  

  return (
    <div>
      <div id="terminal"></div>
    </div>
  );
}