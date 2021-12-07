import Container from "components/core/Container";
import Navigation from "components/core/Navigation";
import { ReactNode, RefObject, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

type Props = {
  children:
    | ReactNode
    | ((scrollContainerRef: RefObject<HTMLDivElement>) => ReactNode);
};

export default function Layout({ children }: Props) {
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    scrollContainerRef.current.scrollTop = 0;
  }, [location.pathname]);

  return (
    <div className="flex flex-col md:flex-row">
      <Navigation />
      <div ref={scrollContainerRef} className="flex-grow">
        <div className="py-20 md:py-16 px-2 md:px-8 xl:px-16">
          <Container>{children}</Container>
        </div>
      </div>
    </div>
  );
}
