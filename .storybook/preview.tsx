import type { Preview } from '@storybook/nextjs-vite';
import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AudioProvider } from '@/context/AudioContext';
import GlobalBackground from '@/components/organisms/Background';
import '@/styles/globals.scss';

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
      <ThemeProvider>
        <AudioProvider>
          <GlobalBackground />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Story />
          </div>
        </AudioProvider>
      </ThemeProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default preview;
