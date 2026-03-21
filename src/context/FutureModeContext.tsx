'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface FutureModeContextType {
  isFutureMode: boolean;
  toggleFutureMode: () => void;
  enableFutureMode: () => void;
  disableFutureMode: () => void;
}

const FutureModeContext = createContext<FutureModeContextType | undefined>(undefined);

export function FutureModeProvider({ children }: { children: ReactNode }) {
  const [isFutureMode, setIsFutureMode] = useState(false);

  const enableFutureMode = useCallback(() => {
    setIsFutureMode(true);
    document.body.classList.add('future-mode');
  }, []);

  const disableFutureMode = useCallback(() => {
    setIsFutureMode(false);
    document.body.classList.remove('future-mode');
  }, []);

  const toggleFutureMode = useCallback(() => {
    if (isFutureMode) {
      disableFutureMode();
    } else {
      enableFutureMode();
    }
  }, [isFutureMode, enableFutureMode, disableFutureMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+Shift+F to toggle Future Mode
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        toggleFutureMode();
      }
      // ESC to exit Future Mode
      if (e.key === 'Escape' && isFutureMode) {
        e.preventDefault();
        disableFutureMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFutureMode, toggleFutureMode, disableFutureMode]);

  return (
    <FutureModeContext.Provider value={{ isFutureMode, toggleFutureMode, enableFutureMode, disableFutureMode }}>
      {children}
    </FutureModeContext.Provider>
  );
}

export function useFutureMode() {
  const context = useContext(FutureModeContext);
  if (context === undefined) {
    throw new Error('useFutureMode must be used within a FutureModeProvider');
  }
  return context;
}
