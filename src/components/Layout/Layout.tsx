import Container from "components/Container";
import Sidebar from "components/Sidebar";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-grow p-16 max-h-screen overflow-auto">
        <Container>{children}</Container>
      </div>
    </div>
  );
}
