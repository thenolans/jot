import { Icon, useDebounce } from "@thenolans/nolan-ui";
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
    <div className="relative sm:max-w-96 focus-within:text-primary-800 text-gray-200 mx-auto">
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <Icon icon="Search" />
      </div>
      <input
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border-2 border-gray-100 h-12 w-full pl-12 mr-auto bg-white rounded-xl sm:rounded-3xl px-4 outline-none focus:border-primary-800 text-gray-700"
      />
    </div>
  );
}
