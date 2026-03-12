'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import styles from './Terminal.module.scss';
import Image from 'next/image';

type CommandOutput = {
  type: 'text' | 'error' | 'success' | 'system' | 'link';
  content: string | JSX.Element;
};

type HistoryItem = {
  command: string;
  output?: CommandOutput[];
};

export default function Terminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: '',
      output: [
        { type: 'system', content: 'IDF OS [Version 2.0.1]' },
        { type: 'text', content: '(c) 2024 Ivan Del Fatti. All rights reserved.' },
        { type: 'text', content: 'Welcome to the Digital Lab.' },
        { type: 'text', content: "Type 'help' to see available commands." },
      ]
    }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]); // For Up/Down arrow recall
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const { toggleTheme, theme } = useTheme();

  // Focus input on mount and keep focus
  useEffect(() => {
    inputRef.current?.focus();
    
    const handleGlobalClick = () => {
      // Re-focus unless selecting text
      if (window.getSelection()?.toString().length === 0) {
        inputRef.current?.focus();
      }
    };
    
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  // Command Execution Logic
  const executeCommand = useCallback((cmdRaw: string) => {
    const cmd = cmdRaw.trim().toLowerCase();
    const args = cmdRaw.trim().split(' ').slice(1);
    
    let outputs: CommandOutput[] = [];

    switch (cmd) {
      case 'help':
        outputs = [
          { type: 'system', content: 'AVAILABLE COMMANDS:' },
          { type: 'text', content: '  portfolio / work   - View projects' },
          { type: 'text', content: '  about / mind       - Enter the mind map' },
          { type: 'text', content: '  theme              - Toggle light/dark mode' },
          { type: 'text', content: '  clear              - Clear terminal' },
          { type: 'text', content: '  whoami             - Identity check' },
          { type: 'text', content: '  echo [text]        - Echoes text back' },
          { type: 'text', content: '  exit               - Close terminal (refresh)' },
        ];
        break;

      case 'portfolio':
      case 'work':
      case 'projects':
        outputs = [{ type: 'success', content: 'Navigating to Portfolio...' }];
        setTimeout(() => router.push('/portfolio'), 800);
        break;

      case 'about':
      case 'mind':
        outputs = [{ type: 'success', content: 'Entering the Neural Network...' }];
        setTimeout(() => router.push('/about'), 800);
        break;
      
      case 'theme':
        toggleTheme();
        outputs = [{ type: 'success', content: `Switched to ${theme === 'dark' ? 'Light' : 'Dark'} Mode.` }];
        break;

      case 'clear':
        setHistory([]);
        return; // Early return to avoid adding empty entry
        
      case 'whoami':
        outputs = [
          { type: 'system', content: 'User: Guest / Observer' },
          { type: 'text', content: 'Access Level: Read-Only' },
          { type: 'text', content: 'Mission: Explore the Digital Lab.' },
        ];
        break;

      case 'echo':
        outputs = [{ type: 'text', content: args.join(' ') }];
        break;
      
      case 'exit':
         outputs = [{ type: 'error', content: 'Cannot exit the simulation. Refresh to reset.' }];
         break;

      case '':
        break;

      default:
        outputs = [
          { type: 'error', content: `Command not found: ${cmd}` },
          { type: 'text', content: "Type 'help' for a list of commands." }
        ];
    }

    setHistory(prev => [...prev, { command: cmdRaw, output: outputs }]);
    if (cmdRaw.trim()) {
        setCommandHistory(prev => [...prev, cmdRaw]);
        setHistoryIndex(-1); // Reset index
    }
  }, [router, theme, toggleTheme]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
         if (historyIndex === commandHistory.length - 1) {
             setHistoryIndex(-1);
             setInput('');
         } else {
             setHistoryIndex(newIndex);
             setInput(commandHistory[newIndex]);
         }
      }
    }
  };

  return (
    <div className={styles.terminalContainer} ref={containerRef}>
      {/* History */}
      {history.map((item, index) => (
        <div key={index} className={styles.outputArea}>
          {item.command && (
            <div className={styles.line}>
              <span className={styles.prompt}>{'>'}</span> {item.command}
            </div>
          )}
          {item.output && item.output.map((out, i) => (
            <div key={i} className={`${styles.line} ${styles[out.type]}`}>
              {out.content}
            </div>
          ))}
        </div>
      ))}

      {/* Input Area */}
      <div className={styles.inputArea}>
        <span className={styles.prompt}>{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
