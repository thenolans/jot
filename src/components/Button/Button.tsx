import classNames from "classnames";
import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonTheme = "primary" | "dangerLink" | "mutedLink";

type ButtonOptions = {
  fluid?: boolean;
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  className?: string;
  theme?: ButtonTheme;
  options?: ButtonOptions;
};

const themeStyles = {
  common: "flex items-center justify-center transition-colors",
  commonNonLink: "rounded-lg h-12 px-4",
  primary: "bg-yellow-600 hover:bg-yellow-700 text-white",
  dangerLink: "text-red-600 hover:text-red-700",
  mutedLink: "text-gray-600 hover:text-yellow-700",
};

export function createButtonVariant(
  theme: ButtonTheme,
  options: ButtonOptions,
  className?: string
) {
  const isLinkTheme = theme.includes("Link");

  return classNames(
    themeStyles.common,
    !isLinkTheme && themeStyles.commonNonLink,
    themeStyles[theme],
    options.fluid && "w-full",
    className
  );
}

export default function Button({
  className,
  options = {},
  theme = "primary",
  type = "button",
  ...props
}: Props) {
  return (
    <button
      className={createButtonVariant(theme, options, className)}
      type={type}
      {...props}
    />
  );
}
