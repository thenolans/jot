import { findAll, FindAllArgs } from "highlight-words-core";
import { Fragment } from "react";

type Props = FindAllArgs;

export default function Highlighter({ ...findAllArgs }: Props) {
  return (
    <>
      {findAll(findAllArgs).map((chunk, index) => {
        const text = findAllArgs.textToHighlight.slice(chunk.start, chunk.end);
        return chunk.highlight ? (
          <mark key={index} className="bg-yellow-100 text-yellow-900">
            {text}
          </mark>
        ) : (
          <Fragment key={index}>{text}</Fragment>
        );
      })}
    </>
  );
}
