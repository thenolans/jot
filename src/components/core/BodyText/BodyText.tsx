import classNames from "classnames";
import { ComponentPropsWithoutRef } from "react";

export default function BodyText({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return <div className={classNames("text-gray-700", className)} {...props} />;
}
