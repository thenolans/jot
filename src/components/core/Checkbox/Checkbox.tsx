import "./Checkbox.css";

import classNames from "classnames";
import Icon, { Checkmark } from "components/core/Icon";
import { InputHTMLAttributes } from "react";

type Props = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "checked" | "className" | "onChange"
> & {
  label: string;
  size?: "sm" | "md";
  strikeThrough?: boolean;
};

const iconSize = {
  sm: 12,
  md: 16,
};

export default function Checkbox({
  className,
  label,
  checked,
  strikeThrough,
  size = "md",
  ...props
}: Props) {
  return (
    <label
      className={classNames(
        "c-checkbox",
        `c-checkbox--${size}`,
        checked && "c-checkbox--checked",
        strikeThrough && "c-checkbox--strike-through"
      )}
    >
      <div className="c-checkbox__container">
        <div className="c-checkbox__box">
          {checked && (
            <Icon
              className="c-checkbox__checkmark u-absolute-center"
              size={iconSize[size]}
              strokeWidth={4}
              icon={Checkmark}
            />
          )}
        </div>
        <div className="c-checkbox__label">
          {label}
          {strikeThrough && checked && <div className="c-checkbox__strike" />}
        </div>
      </div>
      <input checked={checked} className="sr-only" type="checkbox" {...props} />
    </label>
  );
}
