import type { Meta, StoryObj } from '@storybook/react-vite';

import { ArgTypes, Description, Primary, Stories, Title } from '@storybook/addon-docs/blocks';
import { useArgs } from 'storybook/preview-api';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Checkbox, CheckboxState } from '../Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A native checkbox that keeps its accessible name limited to the visible label, exposes helper and error text through `aria-describedby` and `aria-errormessage`, and supports keyboard toggling with Space.',
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
  parameters: {
    docs: {
      description: {
        story:
          'Keyboard: focus moves in with Tab and toggles with Space. Accessibility: the checkbox uses a native input, a programmatic label, and optional helper text announced through `aria-describedby`.',
      },
    },
  },
  render: renderInteractiveCheckbox,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: 'Default label' });

    await userEvent.tab();
    await expect(checkbox).toHaveFocus();

    await userEvent.keyboard('[Space]');
    await expect(checkbox).toBeChecked();
  },
};

export const Indeterminate: Story = {
  args: {
    state: CheckboxState.Indeterminate,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Accessibility: indeterminate state is exposed with `aria-checked="mixed"` so assistive technology announces it correctly.',
      },
    },
  },
  render: renderInteractiveCheckbox,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: 'Default label' });

    await expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
  },
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
    errorMessage: 'This check is required',
    subLabel: 'Test SubLabel',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Accessibility: required validation marks the checkbox invalid and links the inline error through `aria-errormessage` for screen readers.',
      },
    },
  },
  render: renderInteractiveCheckbox,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: 'Default label' });

    await expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    await expect(checkbox).toHaveAttribute('aria-errormessage');
    await expect(canvas.getByText('This check is required')).toHaveAttribute('role', 'alert');
  },
};

export const Disabled: Story = {
  args: {
    state: CheckboxState.Unchecked,
    disabled: true,
    subLabel: 'Test SubLabel',
  },
  render: renderInteractiveCheckbox,
};
