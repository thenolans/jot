import { Card } from "@thenolans/nolan-ui";
import { useEffect, useRef } from "react";
import marked from "utils/marked";

type Props = {
  canClick?: boolean;
  content: string;
  className?: string;
};

export default function Note({ canClick, content, className }: Props) {
  const markdownEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent anchor clicks in the markdown from propagating to the link
    // that opens the edit note modal
    function handleAnchorClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "A") {
        e.stopPropagation();
      }
    }

    if (markdownEl && markdownEl.current) {
      const node = markdownEl.current;
      node.addEventListener("click", handleAnchorClick, false);

      return () => {
        node.removeEventListener("click", handleAnchorClick, false);
      };
    }
  }, [markdownEl]);

  function createMarkup() {
    return {
      __html: marked.parse(content),
    };
  }

  return (
    <Card canClick={canClick} className={className}>
      <Card.Body>
        <div
          className="u-markdown space-y-4 text-gray-600"
          ref={markdownEl}
          // @ts-expect-error
          dangerouslySetInnerHTML={createMarkup()}
        />
      </Card.Body>
    </Card>
  );
}
