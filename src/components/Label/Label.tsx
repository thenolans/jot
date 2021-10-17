import classNames from "classnames";
import { LabelHTMLAttributes, ReactNode } from "react";

type Props = LabelHTMLAttributes<HTMLLabelElement> & {
  children?: ReactNode;
  className?: string;
};

export default function Label({ className, ...props }: Props) {
  return (
    <label
      className={classNames("ml-6 text-sm text-gray-500 block mb-1", className)}
      {...props}
    />
  );
}
