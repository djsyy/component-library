import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ArgTypes,
  Description,
  Primary,
  Stories,
  Title,
} from "@storybook/addon-docs/blocks";
import { expect, fn, userEvent, within } from "storybook/test";

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
          "A semantic button component that uses the native `<button>` element, exposes its accessible name from visible text, supports keyboard activation with Enter and Space, and marks loading state with `aria-busy` while disabling interaction.",
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
  parameters: {
    docs: {
      description: {
        story:
          "Keyboard: receives focus with Tab and activates with Space or Enter. Accessibility: native button semantics provide role, name, and disabled behavior automatically.",
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Medium" });

    await userEvent.tab();
    await expect(button).toHaveFocus();

    await userEvent.keyboard("[Space]");
    await expect(args.onClick).toHaveBeenCalled();
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
  parameters: {
    docs: {
      description: {
        story:
          "Accessibility: loading buttons remain semantic buttons, expose `aria-busy=\"true\"`, and are disabled so keyboard users cannot trigger duplicate actions.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Loading" });

    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute("aria-busy", "true");
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
