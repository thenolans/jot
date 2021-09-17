import { findAll, FindAllArgs } from "highlight-words-core";
import { Fragment } from "react";

type Props = FindAllArgs & {
  highlightClassName?: string;
  highlightTag?: keyof JSX.IntrinsicElements;
};

export default function Highlighter({
  highlightClassName,
  highlightTag = "mark",
  ...findAllArgs
}: Props) {
  const HighlightTag = highlightTag;
  return (
    <>
      {findAll(findAllArgs).map((chunk, index) => {
        const text = findAllArgs.textToHighlight.slice(chunk.start, chunk.end);
        return chunk.highlight ? (
          // eslint-disable-next-line react/no-array-index-key
          <HighlightTag key={index} className={highlightClassName}>
            {text}
          </HighlightTag>
        ) : (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={index}>{text}</Fragment>
        );
      })}
    </>
  );
}
