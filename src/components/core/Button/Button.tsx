import classNames from "classnames";
import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonTheme =
  | "primary"
  | "secondary"
  | "danger"
  | "link--danger"
  | "link--muted"
  | "link--primary"
  | "none";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  className?: string;
  theme?: ButtonTheme;
  fluid?: boolean;
  display?: "flex" | "inline-flex";
};

const themeMap = {
  // Common theme styles for both regular variants and link variants
  common:
    "items-center justify-center space-x-2 transition-colors whitespace-nowrap",
  // Common theme styles for non-link variants
  commonNonLink: "h-12 px-6 rounded-xl",
  primary: "bg-primary-700 hover:bg-primary-800 text-primary-50",
  danger: "bg-danger-700 hover:bg-danger-800 text-danger-50",
  secondary:
    "bg-transparent border-2 border-primary-600 text-primary-600 hover:border-primary-800 hover:text-primary-50 hover:bg-primary-800",
  "link--danger": "text-danger-600 hover:text-danger-700",
  "link--muted": "text-primary-500 hover:text-primary-600",
  "link--primary": "text-primary-700 hover:text-primary-800",
  none: "",
};

export default function Button({
  display = "inline-flex",
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
        themeMap[theme],
        themeMap.common,
        !isLinkVariant && themeMap.commonNonLink,
        fluid && "w-full",
        display,
        className
      )}
      type={type}
      {...props}
    />
  );
}
