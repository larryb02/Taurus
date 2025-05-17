"use client";
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { useEffect } from 'react';
import io  from 'socket.io-client';

export default function terminal() { // need to resolve naming conflicts...
    const term = new Terminal();
    const socket = io("http://localhost:3001");
    useEffect(() => {
    if (document.getElementById('terminal')){
      term.open(document.getElementById('terminal') as HTMLElement);
    }
  }, []);

  term.onData(data => {
    console.log(`sending input event: ${data}`);
    socket.emit("terminal:input", data);
  });

  socket.on("pty:output", (chunk) => {
    term.write(chunk);
  })

  return (
    <div>
      <div id="terminal"></div>
    </div>
  );
}