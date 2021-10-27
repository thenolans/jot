import ListContext from "contexts/list";
import { useContext } from "react";

export default function useList() {
  return useContext(ListContext);
}
