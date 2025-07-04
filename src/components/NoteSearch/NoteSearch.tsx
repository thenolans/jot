import { useDebounce } from "@thenolans/nolan-ui";
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
    <div className="flex rounded-2xl max-w-lg w-full">
      <div className="shrink-0 relative z-10 h-12 w-12 rounded-xl bg-emerald-800 text-white justify-center items-center flex">
        J
      </div>
      <input
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border-2 border-gray-100 h-12 w-full bg-white rounded-xl pl-16 -translate-x-12 outline-none focus:border-primary-800 text-gray-700"
      />
    </div>
  );
}
