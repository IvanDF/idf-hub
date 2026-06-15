import type { Preview } from '@storybook/nextjs-vite';
import React from 'react';
import { ThemeContext } from '@/context/ThemeContext';
import { AudioProvider } from '@/context/AudioContext';
import GlobalBackground from '@/components/organisms/Background';
import '@/styles/globals.scss';

/**
 * Storybook-safe theme provider using the real ThemeContext.
 * Avoids the real ThemeProvider's `mounted === null` guard which delays
 * rendering children and breaks the AudioProvider context chain.
 */
function SBThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const value = React.useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((p) => (p === 'light' ? 'dark' : 'light')),
      superDarkMode: false,
      toggleSuperDarkMode: () => {},
      clickHint: 0,
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0a0a0a' },
        { name: 'light', value: '#fafafa' },
      ],
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <SBThemeProvider>
        <AudioProvider>
          <GlobalBackground />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Story />
          </div>
        </AudioProvider>
      </SBThemeProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default preview;
