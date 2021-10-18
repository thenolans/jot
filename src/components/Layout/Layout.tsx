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
      <div className="flex-grow max-h-screen overflow-auto">
        <div className="py-16 px-2 md:px-8 xl:px-16">
          <Container>{children}</Container>
        </div>
      </div>
    </div>
  );
}
