import { Heading, Icon } from "@thenolans/nolan-ui";
import NoteGrid from "components/NoteGrid";
import useNotes from "hooks/useNotes";
import orderBy from "lodash/orderBy";
import { ComponentPropsWithoutRef } from "react";
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

  console.log(notes);

  const sortedNotes = orderBy(notes, "updated_at", "desc").reduce(
    (sorted, note) => {
      if (note.is_pinned) {
        sorted.pinned = [...sorted.pinned, note];
      } else {
        sorted.other = [...sorted.other, note];
      }
      return sorted;
    },
    {
      pinned: [] as Note[],
      other: [] as Note[],
    }
  );

  if (isFetching) {
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
    <div className="space-y-8 sm:space-y-16">
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
  );
}
