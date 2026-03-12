import { useEffect, useState } from 'react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export function useKonamiCode(action: () => void) {
  const [input, setInput] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      
      // Update input array keeping only the last N keys where N is Konami code length
      const newInput = [...input, key].slice(-KONAMI_CODE.length);
      setInput(newInput);

      // Check if it matches
      if (JSON.stringify(newInput) === JSON.stringify(KONAMI_CODE)) {
        action();
        setInput([]); // Reset after success
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, action]);
}
