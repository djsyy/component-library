import type React from "react";
import { useId } from "react";

import "./TextInput.css";

export interface TextInputProps extends React.ComponentPropsWithoutRef<"input"> {
  /** Main label displayed for the input. */
  label: string;
  /** Controls whether the label sits above or beside the input. */
  labelPosition?: "top" | "left";
  /** Optional helper text shown below the input. */
  details?: string;
  /** Forces the input into an error state. */
  error?: boolean;
  /** Message shown when the input is in an error state. */
  errorMessage?: string;
}

export const TextInput = ({
  label,
  labelPosition = "top",
  details,
  error = false,
  errorMessage,
  disabled = false,
  required = false,
  placeholder,
  minLength,
  maxLength,
  className,
  type = "text",
  id,
  ...props
}: TextInputProps) => {
  const inputId = useId();
  const labelId = useId();
  const detailsId = useId();
  const errorMessageId = useId();
  const controlId = id ?? inputId;
  const hasError = error;
  const describedBy = [
    details ? detailsId : "",
    hasError && errorMessage ? errorMessageId : "",
  ]
    .filter(Boolean)
    .join(" ");

  const rootClassName = [
    "input-field",
    `input-field--label-${labelPosition}`,
    disabled ? "input-field--disabled" : "",
    hasError ? "input-field--error" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const controlClassName = ["input__control", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName}>
      <label className="input__label" htmlFor={controlId} id={labelId}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <input
        {...props}
        id={controlId}
        type={type}
        className={controlClassName}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        aria-labelledby={labelId}
        aria-describedby={describedBy || undefined}
        aria-errormessage={hasError && errorMessage ? errorMessageId : undefined}
        aria-invalid={hasError || undefined}
      />
      <div className="input__supporting">
        {details ? (
          <p className="input__details" id={detailsId}>
            {details}
          </p>
        ) : null}
        {hasError && errorMessage ? (
          <p className="input__error-message" id={errorMessageId} role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
};
