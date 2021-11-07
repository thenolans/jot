import "./Note.css";

import useNoteSettings from "hooks/useNoteSettings";
import ReactMarkdown from "react-markdown";
import { Note as NoteType } from "types";
import scramble from "utils/scramble";

type Props = {
  note: NoteType;
  onClick: () => void;
};

export default function Note({ note, onClick }: Props) {
  const { scramblePrivateNotes } = useNoteSettings();
  const { content, isPrivate } = note;

  return (
    <div role="button" className="c-note" onClick={onClick}>
      <ReactMarkdown
        children={
          isPrivate && scramblePrivateNotes ? scramble(content) : content
        }
      />
    </div>
  );
}
