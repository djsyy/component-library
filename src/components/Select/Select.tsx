import type React from "react";
import { useId } from "react";

import "./Select.css";

export interface SelectProps extends React.ComponentPropsWithoutRef<"select"> {
  /** Main label displayed for the select. */
  label: string;
  /** Controls whether the label sits above or beside the select. */
  labelPosition?: "top" | "left";
  /** Optional helper text shown below the select. */
  details?: string;
  /** Forces the select into an error state. */
  error?: boolean;
  /** Message shown when the select is in an error state. */
  errorMessage?: string;
}

export const Select = ({
  label,
  labelPosition = "top",
  details,
  error = false,
  errorMessage,
  disabled = false,
  required = false,
  className,
  id,
  children,
  ...props
}: SelectProps) => {
  const selectId = useId();
  const labelId = useId();
  const detailsId = useId();
  const errorMessageId = useId();
  const controlId = id ?? selectId;
  const hasError = error;
  const describedBy = [
    details ? detailsId : "",
    hasError && errorMessage ? errorMessageId : "",
  ]
    .filter(Boolean)
    .join(" ");

  const rootClassName = [
    "select-field",
    `select-field--label-${labelPosition}`,
    disabled ? "select-field--disabled" : "",
    hasError ? "select-field--error" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const controlClassName = ["select__control", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName}>
      <label className="select__label" htmlFor={controlId} id={labelId}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <div className="select__control-wrapper">
        <select
          {...props}
          id={controlId}
          className={controlClassName}
          disabled={disabled}
          required={required}
          aria-labelledby={labelId}
          aria-describedby={describedBy || undefined}
          aria-errormessage={hasError && errorMessage ? errorMessageId : undefined}
          aria-invalid={hasError || undefined}
        >
          {children}
        </select>
      </div>
      <div className="select__supporting">
        {details ? (
          <p className="select__details" id={detailsId}>
            {details}
          </p>
        ) : null}
        {hasError && errorMessage ? (
          <p className="select__error-message" id={errorMessageId} role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
};
