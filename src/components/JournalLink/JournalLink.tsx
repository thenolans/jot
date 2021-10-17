import "./JournalLink.css";

import Urls from "constants/urls";
import { reverse } from "named-urls";
import { Link } from "react-router-dom";

type Props = {
  id: string;
  name: string;
};

export default function JournalCard({ id, name }: Props) {
  return (
    <Link
      to={reverse(Urls.routes["journal:details"], { id })}
      className="c-journal-link"
    >
      <div className="c-journal-link__spine" />
      <svg
        width="25"
        height="32"
        viewBox="0 0 25 32"
        className="c-journal-link__bookmark"
      >
        <path
          d="M0.476105 0.115967H24.4761V31.2207L12.4761 19.3094L0.476105 31.2207V0.115967Z"
          fill="black"
          fillOpacity="0.2"
        />
      </svg>
      <div className="c-journal-link__name">{name}</div>
    </Link>
  );
}
