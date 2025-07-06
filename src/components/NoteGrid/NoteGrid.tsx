import { Heading, Icon } from "@thenolans/nolan-ui";
import Note from "components/Note";
import { ROUTE_PATHS } from "constants/urls";
import useNotes from "hooks/useNotes";
import { reverse } from "named-urls";
import Masonry from "react-masonry-css";
import { Link } from "react-router-dom";

export default function NoteGrid() {
  const { notes, isFetching, appliedFilters } = useNotes();

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
    <Masonry
      breakpointCols={{
        default: 3,
        1024: 2,
      }}
      className="flex -ml-2 sm:-ml-4 w-auto"
      columnClassName="pl-2 sm:pl-4 bg-clip-padding"
    >
      {notes.map(({ content, id }) => (
        <Link
          to={reverse(ROUTE_PATHS.editNote, { id })}
          key={id}
          state={{ noteContent: content }}
        >
          <Note
            className="transition-all hover:border-primary-800 mb-2 sm:mb-4"
            content={content}
          />
        </Link>
      ))}
    </Masonry>
  );
}
