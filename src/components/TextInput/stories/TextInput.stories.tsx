import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ArgTypes,
  Description,
  Primary,
  Stories,
  Title,
} from "@storybook/addon-docs/blocks";
import { useArgs } from "storybook/preview-api";
import { expect, fn, userEvent, within } from "storybook/test";

import { TextInput } from "../TextInput";

const meta = {
  title: "Components/TextInput",
  component: TextInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A native text input with explicit label association, helper and error text announced through `aria-describedby` and `aria-errormessage`, and standard keyboard text entry behavior.",
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
    labelPosition: {
      control: "select",
      options: ["top", "left"],
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "url", "tel"],
    },
    disabled: {
      control: "boolean",
    },
    required: {
      control: "boolean",
    },
    error: {
      control: "boolean",
    },
    onChange: {
      action: "changed",
    },
  },
  // Args are the default props shared by all stories unless a story overrides them.
  args: {
    label: "Email address",
    labelPosition: "top",
    value: "hello@example.com",
    placeholder: "name@example.com",
    disabled: false,
    required: false,
    error: false,
    onChange: fn(),
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderInteractiveInput: Story["render"] = (args) => {
  const [, updateArgs] = useArgs<typeof args>();

  return (
    <TextInput
      {...args}
      onChange={(event) => {
        args.onChange?.(event);
        updateArgs({ value: event.target.value });
      }}
    />
  );
};

export const Standard: Story = {
  args: {
    type: "text",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Keyboard: focus enters with Tab and typing updates the value directly in the native input. Accessibility: the input is labelled by visible text and keeps helper text out of the accessible name.",
      },
    },
  },
  render: renderInteractiveInput,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Email address" });

    await userEvent.tab();
    await expect(input).toHaveFocus();

    await userEvent.clear(input);
    await userEvent.type(input, "person@example.com");
    await expect(input).toHaveValue("person@example.com");
  },
};

export const LeftLabel: Story = {
  args: {
    label: "Display name",
    labelPosition: "left",
    value: "Alex",
    details: "Shown alongside your profile.",
    type: "text",
  },
  render: renderInteractiveInput,
};

export const WithDetails: Story = {
  args: {
    label: "Display name",
    value: "Alex",
    details: "Shown on your public profile.",
    type: "text",
  },
  render: renderInteractiveInput,
};

export const WithoutDetails: Story = {
  args: {
    label: "Display name",
    value: "Alex",
    type: "text",
  },
  render: renderInteractiveInput,
};

export const Required: Story = {
  args: {
    label: "Company email",
    value: "",
    details: "Use your work address.",
    required: true,
    type: "email",
  },
  render: renderInteractiveInput,
};

export const ErrorState: Story = {
  args: {
    label: "Username",
    value: "invalid username",
    details: "Only lowercase letters, numbers, and hyphens.",
    error: true,
    errorMessage: "Remove spaces and uppercase characters.",
    type: "text",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Accessibility: invalid inputs expose `aria-invalid`, keep the label as the accessible name, and announce the inline error through `aria-errormessage`.",
      },
    },
  },
  render: renderInteractiveInput,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Username" });

    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toHaveAttribute("aria-errormessage");
    await expect(canvas.getByText("Remove spaces and uppercase characters.")).toHaveAttribute(
      "role",
      "alert",
    );
  },
};

export const Disabled: Story = {
  args: {
    label: "Secret Login",
    value: "Super secret",
    details: "Read-only in this example.",
    disabled: true,
    type: "text",
  },
  render: renderInteractiveInput,
};
