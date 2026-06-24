import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from "@/components/atoms/button";
import styles from "../story-frame.module.scss";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          "Shared button primitive for buttons, links, and chrome controls. All visual variants are centralized here.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className={styles.centeredAligned}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Primary",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Chrome: Story = {
  args: {
    children: "Chrome",
    variant: "chrome",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost",
    variant: "ghost",
    stamp: false,
  },
};

export const ExternalLink: Story = {
  args: {
    children: "Open Link",
    href: "https://example.com",
    external: true,
    target: "_blank",
    rel: "noreferrer",
    variant: "secondary",
  },
};
