import Note from "components/Note";
import Masonry from "react-masonry-css";
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
        512: 1,
      }}
      className="flex -ml-4 w-auto"
      columnClassName="pl-4 bg-clip-padding"
    >
      {notes.map(({ content, id }) => (
        <Note
          className="transition-all hover:shadow-xl hover:border-primary-800"
          key={id}
          content={content}
        />
      ))}
    </Masonry>
  );
}
