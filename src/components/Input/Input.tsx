import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ ...props }: Props) {
  return (
    <input
      className="w-full rounded-lg px-4 h-12 bg-gray-100 border-2 border-transparent focus:border-yellow-700 outline-none text-gray-800"
      type="text"
      {...props}
    />
  );
}
