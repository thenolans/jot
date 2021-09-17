import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ ...props }: Props) {
  return (
    <input
      className="w-full rounded-lg px-4 h-12"
      placeholder="Search for an entry..."
      type="text"
      {...props}
    />
  );
}
