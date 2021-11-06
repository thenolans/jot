import classNames from "classnames";
import Icon from "components/core/Icon";
import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  strikeThrough?: boolean;
};

export default function Checkbox({
  className,
  label,
  checked,
  strikeThrough,
  ...props
}: Props) {
  return (
    <label
      className={classNames(
        "block hover:text-primary-600 cursor-pointer",
        {
          "text-gray-300": checked,
          "text-gray-600": !checked,
        },
        className
      )}
    >
      <div className="inline-flex items-center space-x-4 relative">
        <div className="relative w-6 h-6 border-2 border-gray-200 rounded-full flex-shrink-0">
          {checked && (
            <Icon
              className={classNames(
                "u-absolute-center",
                !strikeThrough && "text-primary-600"
              )}
              variant="fa-check"
            />
          )}
        </div>
        <div>
          {label}
          {strikeThrough && checked && (
            <div className="border-t absolute top-1/2 border-gray-400 -left-2 -right-2" />
          )}
        </div>
      </div>
      <input checked={checked} className="sr-only" type="checkbox" {...props} />
    </label>
  );
}
