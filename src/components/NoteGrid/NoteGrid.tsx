import Note from "components/Note";
import { ROUTE_PATHS } from "constants/urls";
import { reverse } from "named-urls";
import Masonry from "react-masonry-css";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Note as NoteType, NotesFilterParams } from "types";

type Props = {
  notes: NoteType[];
};

export default function NoteGrid({ notes }: Props) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNoteClick = (noteId: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(NotesFilterParams.EDITING_NOTE_ID, String(noteId));
    navigate(`${location.pathname}?${newSearchParams.toString()}`, {
      replace: true,
    });
  };

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
        return (
          <div
            key={note.id}
            onClick={() => handleNoteClick(note.id)}
            className="cursor-pointer"
          >
            <Note
              canClick
              className="transition-all hover:border-primary-800 mb-2 sm:mb-4"
              note={note}
            />
          </div>
        );
      })}
    </Masonry>
  );
}
