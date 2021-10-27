import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick: () => void;
};

export default function Note({ children, onClick }: Props) {
  return (
    <div
      role="button"
      className="rounded-3xl bg-primary-100 p-6 text-primary-800"
      onClick={onClick}
    >
      {children}
    </div>
  );
}
