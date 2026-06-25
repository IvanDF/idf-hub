import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Text from "@/components/atoms/text";
import styles from "../story-frame.module.scss";

const meta: Meta<typeof Text> = {
  title: "Atoms/Text",
  component: Text,
  parameters: {
    docs: {
      description: {
        component:
          "Typography primitive that maps the design system type scale (Typefaces Details.pdf) to semantic HTML elements. Supports all heading levels, body, small, label, and mono variants.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className={styles.centeredAligned} style={{ flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6", "body", "small", "label", "mono"],
    },
    as: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "small", "label", "div"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const H1: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog",
    variant: "h1",
  },
};

export const H2: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog",
    variant: "h2",
  },
};

export const H3: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog",
    variant: "h3",
  },
};

export const H4: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog",
    variant: "h4",
  },
};

export const H5: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog",
    variant: "h5",
  },
};

export const H6: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog",
    variant: "h6",
  },
};

export const Body: Story = {
  args: {
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    variant: "body",
  },
};

export const Small: Story = {
  args: {
    children: "Small caption or footnote text",
    variant: "small",
  },
};

export const Label: Story = {
  args: {
    children: "Button Label",
    variant: "label",
  },
};

export const Mono: Story = {
  args: {
    children: "npm run dev  →  http://localhost:3000",
    variant: "mono",
  },
};

export const TypeScaleShowcase: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Text variant="h1">H1 — Josefin Slab 700 · 49px</Text>
      <Text variant="h2">H2 — Josefin Sans 600 · 39px</Text>
      <Text variant="h3">H3 — Josefin Sans 400 · 31px</Text>
      <Text variant="h4">H4 — Josefin Sans 700 · 25px</Text>
      <Text variant="h5">H5 — Josefin Sans 500 · 20px</Text>
      <Text variant="h6">H6 — Josefin Sans 500 · 18px</Text>
      <Text variant="body">Body — Josefin Sans 400 · 16px / 1.5 · with a nice comfortable line height for long-form reading.</Text>
      <Text variant="small">Small — Josefin Slab 700 · 14px</Text>
      <Text variant="label">LABEL — Josefin Sans 700 · 12px · UPPERCASE</Text>
      <Text variant="mono">Mono — Geist Mono 400 · 14px · code/terminal</Text>
    </div>
  ),
  name: "Full Type Scale",
};
