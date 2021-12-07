import classNames from "classnames";
import { Link as RRLink, LinkProps } from "react-router-dom";

type Props = {
  theme?: "muted" | "primary" | "reset";
} & LinkProps;

const themeMap = {
  primary: "button button--link button--link-primary",
  muted: "button button--link button--link-muted",
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
