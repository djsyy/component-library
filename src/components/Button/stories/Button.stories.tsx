import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ArgTypes,
  Description,
  Primary,
  Stories,
  Title,
} from "@storybook/addon-docs/blocks";
import { fn } from "storybook/test";

import { Button } from "../Button.tsx";
import { ButtonSize, ButtonVariant } from "../button.types";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A button component with primary, secondary, danger, loading, disabled, and size states.",
      },
      page: () => (
        <>
          <Title />
          <Description />
          <Primary />
          <ArgTypes />
          <Stories />
        </>
      ),
    },
  },
  tags: ["autodocs"],
  // Controls let you change props in the Storybook UI.
  argTypes: {
    variant: {
      control: "select",
      options: Object.values(ButtonVariant),
    },
    size: {
      control: "select",
      options: Object.values(ButtonSize),
    },
    disabled: {
      control: "boolean",
    },
    loading: {
      control: "boolean",
    },
    onClick: {
      action: "clicked",
    },
  },
  args: {
    children: "Primary action",
    variant: ButtonVariant.Primary,
    size: ButtonSize.Medium,
    disabled: false,
    loading: false,
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Medium: Story = {
  args: {
    children: "Medium",
    size: ButtonSize.Medium,
  },
};

export const Secondary: Story = {
  args: {
    variant: ButtonVariant.Secondary,
    children: "Secondary action",
  },
};

export const Danger: Story = {
  args: {
    variant: ButtonVariant.Danger,
    children: "Delete",
  },
};

export const Loading: Story = {
  args: {
    children: "Loading",
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    children: "Small",
    size: ButtonSize.Small,
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    size: ButtonSize.Large,
  },
};
