import TagsContext from "contexts/tags";
import { useContext } from "react";

export default function useTags() {
  return useContext(TagsContext);
}
