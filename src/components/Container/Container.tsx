import classNames from "classnames";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Container({ className, children }: Props) {
  return (
    <div className={classNames("container mx-auto px-2", className)}>
      {children}
    </div>
  );
}
