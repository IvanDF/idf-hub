import type { StoryObj } from '@storybook/nextjs-vite';
import TerminalHeader from '@/components/organisms/Terminal/TerminalHeader';
import TerminalInput from '@/components/organisms/Terminal/TerminalInput';
import TerminalHistoryItem from '@/components/organisms/Terminal/TerminalHistoryItem';
import TerminalQuickCommands from '@/components/organisms/Terminal/TerminalQuickCommands';

const meta = {
  tags: ['autodocs'],
};

export default meta;

export const TerminalHeaderStory: StoryObj<typeof TerminalHeader> = {
  name: 'TerminalHeader',
  render: () => <TerminalHeader onClose={() => {}} />,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 600, margin: '0 auto', background: '#0d1117', borderRadius: 8, overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
};

TerminalHeaderStory.parameters = {
  docs: {
    description: {
      component: 'Header bar for the terminal overlay with close button.',
    },
  },
};

export const TerminalInputStory: StoryObj<typeof TerminalInput> = {
  name: 'TerminalInput',
  render: () => (
    <TerminalInput
      value=""
      suggestion=""
      context="site"
      onChange={() => {}}
      onKeyDown={() => {}}
      onSubmit={() => {}}
    />
  ),
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 600, margin: '0 auto', background: '#0d1117', borderRadius: 8, overflow: 'hidden', padding: 8 }}>
        <Story />
      </div>
    ),
  ],
};

TerminalInputStory.parameters = {
  docs: {
    description: {
      component: 'Terminal input field with autocomplete suggestion overlay.',
    },
  },
};

export const TerminalHistoryItemStory: StoryObj<typeof TerminalHistoryItem> = {
  name: 'TerminalHistoryItem',
  render: () => (
    <TerminalHistoryItem
      item={{
        command: 'help',
        output: [
          { type: 'system', content: '── NAVIGATE ──' },
          { type: 'text', content: 'lab / work', cta: { label: '→ open', cmd: 'lab' } },
          { type: 'text', content: 'search [keyword] — find projects' },
          { type: 'success', content: 'Done.' },
        ],
      }}
      onExecuteCommand={() => {}}
    />
  ),
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 600, margin: '0 auto', background: '#0d1117', borderRadius: 8, overflow: 'hidden', padding: 16, fontFamily: 'Geist Mono, monospace', fontSize: 14 }}>
        <Story />
      </div>
    ),
  ],
};

TerminalHistoryItemStory.parameters = {
  docs: {
    description: {
      component: 'Single history entry in the terminal, renders command + output lines with optional CTAs.',
    },
  },
};

export const TerminalQuickCommandsStory: StoryObj<typeof TerminalQuickCommands> = {
  name: 'TerminalQuickCommands',
  render: () => <TerminalQuickCommands context="site" onCommand={() => {}} />,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 600, margin: '0 auto', background: '#0d1117', borderRadius: 8, overflow: 'hidden', padding: 8 }}>
        <Story />
      </div>
    ),
  ],
};

TerminalQuickCommandsStory.parameters = {
  docs: {
    description: {
      component: 'Quick-action command buttons displayed below the terminal history.',
    },
  },
};
