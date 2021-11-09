import "./Note.css";

import useNoteSettings from "hooks/useNoteSettings";
import marked from "marked";
import { Note as NoteType } from "types";
import scramble from "utils/scramble";

type Props = {
  note: NoteType;
  onClick: () => void;
};

export default function Note({ note, onClick }: Props) {
  const { scramblePrivateNotes } = useNoteSettings();
  const { content, isPrivate } = note;

  function createMarkup() {
    return {
      __html: marked.parse(
        isPrivate && scramblePrivateNotes ? scramble(content) : content
      ),
    };
  }

  return (
    <div
      role="button"
      className="c-note"
      onClick={onClick}
      dangerouslySetInnerHTML={createMarkup()}
    />
  );
}
