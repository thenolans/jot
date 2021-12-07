import classNames from "classnames";
import { forwardRef, ReactNode, TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  children?: ReactNode;
  className?: string;
};

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ className, ...props }, ref) => (
    <textarea
      className={classNames(
        "w-full rounded-xl py-4 px-4 h-12 bg-white border border-gray-200 focus:border-primary-500 outline-none text-primary-600 placeholder-gray-400 min-h-24",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
export default Textarea;
