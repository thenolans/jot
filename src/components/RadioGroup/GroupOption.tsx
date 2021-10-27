import classNames from "classnames";
import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  value: string;
  name: string;
};

export default function GroupOption({ label, ...props }: Props) {
  return (
    <label
      className={classNames(
        "radio-group__option",
        props.checked && "radio-group__option--checked"
      )}
    >
      {label}
      <input className="sr-only" {...props} type="radio" />
    </label>
  );
}
