import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SecretGateway from '@/components/templates/Layout/SecretGateway';

const meta: Meta<typeof SecretGateway> = {
  title: 'Templates/SecretGateway',
  component: SecretGateway,
  parameters: {
    docs: {
      description: {
        component:
          'Listens for the Konami Code (↑↑↓↓←→←→BA) and "time" key sequence to trigger secret routes.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SecretGateway>;

export const Default: Story = {
  args: {},
};
