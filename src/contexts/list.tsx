import { createContext } from "react";
import { ListGroup } from "types";
import { Updater } from "use-immer";

type ListContextType = {
  listId: string;
  groups: ListGroup[];
  updateGroups: Updater<ListGroup[]>;
};

const ListContext = createContext<ListContextType>({
  listId: "",
  groups: [],
  updateGroups() {},
});

export default ListContext;
