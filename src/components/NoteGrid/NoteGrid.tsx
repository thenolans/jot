import Note from "components/Note";
import { ROUTE_PATHS } from "constants/urls";
import { reverse } from "named-urls";
import Masonry from "react-masonry-css";
import { Link, useSearchParams } from "react-router-dom";
import { Note as NoteType } from "types";

type Props = {
  notes: NoteType[];
};

export default function NoteGrid({ notes }: Props) {
  const [searchParams] = useSearchParams();

  return (
    <Masonry
      breakpointCols={{
        default: 3,
        1024: 2,
      }}
      className="flex -ml-2 sm:-ml-4 w-auto"
      columnClassName="pl-2 sm:pl-4 bg-clip-padding"
    >
      {notes.map((note) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("editing_note_id", String(note.id));
        return (
          <Link
            to={`${reverse(ROUTE_PATHS.notes)}?${newSearchParams.toString()}`}
            key={note.id}
          >
            <Note
              canClick
              className="transition-all hover:border-primary-800 mb-2 sm:mb-4"
              note={note}
            />
          </Link>
        );
      })}
    </Masonry>
  );
}
