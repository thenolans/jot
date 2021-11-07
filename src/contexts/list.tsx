import { createContext } from "react";
import { List } from "types";
import { Updater } from "use-immer";

type ListContextType = {
  list: List;
  updateList: Updater<List | undefined>;
};

const ListContext = createContext<ListContextType>({
  // @ts-expect-error
  list: {},
  updateList() {},
});

export default ListContext;
