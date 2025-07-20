import { Icon } from "@thenolans/nolan-ui";
import classNames from "classnames";
import useNotes from "hooks/useNotes";
import { useState } from "react";

type Props = {
  isPinned: boolean;
  noteId: number;
};

export default function PinNoteButton({
  isPinned: defaultIsPinned,
  noteId,
}: Props) {
  const { updateNote } = useNotes();
  const [isPinned, setIsPinned] = useState(defaultIsPinned);
  function handlePin(e: React.MouseEvent<HTMLButtonElement>) {
    // Prevent button click from propagating to the link
    // that opens the edit note modal
    e.stopPropagation();
    e.preventDefault();
    const newPinnedValue = !isPinned;

    setIsPinned(newPinnedValue);
    updateNote(noteId, { is_pinned: newPinnedValue });
  }

  return (
    <button
      aria-label={isPinned ? "Unpin note" : "Pin note"}
      onClick={(e) => handlePin(e)}
    >
      <Icon
        className={classNames(
          "text-gray-500 hover:text-primary-800",
          isPinned &&
            "fill-primary-800 text-primary-800 hover:text-primary-600 hover:fill-primary-600"
        )}
        size={20}
        icon="Thumbtack"
      />
    </button>
  );
}
