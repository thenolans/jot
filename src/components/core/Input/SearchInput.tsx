import classNames from "classnames";
import Icon, { Search } from "components/core/Icon";
import { forwardRef, InputHTMLAttributes, ReactNode, useState } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  children?: ReactNode;
  className?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, type = "text", ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="relative w-full">
        <Icon
          className={classNames(
            "absolute left-4 top-1/2 transform -translate-y-1/2",
            isFocused ? "text-primary-600" : "text-gray-400"
          )}
          icon={Search}
        />
        <input
          className={classNames("c-input c-input--search", className)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          ref={ref}
          type={type}
          {...props}
        />
      </div>
    );
  }
);

export default Input;
