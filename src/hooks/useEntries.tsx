import EntriesContext from "contexts/entries";
import { useContext } from "react";

export default function useEntries() {
  return useContext(EntriesContext);
}
