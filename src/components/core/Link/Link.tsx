import classNames from "classnames";
import { Link as RRLink, LinkProps } from "react-router-dom";

type Props = {
  theme?: "muted" | "primary" | "reset";
} & LinkProps;

const themeMap = {
  primary: "text-primary-600 hover:text-primary-700",
  muted: "text-gray-300 hover:text-primary-600",
  reset: "",
};

export default function Link({
  className,
  theme = "primary",
  ...props
}: Props) {
  return (
    <RRLink className={classNames(themeMap[theme], className)} {...props} />
  );
}
