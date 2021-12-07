import BodyText from "components/core/BodyText";
import Heading from "components/core/Heading";
import Urls from "constants/urls";
import { reverse } from "named-urls";
import { Link } from "react-router-dom";
import { List } from "types";

type Props = {
  list: List;
};

export default function ListTile({ list }: Props) {
  const itemCount = list.itemCount || 0;

  return (
    <Link
      to={{
        pathname: reverse(Urls.routes["list:details"], { id: list._id }),
        state: { name: list.name },
      }}
      className="bg-white border p-4 rounded-xl space-y-4 flex flex-col justify-between"
    >
      <Heading as="h3">{list.name}</Heading>
      <BodyText>
        {itemCount} {itemCount === 1 ? "item" : "items"}
      </BodyText>
    </Link>
  );
}
