import classNames from "classnames";
import { useEffect, useRef } from "react";
import marked from "utils/marked";

type Props = {
  content: string;
  className?: string;
};

export default function Note({ content, className }: Props) {
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
    <div
      className={classNames(
        "border-2 text-sm sm:text-base border-gray-100 text-gray-600 rounded-xl p-3 sm:p-6 bg-white",
        className
      )}
    >
      <div
        className="u-markdown space-y-4"
        ref={markdownEl}
        // @ts-expect-error
        dangerouslySetInnerHTML={createMarkup()}
      />
    </div>
  );
}
