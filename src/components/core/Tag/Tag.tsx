import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Tag({ children }: Props) {
  return (
    <div className="inline-block text-primary-800 bg-primary-300 rounded-lg px-3 py-1 text-xs">
      {children}
    </div>
  );
}
