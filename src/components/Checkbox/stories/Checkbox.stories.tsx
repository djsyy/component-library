import type { Meta, StoryObj } from '@storybook/react-vite';

import { ArgTypes, Description, Primary, Stories, Title } from '@storybook/addon-docs/blocks';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

import { Checkbox, CheckboxState } from '../Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A controlled checkbox component with checked, unchecked, indeterminate, disabled, required, and error states.',
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
  tags: ['autodocs'],
  // Controls let you change props in the Storybook UI.
  argTypes: {
    state: {
      control: 'select',
      options: Object.values(CheckboxState),
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'boolean',
    },
  },
  // Args are the default props shared by all stories unless a story overrides them.
  args: {
    label: 'Default label',
    disabled: false,
    error: false,
    onChange: fn(),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// This render function makes the story interactive.
// The component is controlled, so the story owns state and updates args on change.
const renderInteractiveCheckbox: Story['render'] = (args) => {
  const [, updateArgs] = useArgs<typeof args>();

  return (
    <Checkbox
      {...args}
      onChange={(checked) => {
        args.onChange?.(checked);
        updateArgs({
          state: checked ? CheckboxState.Checked : CheckboxState.Unchecked,
        });
      }}
    />
  );
};

export const Standard: Story = {
  args: {
    state: CheckboxState.Unchecked,
  },
  render: renderInteractiveCheckbox,
};

export const Indeterminate: Story = {
  args: {
    state: CheckboxState.Indeterminate,
  },
  render: renderInteractiveCheckbox,
};

export const WithSubLabel: Story = {
  args: {
    state: CheckboxState.Unchecked,
    subLabel: 'Test SubLabel',
  },
  render: renderInteractiveCheckbox,
};

export const Required: Story = {
  args: {
    state: CheckboxState.Unchecked,
    required: true,
    errorMessage: "This check is required",
    subLabel: 'Test SubLabel',
  },
  render: renderInteractiveCheckbox,
};

export const Disabled: Story = {
  args: {
    state: CheckboxState.Unchecked,
    disabled: true,
    subLabel: 'Test SubLabel',
  },
  render: renderInteractiveCheckbox,
};
