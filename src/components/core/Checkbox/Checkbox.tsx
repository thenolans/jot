import classNames from "classnames";
import Icon, { Checkmark } from "components/core/Icon";
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
          "text-gray-300": checked && strikeThrough,
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
              size={16}
              strokeWidth={4}
              icon={Checkmark}
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
