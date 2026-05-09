import type { Preview } from '@storybook/nextjs-vite';
import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AudioProvider } from '@/context/AudioContext';
import { VoiceShoutProvider } from '@/context/VoiceShoutContext';
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
    (Story) => {
      return React.createElement(ThemeProvider, null,
        React.createElement(AudioProvider, null,
          React.createElement(VoiceShoutProvider, null,
            React.createElement(Story)
          )
        )
      );
    },
  ],
  tags: ['autodocs'],
};

export default preview;
