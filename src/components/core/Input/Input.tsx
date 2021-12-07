import classNames from "classnames";
import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  children?: ReactNode;
  className?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      className={classNames("c-input", className)}
      ref={ref}
      type={type}
      {...props}
    />
  )
);

export default Input;
