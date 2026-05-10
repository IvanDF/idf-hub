import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';

const idfTheme = create({
  base: 'dark',
  brandTitle: 'iDF Hub — Design System',
  brandUrl: 'https://idf-hub.vercel.app',
  brandTarget: '_self',
  brandImage: '/assets/idf-logo.svg',
  colorPrimary: '#a78bfa',
  colorSecondary: '#60a5fa',
  appBg: '#0a0a0a',
  appContentBg: '#0a0a0a',
  appPreviewBg: '#0a0a0a',
  appBorderColor: '#1e1e2e',
  textColor: '#f3f4f6',
  textMutedColor: '#64748b',
  barBg: '#0a0a0a',
  barTextColor: '#f3f4f6',
  barSelectedColor: '#a78bfa',
  inputBg: '#1e1e2e',
  inputBorder: '#334155',
  inputTextColor: '#f3f4f6',
  booleanBg: '#1e1e2e',
  booleanSelectedBg: '#a78bfa',
  buttonBg: '#1e1e2e',
  buttonBorder: '#334155',
});

addons.setConfig({
  theme: idfTheme,
  sidebar: {
    filters: {
      patterns: (item) => !item.tags?.includes('onboarding'),
    },
  },
});
