import classNames from "classnames";
import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonTheme = "primary" | "dangerLink" | "mutedLink";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  className?: string;
  theme?: ButtonTheme;
};

const themeStyles = {
  common: "flex items-center transition-colors",
  commonNonLink: "rounded-lg h-12 px-4",
  primary: "bg-yellow-600 hover:bg-yellow-700 text-white",
  dangerLink: "text-red-600 hover:text-red-700",
  mutedLink: "text-gray-600 hover:text-yellow-700",
};

export function createButtonVariant(theme: ButtonTheme, className?: string) {
  const isLinkTheme = theme.includes("Link");

  return classNames(
    themeStyles.common,
    !isLinkTheme && themeStyles.commonNonLink,
    themeStyles[theme],
    className
  );
}

export default function Button({
  className,
  theme = "primary",
  type = "button",
  ...props
}: Props) {
  return (
    <button
      className={createButtonVariant(theme, className)}
      type={type}
      {...props}
    />
  );
}
