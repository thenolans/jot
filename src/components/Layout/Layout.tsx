import Container from "components/Container";
import Navigation from "components/Navigation";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="h-screen flex flex-col md:flex-row">
      <Navigation />
      <div className="flex-grow md:max-h-screen md:overflow-auto">
        <div className="py-16 px-2 md:px-8 xl:px-16">
          <Container>{children}</Container>
        </div>
      </div>
    </div>
  );
}
