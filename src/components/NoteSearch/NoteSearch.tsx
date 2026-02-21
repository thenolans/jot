import { SearchInput, useDebounce } from "@thenolans/nolan-ui";
import { ROUTE_PATHS } from "constants/urls";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NotesFilterParams } from "types";

export default function NoteSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultSearchQuery = searchParams.get(NotesFilterParams.SEARCH) || "";
  const [searchQuery, setSearchQuery] = useState(defaultSearchQuery);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedSearchQuery) {
      // Navigate to search route with only the 'q' param, clearing all other params
      const newSearchParams = new URLSearchParams();
      newSearchParams.set(
        NotesFilterParams.SEARCH,
        String(debouncedSearchQuery),
      );
      navigate(`${ROUTE_PATHS.search_notes}?${newSearchParams.toString()}`, {
        replace: true,
      });
    } else {
      searchParams.delete(NotesFilterParams.SEARCH);
      setSearchParams(searchParams, { replace: true });
    }
  }, [debouncedSearchQuery, navigate, searchParams, setSearchParams]);

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
