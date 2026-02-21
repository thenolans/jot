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
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(
        NotesFilterParams.SEARCH,
        String(debouncedSearchQuery),
      );
      // We don't want to search just folders, so we remove folder ID
      newSearchParams.delete(NotesFilterParams.FOLDER_ID);
      navigate(`${ROUTE_PATHS.search_notes}?${newSearchParams.toString()}`, {
        replace: true,
      });
    } else {
      searchParams.delete(NotesFilterParams.SEARCH);
      setSearchParams(searchParams, { replace: true });
    }
  }, [debouncedSearchQuery, navigate, searchParams, setSearchParams]);

  return (
    <div className="w-full sm:fixed sm:top-2 sm:z-50 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md">
      <SearchInput
        name="search"
        className="sm:border-slate-200 sm:shadow-none sm:border"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
      />
    </div>
  );
}
