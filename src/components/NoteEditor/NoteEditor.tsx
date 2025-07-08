import { KeyboardEvent, useCallback, useState } from "react";
import getListItemStart from "utils/getListItemStart";
import getStartOfLineText from "utils/getStartOfLineText";
import insertTextAtIndex from "utils/insertTextAtIndex";

type Props = {
  onChange(content: string): void;
  defaultContent?: string;
  shouldAutoFocus?: boolean;
  className?: string;
};

export default function NoteEditor({
  className,
  onChange,
  defaultContent,
  shouldAutoFocus,
}: Props) {
  const [localContent, setLocalContent] = useState(defaultContent || "");

  function handleChange(newContent: string) {
    setLocalContent(newContent);
    onChange(newContent);
  }

  const textareaRef = useCallback((node: HTMLTextAreaElement) => {
    const set = localContent.length;

    if (node !== null) {
      if (shouldAutoFocus) {
        // Set cursor position to end of the content
        node.setSelectionRange(set, set);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      const target = e.target as HTMLTextAreaElement;
      const startOfLineText = getStartOfLineText(target);
      const listItemStart = getListItemStart(startOfLineText);

      if (listItemStart) {
        e.preventDefault();
        const currentSelection = target.selectionStart;
        const newSelection = currentSelection + listItemStart.length + 1;
        const newContent = insertTextAtIndex(
          currentSelection,
          localContent,
          `\n${listItemStart} `
        );
        handleChange(newContent);
        setTimeout(() => {
          target.selectionStart = newSelection;
          target.selectionEnd = newSelection;
        }, 0);
      }
    }
  }

  return (
    <textarea
      ref={textareaRef}
      autoFocus={shouldAutoFocus}
      className={
        className ||
        "w-full resize-none p-6 flex-grow outline-none text-gray-600 min-h-96 text-sm leading-snug"
      }
      value={localContent}
      onKeyDown={handleKeyDown}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
}
