import classNames from "classnames";
import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  children?: ReactNode;
  className?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      className={classNames(
        "w-full rounded-xl px-4 h-12 bg-primary-100 border-2 border-transparent focus:border-primary-700 outline-none text-primary-800 text-lg placeholder-primary-600",
        className
      )}
      ref={ref}
      type={type}
      {...props}
    />
  )
);
export default Input;
