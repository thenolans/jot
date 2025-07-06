import Note from "components/Note";
import { ROUTE_PATHS } from "constants/urls";
import useNotes from "hooks/useNotes";
import { reverse } from "named-urls";
import Masonry from "react-masonry-css";
import { Link } from "react-router-dom";

export default function NoteGrid() {
  const { notes } = useNotes();

  return (
    <Masonry
      breakpointCols={{
        default: 3,
        1024: 2,
        512: 1,
      }}
      className="flex -ml-2 sm:-ml-4 w-auto"
      columnClassName="pl-2 sm:pl-4 bg-clip-padding"
    >
      {notes.map(({ content, id }) => (
        <Link to={reverse(ROUTE_PATHS.editNote, { id })} key={id}>
          <Note
            className="transition-all hover:border-primary-800"
            content={content}
          />
        </Link>
      ))}
    </Masonry>
  );
}
