import { Card } from "@thenolans/nolan-ui";
import classNames from "classnames";
import PinNoteButton from "components/PinNoteButton/PinNoteButton";
import DOMPurify from "dompurify";
import { useEffect, useRef } from "react";
import { Note as NoteType } from "types";
import marked from "utils/marked";

type Props = {
  canClick?: boolean;
  className?: string;
  isDemo?: boolean;
  note: NoteType;
};

export default function Note({ canClick, note, className, isDemo }: Props) {
  const markdownEl = useRef<HTMLDivElement>(null);

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
      __html: DOMPurify.sanitize(marked.parse(note.content) as string),
    };
  }

  return (
    <Card
      canClick={canClick}
      className={classNames("relative min-h-16", className)}
    >
      {!isDemo && (
        <div className="hidden md:flex px-2 absolute right-0 top-3">
          <PinNoteButton noteId={note.id} isPinned={note.is_pinned} />
        </div>
      )}
      <Card.Body className="max-h-96 flex">
        <div
          className="u-markdown space-y-4 text-gray-600 lg:pr-4 max-h-full overflow-hidden"
          ref={markdownEl}
          dangerouslySetInnerHTML={createMarkup()}
        />
      </Card.Body>
    </Card>
  );
}
