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

// Easter eggs with cryptic hints as aliases
type EasterEgg = {
  id: string;
  aliases: string[];
  category: string;
  name: string;
  hint: string;
};

const EASTER_EGGS: EasterEgg[] = [
  // HIMYM - Quote e riferimenti
  { id: 'suit_up', aliases: ['suit up', 'suits'], category: 'HIMYM', name: 'Suit Up', hint: 'Barney\'s motto' },
  { id: 'playbook', aliases: ['have you met'], category: 'HIMYM', name: 'The Playbook', hint: 'Have you met...' },
  { id: 'legendary', aliases: ['is gonna be', 'wait for it'], category: 'HIMYM', name: 'Legendary', hint: 'The catchphrase' },
  { id: 'yellow umbrella', aliases: ['yellow umbrella', 'umbrella'], category: 'HIMYM', name: 'Yellow Umbrella', hint: 'Ted\'s symbol' },
  
  // Rick and Morty
  { id: 'pickle_rick', aliases: ['pickle rick', 'im pickle'], category: 'R&M', name: 'Pickle Rick', hint: 'Turned into a pickle' },
  { id: 'wubba', aliases: ['wubba lubba', 'in great pain'], category: 'R&M', name: 'Wubba Lubba Dub Dub', hint: 'Rick\'s cry' },
  { id: 'burp', aliases: ['burp', 'burping', 'burped'], category: 'R&M', name: 'Burp', hint: 'Rick\'s signature' },
  { id: 'science', aliases: ['science', 'wubba lubba dub dub'], category: 'R&M', name: 'Science', hint: '"And that\'s the wicky wicky"' },
  
  // Vikings
  { id: 'ragnar', aliases: ['who wants to be king', 'ragnarok'], category: 'Vikings', name: 'Who Wants to be King', hint: 'Ragnar\'s famous words' },
  { id: 'aesir', aliases: ['the aesir will', 'aesir'], category: 'Vikings', name: 'The Aesir', hint: 'Ragnar\'s final words' },
  { id: 'skol', aliases: ['skol', 'to the north'], category: 'Vikings', name: 'Skål', hint: 'Viking cheers' },
  { id: 'valhalla', aliases: ['valhalla', 'odin'], category: 'Vikings', name: 'Valhalla', hint: 'Viking paradise' },
  
  // Secret Features
  { id: 'future_mode', aliases: ['zen', 'clean mode', 'focus mode'], category: 'Secret', name: 'Future Mode', hint: 'Distraction-free' },
  { id: 'theme_toggle', aliases: ['dark side', 'light side', 'the force'], category: 'Secret', name: 'Theme Master', hint: 'Two sides of the force' },
  { id: 'time_machine', aliases: ['time travel', 'flux capacitor', '1.21 gigawatts'], category: 'Secret', name: 'Time Traveler', hint: 'Where we\'re going...' },
  { id: 'konami', aliases: ['up up down down', '30 lives', ' NES '], category: 'Secret', name: 'Konami Code', hint: 'The famous code' },
];

const TOTAL_EASTER_EGGS = EASTER_EGGS.length;

// Playbook articles for variety
const PLAYBOOK_ARTICLES = [
  'Article 1: The Lorenzo Von Matterhorn',
  'Article 2: The Wedding Rachel',
  'Article 3: The Naked Man',
  'Article 4: The Platinum Rule',
  'Article 5: The Yips',
];

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
  const [discoveredEggs, setDiscoveredEggs] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const { toggleTheme, theme } = useTheme();
  const { toggleFutureMode, isFutureMode } = useFutureMode();

  // Load discovered eggs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('idf-easter-eggs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDiscoveredEggs(new Set(parsed));
      } catch {
        // Ignore invalid data
      }
    }
  }, []);

  // Save discovered eggs to localStorage
  useEffect(() => {
    localStorage.setItem('idf-easter-eggs', JSON.stringify([...discoveredEggs]));
  }, [discoveredEggs]);

  const discoverEgg = useCallback((eggId: string) => {
    setDiscoveredEggs(prev => {
      if (prev.has(eggId)) return prev;
      const next = new Set(prev);
      next.add(eggId);
      return next;
    });
  }, []);

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

    // Check for easter eggs first
    const foundEgg = EASTER_EGGS.find(egg => egg.aliases.includes(cmd));
    if (foundEgg) {
      discoverEgg(foundEgg.id);
      
      switch (foundEgg.id) {
        case 'suit_up':
          outputs = [{ type: 'system', content: '🏆 SUIT UP! That\'s Barney\'s motto!' }];
          break;
        case 'playbook':
          const article = PLAYBOOK_ARTICLES[Math.floor(Math.random() * PLAYBOOK_ARTICLES.length)];
          outputs = [{ type: 'text', content: `📖 The Playbook. ${article}` }];
          break;
        case 'robin':
          outputs = [{ type: 'text', content: '💔 NOBODY ASKED YOU PATRICE!' }];
          break;
        case 'ted':
          outputs = [{ type: 'text', content: '💜 Haaaaave you met Ted? The architect with a yellow umbrella...' }];
          break;
        case 'legendary':
          outputs = [{ type: 'success', content: '⚡ Legend... wait for it... DARY!' }];
          break;
        case 'wubba':
          outputs = [{ type: 'error', content: '😭 I am in great pain, please help me.' }];
          break;
        case 'portal':
          outputs = [{ type: 'success', content: '🌀 Opening portal to Dimension C-137... Wubba Lubba Dub Dub!' }];
          break;
        case 'pickle_rick':
          outputs = [{ type: 'success', content: '🥒 I turned myself into a pickle, Morty! I\'m Pickle Riiiiick!' }];
          break;
        case 'skol':
          outputs = [{ type: 'success', content: '🍺 SKÅL! To the North!' }];
          break;
        case 'ragnar':
          outputs = [{ type: 'text', content: '👑 Who wants to be King?! Ragnar Lothbrok!' }];
          break;
        case 'valhalla':
          outputs = [{ type: 'system', content: '⚔️ Odin is with us! Valhalla awaits the brave!' }];
          break;
        case 'future_mode':
          toggleFutureMode();
          outputs = [{ type: 'success', content: '🌌 Future Mode: ' + (isFutureMode ? 'Deactivated...' : 'Activated! Focus mode engaged.') }];
          break;
        case 'theme_toggle':
          toggleTheme();
          const themeMsg = [
            '🎨 Theme switched. You have an eye for design.',
            '🌙 Darker than my soul. Or lighter.',
            '☀️ Light mode activated. It is a bright day.',
            '🖤 Black is the new black. Or white is?',
          ];
          outputs = [{ type: 'success', content: themeMsg[Math.floor(Math.random() * themeMsg.length)] }];
          break;
        case 'time_machine':
          outputs = [{ type: 'success', content: '⏰ Initiating Temporal Displacement Sequence... Flux Capacitor engaged!' }];
          setTimeout(() => {
            router.push('/time-machine');
            setIsOpen(false);
          }, 800);
          break;
        case 'secrets':
          outputs = [
            { type: 'system', content: '🔐 You found a secret!' },
            { type: 'text', content: 'Hint: ↑ ↑ ↓ ↓ ← → ← → B A' },
            { type: 'text', content: 'Try typing it anywhere on the page...' },
          ];
          break;
        default:
          outputs = [{ type: 'text', content: `🎮 You found: ${foundEgg.name}` }];
      }
    } else {
      // Standard commands
      switch (cmd) {
        case 'help':
        case '?':
          outputs = [
            { type: 'system', content: 'AVAILABLE COMMANDS:' },
            { type: 'text', content: '  lab / work / projects    - Enter The Lab' },
            { type: 'text', content: '  home / back             - Return to Home' },
            { type: 'text', content: '  theme                  - Toggle light/dark mode' },
            { type: 'text', content: '  future / zen           - Toggle Future Mode' },
            { type: 'text', content: '  time                   - Access Time Machine' },
            { type: 'text', content: '  shortcuts / keys        - Show keyboard shortcuts' },
            { type: 'text', content: '  eggs / achievements     - Easter eggs progress' },
            { type: 'text', content: '  clear                  - Clear terminal' },
            { type: 'text', content: '  whoami                 - Identity check' },
            { type: 'text', content: '  echo [text]            - Echoes text back' },
            { type: 'text', content: '  exit / close           - Close terminal' },
          ];
          break;

        case 'eggs':
        case 'easter':
        case 'achievements':
        case 'badges':
          const discovered = discoveredEggs.size;
          outputs = [
            { type: 'system', content: '🏆 ACHIEVEMENTS PROGRESS' },
            { type: 'text', content: `━━━━━━━━━━━━━━━━━━━━━━━━` },
            { type: 'text', content: `Discovered: ${discovered}/${TOTAL_EASTER_EGGS}` },
            { type: 'text', content: '' },
          ];
          
          const categories = ['HIMYM', 'R&M', 'Vikings', 'Secret'];
          categories.forEach(cat => {
            const catEggs = EASTER_EGGS.filter(e => e.category === cat);
            const foundInCat = catEggs.filter(e => discoveredEggs.has(e.id)).length;
            const catIcon = cat === 'HIMYM' ? '💜' : cat === 'R&M' ? '🌀' : cat === 'Vikings' ? '⚔️' : '🔐';
            outputs.push({ type: 'text', content: `${catIcon} ${cat}: ${foundInCat}/${catEggs.length}` });
            
            catEggs.forEach(egg => {
              const isFound = discoveredEggs.has(egg.id);
              outputs.push({ 
                type: isFound ? 'success' as const : 'text' as const, 
                content: `   ${isFound ? '✓' : '○'} ${egg.name}` 
              });
            });
            outputs.push({ type: 'text', content: '' });
          });
          
          if (discovered === TOTAL_EASTER_EGGS) {
            outputs.push({ type: 'success', content: '🎉 CONGRATULATIONS! All achievements unlocked!' });
          } else if (discovered > 0) {
            outputs.push({ type: 'text', content: `Keep exploring to unlock ${TOTAL_EASTER_EGGS - discovered} more!` });
          }
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

        case '':
          break;

        default:
          outputs = [
            { type: 'error', content: `Command not found: ${cmd}` },
            { type: 'text', content: "Type 'help' for a list of commands." }
          ];
      }
    }

    setHistory(prev => [...prev, { command: cmdRaw, output: outputs }]);
    if (cmdRaw.trim()) {
        setCommandHistory(prev => [...prev, cmdRaw]);
        setHistoryIndex(-1); 
    }
  }, [router, theme, toggleTheme, toggleFutureMode, isFutureMode, SHORTCUTS_INFO, discoverEgg, discoveredEggs.size, PLAYBOOK_ARTICLES.length]);

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
