import { findAll, FindAllArgs } from "highlight-words-core";
import { Fragment } from "react";

type Props = FindAllArgs;

export default function Highlighter({ ...findAllArgs }: Props) {
  return (
    <>
      {findAll(findAllArgs).map((chunk, index) => {
        const text = findAllArgs.textToHighlight.slice(chunk.start, chunk.end);
        return chunk.highlight ? (
          // eslint-disable-next-line react/no-array-index-key
          <mark key={index} className="bg-yellow-100">
            {text}
          </mark>
        ) : (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={index}>{text}</Fragment>
        );
      })}
    </>
  );
}
