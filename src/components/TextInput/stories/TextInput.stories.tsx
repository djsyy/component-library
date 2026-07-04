import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ArgTypes,
  Description,
  Primary,
  Stories,
  Title,
} from "@storybook/addon-docs/blocks";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";

import { TextInput } from "../TextInput";

const meta = {
  title: "Components/TextInput",
  component: TextInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A controlled text input component with label position, helper text, error, disabled, and required states.",
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
  render: renderInteractiveInput,
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
  render: renderInteractiveInput,
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
