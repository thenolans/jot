import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Tag({ children }: Props) {
  return (
    <div className="inline-block text-primary-500 bg-primary-100 rounded-lg px-3 py-1 text-xs">
      {children}
    </div>
  );
}
