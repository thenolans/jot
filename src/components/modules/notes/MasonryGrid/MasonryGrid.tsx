import "./MasonryGrid.css";

import { ReactNode } from "react";
import Masonry from "react-masonry-css";

type Props = {
  children: ReactNode;
};

export default function MasonryGrid({ children }: Props) {
  return (
    <Masonry
      breakpointCols={{
        default: 3,
        1024: 2,
        768: 1,
      }}
      className="c-masonry-grid"
      columnClassName="c-masonry-grid__column"
    >
      {children}
    </Masonry>
  );
}
