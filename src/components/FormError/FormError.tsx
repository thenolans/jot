import classNames from "classnames";
import { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  className?: string;
};

export default function Label({ className, ...props }: Props) {
  return (
    <div
      className={classNames("text-sm text-red-700 block mt-1", className)}
      {...props}
    />
  );
}
