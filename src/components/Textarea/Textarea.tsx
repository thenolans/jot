import classNames from "classnames";
import { forwardRef, ReactNode, TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  children?: ReactNode;
  className?: string;
};

const Input = forwardRef<HTMLTextAreaElement, Props>(
  ({ className, ...props }, ref) => (
    <textarea
      className={classNames(
        "w-full rounded-lg p-4 h-12 bg-gray-100 border-2 border-transparent focus:border-yellow-700 outline-none text-gray-800 min-h-24",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
export default Input;
