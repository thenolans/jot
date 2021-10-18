import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Note({ children }: Props) {
  return (
    <div className="rounded-3xl bg-primary-100 p-6 text-primary-800 shadow">
      {children}
    </div>
  );
}
