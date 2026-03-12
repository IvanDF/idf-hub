'use client';

/**
 * Theme Context
 * 
 * Provides global theme management (light/dark mode) for the application.
 * Handles persistence via localStorage and system preference detection.
 * 
 * Includes:
 * - ThemeProvider: Wrapper component to provide theme context
 * - useTheme: Hook to consume theme context
 */

import { createContext, useContext, useEffect, useState, useRef } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  superDarkMode: boolean;
  toggleSuperDarkMode: () => void;
  clickHint: number;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Internal component for the spotlight effect.
 * Needs to be defined before usage or hoisted.
 */
function SpotlightOverlay() {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 9999,
                // The magic: a radial gradient that is transparent in the center (cursor)
                // and nearly opaque black elsewhere. Increased radius for better visibility.
                background: `radial-gradient(circle 350px at ${position.x}px ${position.y}px, transparent 0%, rgba(0,0,0,0.98) 100%)`
            }}
        />
    );
}

/**
 * ThemeProvider Component
 * 
 * Wraps the application to provide theme state and toggle functionality.
 * Prevents hydration mismatch by handling initial render state.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);
  
  // Super Dark Mode Easter Egg State
  const [superDarkMode, setSuperDarkMode] = useState(false);
  // We use state for clickHint to trigger re-renders for UI feedback
  const [clickHint, setClickHint] = useState(0); 
  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Only update if different from initial 'light' to avoid unnecessary render
    if (savedTheme && savedTheme !== 'light') {
      // eslint-disable-next-line
      setTheme(savedTheme);
    } else if (!savedTheme && systemPrefersDark) {
      setTheme('dark');
    }
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  // Effect to apply super dark mode classes to body
  useEffect(() => {
    if (superDarkMode) {
      document.body.classList.add('super-dark-mode');
    } else {
      document.body.classList.remove('super-dark-mode');
    }
  }, [superDarkMode]);

  const toggleTheme = () => {
    // If super dark mode is active, clicking toggle should exit it
    if (superDarkMode) {
      setSuperDarkMode(false);
      setClickHint(0);
      clickCount.current = 0;
      return;
    }

    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

    // Easter Egg Logic: Detect rapid clicks (e.g., 5 clicks in 2 seconds)
    // We update the ref synchronously
    clickCount.current += 1;
    setClickHint(clickCount.current); // Update state to trigger UI feedback
    
    // Clear existing timer
    if (clickTimer.current) {
        clearTimeout(clickTimer.current);
    }

    // Check threshold immediately
    if (clickCount.current >= 5) {
        setSuperDarkMode(true);
        clickCount.current = 0; // Reset after triggering
        setClickHint(0);
        // Also ensure theme is dark when entering super dark mode for better effect
        setTheme('dark');
    } else {
        // Set reset timer if threshold not met
        clickTimer.current = setTimeout(() => {
            clickCount.current = 0;
            setClickHint(0);
        }, 1000); // 1 second window to spam clicks
    }
  };

  const toggleSuperDarkMode = () => setSuperDarkMode((prev) => !prev);

  // We must provide the context even during hydration mismatch prevention
  // Otherwise child components calling useTheme() will throw an error
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, superDarkMode, toggleSuperDarkMode, clickHint }}>
      {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
      {/* Spotlight Overlay Component */}
      {superDarkMode && <SpotlightOverlay />}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
