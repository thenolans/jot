import { SearchInput, useDebounce } from "@thenolans/nolan-ui";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { NotesFilterParams } from "types";

export default function NoteSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultSearchQuery = searchParams.get(NotesFilterParams.SEARCH) || "";
  const [searchQuery, setSearchQuery] = useState(defaultSearchQuery);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedSearchQuery) {
      searchParams.set(NotesFilterParams.SEARCH, String(debouncedSearchQuery));
    } else {
      searchParams.delete(NotesFilterParams.SEARCH);
    }
    setSearchParams(searchParams, { replace: true });
  }, [debouncedSearchQuery, searchParams, setSearchParams]);

  return (
    <div className="w-full">
      <SearchInput
        name="search"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
      />
    </div>
  );
}
