import "./ListLink.css";

import Icon, { ChevronRight } from "components/core/Icon";
import Urls from "constants/urls";
import { reverse } from "named-urls";
import { Link } from "react-router-dom";
import { List } from "types";

type Props = {
  list: List;
};

export default function ListLink({ list }: Props) {
  return (
    <Link
      to={reverse(Urls.routes["list:details"], { id: list._id })}
      className="c-list-link"
      key={list._id}
    >
      <div className="space-y-1">
        <div className="c-list-link__name">{list.name}</div>
        <div className="c-list-link__count">
          {list.itemCount} {list.itemCount === 1 ? "item" : "items"}
        </div>
      </div>
      <Icon size={32} className="c-list-link__icon" icon={ChevronRight} />
    </Link>
  );
}
