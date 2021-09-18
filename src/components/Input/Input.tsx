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
        "w-full rounded-lg px-4 h-12 bg-gray-100 border-2 border-transparent focus:border-yellow-700 outline-none text-gray-800",
        className
      )}
      ref={ref}
      type={type}
      {...props}
    />
  )
);
export default Input;
