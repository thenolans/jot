import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Tag({ children }: Props) {
  return (
    <div className="inline-block text-primary-800 bg-primary-300 rounded-full px-4 py-2 text-sm">
      {children}
    </div>
  );
}
