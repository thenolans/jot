import Container from "components/Container";
import Header from "components/Header";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <Container>
      <Header />
      {children}
    </Container>
  );
}
