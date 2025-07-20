import { Heading, Icon } from "@thenolans/nolan-ui";
import classNames from "classnames";
import NoteGrid from "components/NoteGrid";
import useNotes from "hooks/useNotes";
import orderBy from "lodash/orderBy";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import { Note } from "types";

function SectionTitle(props: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className="text-gray-500 uppercase font-bold text-sm mb-2 ml-4"
      {...props}
    />
  );
}

export default function NoteList() {
  const { notes, isFetching, appliedFilters } = useNotes();
  const [cachedNotes, setCachedNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (!isFetching) {
      // While react-query isn't supposed to clear data while fetching,
      // The notes array is an empty array while fetching
      // To have the improved loading state and avoid the jumping content
      // between renders, we need have the previous results persist,
      // so we store in state after fetching
      setCachedNotes(notes);
    }
  }, [notes, isFetching]);

  const sortedNotes = orderBy(cachedNotes, "updated_at", "desc").reduce(
    (sorted, note) => {
      if (note.is_pinned) {
        sorted.pinned.push(note);
      } else {
        sorted.other.push(note);
      }
      return sorted;
    },
    {
      pinned: [] as Note[],
      other: [] as Note[],
    }
  );

  if (isFetching && !cachedNotes.length) {
    // TODO Skeleton loaders
    return (
      <div className="p-12 text-gray-500">
        <Icon size={64} icon="Loader" className="animate-spin mx-auto" />
      </div>
    );
  }

  if (!isFetching && notes.length === 0) {
    return (
      <div className="py-8 text-center space-y-4 text-primary-800 flex flex-col items-center">
        <Icon size={96} icon="FileText" strokeWidth={1} />
        <Heading>
          {appliedFilters
            ? "No notes match your applied filters!"
            : "You don't have any notes, yet!"}
        </Heading>
        {appliedFilters && (
          <div className="text-gray-500">
            Adjust your applied filter to try again or create a new note
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {isFetching && (
        <div className="absolute w-full h-full z-10 py-10 text-gray-500">
          <Icon size={64} icon="Loader" className="animate-spin mx-auto" />
        </div>
      )}
      <div
        className={classNames(
          "space-y-8 sm:space-y-16 ",
          isFetching && "opacity-50"
        )}
      >
        {!!sortedNotes.pinned.length && (
          <div>
            {!!sortedNotes.other.length && <SectionTitle>Pinned</SectionTitle>}
            <NoteGrid notes={sortedNotes.pinned} />
          </div>
        )}
        {!!sortedNotes.other.length && (
          <div>
            {!!sortedNotes.pinned.length && <SectionTitle>Other</SectionTitle>}
            <NoteGrid notes={sortedNotes.other} />
          </div>
        )}
      </div>
    </div>
  );
}
