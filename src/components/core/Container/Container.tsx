import classNames from "classnames";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Container({ className, children }: Props) {
  return (
    <div
      className={classNames(
        "container mx-auto px-2 max-w-container md:max-w-none",
        className
      )}
    >
      {children}
    </div>
  );
}
