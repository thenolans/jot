import classNames from "classnames";
import Icon from "components/core/Icon";
import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function Checkbox({
  className,
  label,
  checked,
  ...props
}: Props) {
  return (
    <label
      className={classNames(
        "block text-gray-600 hover:text-primary-600 cursor-pointer",
        className
      )}
    >
      <div className="flex items-center space-x-4">
        <div className="relative w-6 h-6 border-2 border-gray-200 rounded-full flex-shrink-0">
          {checked && (
            <Icon
              className="u-absolute-center text-primary-600"
              variant="fa-check"
            />
          )}
        </div>
        <div>{label}</div>
      </div>
      <input checked={checked} className="sr-only" type="checkbox" {...props} />
    </label>
  );
}
