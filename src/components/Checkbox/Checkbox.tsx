import { useEffect, useId, useRef } from 'react';

import './checkbox.css';

// eslint-disable-next-line react-refresh/only-export-components
export enum CheckboxState {
  Checked = 'Checked',
  Unchecked = 'Unchecked',
  Indeterminate = 'Indeterminate',
}

export interface CheckboxProps {
  /** Main text displayed next to the checkbox. */
  label: string;
  /** Controlled visual state for the checkbox. */
  state: CheckboxState;
  /** Prevents interaction and applies disabled styling. */
  disabled?: boolean;
  /** Forces the checkbox into an error state. */
  error?: boolean;
  /** Message shown below the sub-label when the checkbox is in an error state. */
  errorMessage?: string;
  /** Called when the user toggles the checkbox. Receives the next checked value. */
  onChange: (checked: boolean) => void;
  /** Marks the checkbox as required. If unchecked, the component displays an error state. */
  required?: boolean;
  /** Optional helper text displayed below the main label. */
  subLabel?: string;
}

export const Checkbox = ({
  label,
  state,
  disabled = false,
  error = false,
  errorMessage,
  onChange,
  required = false,
  subLabel,
}: CheckboxProps) => {
  const checkboxId = useId();
  const labelId = useId();
  const descriptionId = useId();
  const errorMessageId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const isChecked = state === CheckboxState.Checked;
  const isIndeterminate = state === CheckboxState.Indeterminate;
  const hasError = error || (required && !isChecked);
  const descriptionIds = [
    subLabel ? descriptionId : '',
    hasError && errorMessage ? errorMessageId : '',
  ]
    .filter(Boolean)
    .join(' ');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const handleChange = () => {
    if (disabled) {
      return;
    }

    onChange(!isChecked && !isIndeterminate);
  };

  const className = [
    'checkbox',
    disabled ? 'checkbox--disabled' : '',
    hasError ? 'checkbox--error' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className}>
      <input
        ref={inputRef}
        id={checkboxId}
        type="checkbox"
        checked={isChecked}
        disabled={disabled}
        required={required}
        aria-checked={isIndeterminate ? 'mixed' : isChecked}
        aria-labelledby={labelId}
        aria-describedby={descriptionIds || undefined}
        aria-errormessage={hasError && errorMessage ? errorMessageId : undefined}
        aria-invalid={hasError || undefined}
        onChange={handleChange}
      />
      <label className="checkbox__interactive" htmlFor={checkboxId}>
        <span className="checkbox__control" aria-hidden="true" />
        <span className="checkbox__label" id={labelId}>
          {label}
        </span>
      </label>
      {(subLabel || (hasError && errorMessage)) ? (
        <div className="checkbox__supporting">
          {subLabel ? (
            <p className="checkbox__sub-label" id={descriptionId}>
              {subLabel}
            </p>
          ) : null}
          {hasError && errorMessage ? (
            <p
              className="checkbox__error-message"
              id={errorMessageId}
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
