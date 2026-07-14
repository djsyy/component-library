import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ArgTypes,
  Description,
  Primary,
  Stories,
  Title,
} from "@storybook/addon-docs/blocks";
import { expect, fn, userEvent, within } from "storybook/test";

import { Menu, MenuItem, MenuSeparator } from "../Menu";

const meta = {
  title: "Components/Menu",
  component: Menu,
  subcomponents: { MenuItem, MenuSeparator },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A compact disclosure menu with a native trigger button, keyboard navigation for menu items, outside-click dismissal, and ARIA menu semantics for action lists. The trigger can use visible text, an icon-only pattern with `ariaLabel`, or both.",
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
  argTypes: {
    align: {
      control: "select",
      options: ["left", "center", "right"],
    },
    triggerIcon: {
      control: false,
    },
    ariaLabel: {
      control: "text",
    },
  },
  args: {
    align: "left",
    label: "Open menu",
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

const renderMenu: Story["render"] = (args) => (
  <Menu {...args}>
    <MenuItem onClick={fn()}>Profile</MenuItem>
    <MenuItem onClick={fn()}>Settings</MenuItem>
    <MenuSeparator />
    <MenuItem onClick={fn()}>Sign out</MenuItem>
  </Menu>
);

export const Standard: Story = {
  render: renderMenu,
  parameters: {
    docs: {
      description: {
        story:
          "Keyboard: the trigger opens with Enter, Space, or arrow keys, then Arrow Up and Arrow Down move between items. Accessibility: the trigger exposes `aria-haspopup=\"menu\"` and `aria-expanded` while actions use `role=\"menuitem\"`.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open menu" });

    await userEvent.tab();
    await expect(trigger).toHaveFocus();

    await userEvent.keyboard("[Enter]");
    const profileItem = await canvas.findByRole("menuitem", { name: "Profile" });
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(profileItem).toHaveFocus();

    await userEvent.keyboard("[ArrowDown]");
    await expect(canvas.getByRole("menuitem", { name: "Settings" })).toHaveFocus();
  },
};

export const CenterAligned: Story = {
  args: {
    align: "center",
    label: "More actions",
  },
  render: renderMenu,
};

export const RightAligned: Story = {
  args: {
    align: "right",
    label: "Actions",
  },
  render: renderMenu,
};

export const WithDisabledItem: Story = {
  args: {
    label: "Project menu",
  },
  render: (args) => (
    <Menu {...args}>
      <MenuItem onClick={fn()}>Rename</MenuItem>
      <MenuItem disabled onClick={fn()}>
        Archive
      </MenuItem>
      <MenuSeparator />
      <MenuItem onClick={fn()}>Duplicate</MenuItem>
    </Menu>
  ),
};

export const IconOnlyTrigger: Story = {
  args: {
    ariaLabel: "Open account menu",
    label: undefined,
    triggerIcon: <span>Menu</span>,
  },
  render: renderMenu,
};
