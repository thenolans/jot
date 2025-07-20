import Note from "components/Note";
import { ROUTE_PATHS } from "constants/urls";
import { reverse } from "named-urls";
import Masonry from "react-masonry-css";
import { Link } from "react-router-dom";
import { Note as NoteType } from "types";

type Props = {
  notes: NoteType[];
};

export default function NoteGrid({ notes }: Props) {
  return (
    <Masonry
      breakpointCols={{
        default: 3,
        1024: 2,
      }}
      className="flex -ml-2 sm:-ml-4 w-auto"
      columnClassName="pl-2 sm:pl-4 bg-clip-padding"
    >
      {notes.map((note) => (
        <Link to={reverse(ROUTE_PATHS.editNote, { id: note.id })} key={note.id}>
          <Note
            canClick
            className="transition-all hover:border-primary-800 mb-2 sm:mb-4"
            note={note}
          />
        </Link>
      ))}
    </Masonry>
  );
}
