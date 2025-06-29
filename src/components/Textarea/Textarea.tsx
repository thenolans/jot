import { TextareaHTMLAttributes } from "react";

export default function Textarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className="absolute text-gray-600 text-sm w-full min-h-full h-full max-h-full bg-white border-2 rounded-xl border-gray-100 p-4 shadow-lg focus:border-primary-800 overflow-scroll outline-none hover:border-primary-300"
    />
  );
}
