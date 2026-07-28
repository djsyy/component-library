import type React from "react";

import "./Card.css";

export interface CardProps extends React.ComponentPropsWithoutRef<"article"> {
  /** Visual styling of the card surface. */
  variant?: "elevated" | "outlined";
}

export const Card = ({
  children,
  className,
  variant = "elevated",
  ...props
}: CardProps) => {
  const cardClassName = ["card", `card--${variant}`, className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <article {...props} className={cardClassName}>
      {children}
    </article>
  );
};
