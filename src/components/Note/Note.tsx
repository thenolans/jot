import { Card, Icon } from "@thenolans/nolan-ui";
import classNames from "classnames";
import useNotes from "hooks/useNotes";
import React, { useEffect, useRef, useState } from "react";
import { Note as NoteType } from "types";
import marked from "utils/marked";

type Props = {
  canClick?: boolean;
  className?: string;
  isDemo?: boolean;
  note: NoteType;
};

export default function Note({ canClick, note, className, isDemo }: Props) {
  const { updateNote } = useNotes();

  const markdownEl = useRef<HTMLDivElement>(null);
  const [isPinned, setIsPinned] = useState(note.is_pinned);

  function handlePin(e: React.MouseEvent<HTMLButtonElement>) {
    // Prevent button click from propagating to the link
    // that opens the edit note modal
    e.stopPropagation();
    e.preventDefault();

    const newPinnedValue = !isPinned;

    setIsPinned(newPinnedValue);
    updateNote(note.id, { is_pinned: newPinnedValue });
  }

  useEffect(() => {
    // Prevent anchor clicks in the markdown from propagating to the link
    // that opens the edit note modal
    function handleMarkdownElementClicks(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "A") {
        e.stopPropagation();
      }
    }

    if (markdownEl && markdownEl.current) {
      const node = markdownEl.current;
      node.addEventListener("click", handleMarkdownElementClicks, false);

      return () => {
        node.removeEventListener("click", handleMarkdownElementClicks, false);
      };
    }
  }, [markdownEl]);

  function createMarkup() {
    return {
      __html: marked.parse(note.content),
    };
  }

  return (
    <Card
      canClick={canClick}
      className={classNames("relative min-h-16", className)}
    >
      {!isDemo && (
        <button
          aria-label={isPinned ? "Unpin note" : "Pin note"}
          onClick={(e) => handlePin(e)}
          className="absolute right-3 top-3"
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
      )}
      <Card.Body>
        <div
          className="u-markdown space-y-4 text-gray-600 pr-4"
          ref={markdownEl}
          // @ts-expect-error
          dangerouslySetInnerHTML={createMarkup()}
        />
      </Card.Body>
    </Card>
  );
}
