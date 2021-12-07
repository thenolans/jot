import "./Heading.css";

import classNames from "classnames";
import { ComponentPropsWithoutRef } from "react";

type Props = {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  theme?: "danger" | "default";
} & ComponentPropsWithoutRef<"div">;

export default function BodyText({
  as: T = "h1",
  theme = "default",
  className,
  ...props
}: Props) {
  return (
    <T
      className={classNames(
        "c-heading",
        theme && `c-heading--${theme}`,
        className
      )}
      {...props}
    />
  );
}
