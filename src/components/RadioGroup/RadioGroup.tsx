import "./RadioGroup.css";

import GroupOption from "./GroupOption";

type Option<T> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  name: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export default function RadioGroup<T extends string>({
  name,
  onChange,
  options,
  value: selectedValue,
}: Props<T>) {
  return (
    <div className="radio-group">
      {options.map((option) => {
        return (
          <GroupOption
            checked={option.value === selectedValue}
            onChange={() => onChange(option.value)}
            name={name}
            label={option.label}
            value={option.value}
            key={option.value}
          />
        );
      })}
    </div>
  );
}
