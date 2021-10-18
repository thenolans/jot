import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="text-4xl lg:text-5xl text-primary-700 font-semibold">
      {children}
    </h1>
  );
}
