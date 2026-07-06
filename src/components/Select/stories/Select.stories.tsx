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

import { Select } from "../Select";

const options = [
  { value: "", label: "Choose an option", disabled: true },
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "product", label: "Product" },
];

const meta = {
  title: "Components/Select",
  component: Select,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A native select component that uses the browser's built-in listbox behavior, keeps the accessible name tied to the visible label, and exposes helper and error text through ARIA relationships.",
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
    label: "Team",
    labelPosition: "top",
    value: "design",
    details: "Used to group your account access.",
    disabled: false,
    required: false,
    error: false,
    onChange: fn(),
    children: options.map((option) => (
      <option
        key={option.value}
        value={option.value}
        disabled={option.disabled}
      >
        {option.label}
      </option>
    )),
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderInteractiveSelect: Story["render"] = (args) => {
  const [, updateArgs] = useArgs<typeof args>();

  return (
    <Select
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
    value: "engineering",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Keyboard: focus enters with Tab and the native select supports browser-standard arrow-key navigation. Accessibility: visible label text names the control and helper text is linked with `aria-describedby`.",
      },
    },
  },
  render: renderInteractiveSelect,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole("combobox", { name: "Team" });

    await userEvent.tab();
    await expect(select).toHaveFocus();

    await userEvent.selectOptions(select, "product");
    await expect(select).toHaveValue("product");
  },
};

export const LeftLabel: Story = {
  args: {
    labelPosition: "left",
    value: "product",
  },
  render: renderInteractiveSelect,
};

export const WithoutDetails: Story = {
  args: {
    value: "design",
    details: undefined,
  },
  render: renderInteractiveSelect,
};

export const Required: Story = {
  args: {
    required: true,
    value: "",
    details: "Pick the best fit for your role.",
  },
  render: renderInteractiveSelect,
};

export const ErrorState: Story = {
  args: {
    error: true,
    errorMessage: "Please choose a team.",
    value: "",
    details: "A team is required before continuing.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Accessibility: error state adds `aria-invalid` and links the inline error with `aria-errormessage` while preserving native select semantics.",
      },
    },
  },
  render: renderInteractiveSelect,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole("combobox", { name: "Team" });

    await expect(select).toHaveAttribute("aria-invalid", "true");
    await expect(select).toHaveAttribute("aria-errormessage");
    await expect(canvas.getByText("Please choose a team.")).toHaveAttribute("role", "alert");
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "design",
    details: "This example is read-only.",
  },
  render: renderInteractiveSelect,
};
