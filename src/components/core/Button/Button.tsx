import "./Button.css";

import classNames from "classnames";
import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonTheme =
  | "primary"
  | "secondary"
  | "danger"
  | "link-danger"
  | "link-muted"
  | "link-primary"
  | "rounded";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  className?: string;
  theme?: ButtonTheme;
  fluid?: boolean;
};

export default function Button({
  className,
  fluid = false,
  theme = "primary",
  type = "button",
  ...props
}: Props) {
  const isLinkVariant = theme.includes("link");

  return (
    <button
      className={classNames(
        "button",
        isLinkVariant && "button--link",
        `button--${theme}`,
        fluid && "w-full",
        className
      )}
      type={type}
      {...props}
    />
  );
}
