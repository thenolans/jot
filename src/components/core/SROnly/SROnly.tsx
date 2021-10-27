import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Icon({ children }: Props) {
  return <span className="sr-only">{children}</span>;
}
