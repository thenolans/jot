import "./ListTile.css";

import Urls from "constants/urls";
import { reverse } from "named-urls";
import { Link } from "react-router-dom";
import { List } from "types";

type Props = {
  list: List;
};

export default function ListTile({ list }: Props) {
  return (
    <div className="tile">
      <Link
        to={reverse(Urls.routes["list:details"], { id: list._id })}
        className="tile__content"
      >
        <h3 className="tile__title">{list.name}</h3>
      </Link>
    </div>
  );
}
