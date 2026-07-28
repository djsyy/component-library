import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card } from "../Card";

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A semantic article container for grouping related content.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["elevated", "outlined"],
    },
  },
  args: {
    children: (
      <>
        <h2 style={{ margin: 0 }}>Project update</h2>
        <p style={{ margin: 0 }}>
          The component library is ready for review.
        </p>
      </>
    ),
    variant: "elevated",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Elevated: Story = {};

export const Outlined: Story = {
  args: {
    variant: "outlined",
  },
};
