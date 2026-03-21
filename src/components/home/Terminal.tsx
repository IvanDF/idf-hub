'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useFutureMode } from '@/context/FutureModeContext';
import styles from './Terminal.module.scss';

type CommandOutput = {
  type: 'text' | 'error' | 'success' | 'system' | 'link';
  content: string | React.ReactNode;
};

type HistoryItem = {
  command: string;
  output?: CommandOutput[];
};

export default function Terminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: '',
      output: [
        { type: 'system', content: 'IDF OS [Version 3.0.0]' },
        { type: 'text', content: '(c) 2024 Ivan Del Fatti. All rights reserved.' },
        { type: 'text', content: 'Welcome to the Digital Lab.' },
        { type: 'text', content: "Type 'help' or '?' to see available commands." },
      ]
    }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const { toggleTheme, theme } = useTheme();
  const { toggleFutureMode, isFutureMode } = useFutureMode();

  const SHORTCUTS_INFO = [
    { key: 'CMD+K', action: 'Open Terminal' },
    { key: 'D', action: 'Toggle Dark/Light Mode' },
    { key: 'CMD+SHIFT+F', action: 'Toggle Future Mode' },
    { key: '1', action: 'Go to Home' },
    { key: '2', action: 'Go to Lab' },
    { key: 'ESC', action: 'Close/Exit' },
    { key: '?', action: 'Show this help' },
  ];

  // Global Key Listener for Toggle (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      // D key for dark mode toggle
      if (e.key === 'd' || e.key === 'D') {
        if (!e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          toggleTheme();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
      // Number keys for navigation
      if (e.key === '1' && !e.metaKey && !e.ctrlKey) {
        router.push('/');
      }
      if (e.key === '2' && !e.metaKey && !e.ctrlKey) {
        router.push('/lab');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, router, toggleTheme]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        if (terminalBodyRef.current) {
            terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [isOpen]);

  // Auto-scroll
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = useCallback((cmdRaw: string) => {
    const cmd = cmdRaw.trim().toLowerCase();
    const args = cmdRaw.trim().split(' ').slice(1);
    
    let outputs: CommandOutput[] = [];

    switch (cmd) {
      case 'help':
      case '?':
        outputs = [
          { type: 'system', content: 'AVAILABLE COMMANDS:' },
          { type: 'text', content: '  lab / work / projects    - Enter The Lab' },
          { type: 'text', content: '  home / back             - Return to Home' },
          { type: 'text', content: '  theme                   - Toggle light/dark mode' },
          { type: 'text', content: '  future / zen            - Toggle Future Mode' },
          { type: 'text', content: '  shortcuts / keys        - Show keyboard shortcuts' },
          { type: 'text', content: '  clear                   - Clear terminal' },
          { type: 'text', content: '  whoami                  - Identity check' },
          { type: 'text', content: '  echo [text]             - Echoes text back' },
          { type: 'text', content: '  exit / close            - Close terminal' },
        ];
        break;

      case 'shortcuts':
      case 'keys':
        outputs = [
          { type: 'system', content: 'KEYBOARD SHORTCUTS:' },
          ...SHORTCUTS_INFO.map(s => ({ 
            type: 'text' as const, 
            content: `  ${s.key.padEnd(20)} - ${s.action}` 
          })),
        ];
        break;

      case 'future':
      case 'zen':
        toggleFutureMode();
        outputs = [{ type: 'success', content: isFutureMode ? 'Deactivating Future Mode...' : 'Activating Future Mode...' }];
        break;

      case 'portfolio':
      case 'work':
      case 'projects':
      case 'lab':
      case 'experiments':
        outputs = [{ type: 'success', content: 'Accessing The Lab...' }];
        setTimeout(() => {
             router.push('/lab');
             setIsOpen(false);
        }, 800);
        break;

      case 'home':
      case 'back':
        outputs = [{ type: 'success', content: 'Returning Home...' }];
        setTimeout(() => {
            router.push('/');
            setIsOpen(false);
        }, 800);
        break;
      
      case 'theme':
        toggleTheme();
        outputs = [{ type: 'success', content: `Switched to ${theme === 'dark' ? 'Light' : 'Dark'} Mode.` }];
        break;

      case 'clear':
        setHistory([]);
        return; 
        
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
      case 'close':
         setIsOpen(false);
         return;

      // Access Time Machine
      case 'time':
      case 'time machine':
      case 'archive':
      case 'timeline':
      case 'back to the future':
         outputs = [{ type: 'success', content: 'Initiating Temporal Displacement Sequence...' }];
         setTimeout(() => {
             router.push('/time-machine');
             setIsOpen(false);
         }, 800);
         break;

      // Easter Eggs - HIMYM
      case 'suit up':
      case 'suitup':
          outputs = [{ type: 'system', content: 'SUIT UP!' }]; 
          break;
      case 'playbook':
          outputs = [{ type: 'text', content: 'The Playbook. Article 1: The Lorenzo Von Matterhorn.' }];
          break;
      case 'robin':
          outputs = [{ type: 'text', content: 'NOBODY ASKED YOU PATRICE!' }];
          break;
      case 'ted':
      case 'have you met ted':
          outputs = [{ type: 'text', content: 'Haaaaave you met Ted?' }];
          break;
      case 'legendary':
          outputs = [{ type: 'success', content: 'Legend... wait for it... DARY!' }];
          break;
      
      // Easter Eggs - Rick and Morty
      case 'wubba lubba dub dub':
          outputs = [{ type: 'error', content: 'I am in great pain, please help me.' }];
          break;
      case 'portal':
          outputs = [{ type: 'success', content: 'Opening portal to Dimension C-137...' }];
          break;
      case 'pickle rick':
      case 'pickle':
          outputs = [{ type: 'success', content: 'I turned myself into a pickle, Morty! I\'m Pickle Riiiiick!' }];
          break;
      
      // Easter Eggs - Vikings
      case 'skol':
      case 'skål':
          outputs = [{ type: 'success', content: 'SKÅL!' }];
          break;
      case 'ragnar':
          outputs = [{ type: 'text', content: 'Who wants to be King?!' }];
          break;
      case 'valhalla':
          outputs = [{ type: 'system', content: 'Odin is with us!' }];
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
        setHistoryIndex(-1); 
    }
  }, [router, theme, toggleTheme, toggleFutureMode, isFutureMode, SHORTCUTS_INFO]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => setIsOpen(false)}>
      <div 
        className={styles.terminalContainer} 
        ref={containerRef}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className={styles.terminalBody} ref={terminalBodyRef}>
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
        </div>

        {/* Input Area */}
        <div className={styles.inputArea}>
          <span className={styles.prompt}>{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}
