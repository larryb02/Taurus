"use client";
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { useEffect } from 'react';

export default function terminal() { // need to resolve naming conflicts...
  useEffect(() => {
    const term = new Terminal();
    if (document.getElementById('terminal')){
      term.open(document.getElementById('terminal') as HTMLElement);
      term.write('$');
    }
  }, []);
  return (
    <div>
      <div id="terminal"></div>
    </div>
  );
}