import Urls from "constants/urls";
import { reverse } from "named-urls";
import { Link } from "react-router-dom";
import { List } from "types";

type Props = {
  list: List;
};

export default function ListTile({ list }: Props) {
  return (
    <Link
      to={{
        pathname: reverse(Urls.routes["list:details"], { id: list._id }),
        state: { name: list.name },
      }}
      className="bg-primary-300 text-primary-700 p-8 rounded-2xl flex items-center justify-center"
    >
      <h3 className="text-xl text-center">{list.name}</h3>
    </Link>
  );
}
