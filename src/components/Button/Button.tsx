import classNames from "classnames";
import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonTheme = "primary" | "secondary" | "link--danger" | "link--muted";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  className?: string;
  theme?: ButtonTheme;
  fluid?: boolean;
};

const themeMap = {
  // Common theme styles for both regular variants and link variants
  common: "inline-flex items-center justify-center space-x-2 transition-colors",
  // Common theme styles for non-link variants
  commonNonLink: "rounded-lg h-12 px-4",
  primary: "bg-primary-600 hover:bg-primary-700 text-white",
  secondary:
    "bg-transparent border-2 border-primary-600 text-primary-600 hover:border-primary-700 hover:text-primary-700",
  "link--danger": "text-danger-600 hover:text-danger-700",
  "link--muted": "text-gray-500 hover:text-primary-600",
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
        themeMap[theme],
        themeMap.common,
        !isLinkVariant && themeMap.commonNonLink,
        fluid && "w-full"
      )}
      type={type}
      {...props}
    />
  );
}
