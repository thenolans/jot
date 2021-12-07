import "./Note.css";

import marked from "marked";
import { Note as NoteType } from "types";
import scramble from "utils/scramble";

type Props = {
  note: NoteType;
  onClick: () => void;
  scrambleContent?: boolean;
};

export default function Note({ note, onClick, scrambleContent }: Props) {
  const { content, isPrivate } = note;

  function createMarkup() {
    return {
      __html: marked.parse(
        isPrivate && scrambleContent ? scramble(content) : content
      ),
    };
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className="c-note"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onClick();
        }
      }}
      onClick={onClick}
      dangerouslySetInnerHTML={createMarkup()}
    />
  );
}
