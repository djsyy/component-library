import type React from "react";
import { ButtonSize, ButtonVariant } from "./button.types";
import "./Button.css";

export interface ButtonProps
  extends Omit<
    React.ComponentPropsWithoutRef<"button">,
    "children" | "className" | "disabled" | "type"
  > {
  /** Content rendered inside the button. */
  children?: React.ReactNode;
  /** Additional class name for custom styling. */
  className?: string;
  /** Prevents interaction and applies disabled styling. */
  disabled?: boolean;
  /** Shows a loading state and prevents interaction. */
  loading?: boolean;
  /** Visual style of the button. */
  variant?: ButtonVariant;
  /** Size of the button. */
  size?: ButtonSize;
  /** Native button type attribute. Defaults to `button`. */
  type?: "button" | "submit" | "reset";
}

export const Button = ({
  loading = false,
  variant = ButtonVariant.Primary,
  size = ButtonSize.Medium,
  type = "button",
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const buttonClassName = [
    "button",
    `button--${variant}`,
    `button--${size}`,
    loading ? "button--loading" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClassName}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    />
  );
};
