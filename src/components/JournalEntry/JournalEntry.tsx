import "./JournalEntry.css";

import Highlighter from "components/Highlighter";
import Tag from "components/Tag";
import dayjs from "dayjs";
import useSearchParams, { asStringParam } from "hooks/useSearchParams";
import { Entry } from "types";

type Props = {
  entry: Entry;
};

export default function JournalEntry({ entry }: Props) {
  const [searchParams] = useSearchParams();
  const highlightTerm = asStringParam(searchParams.q) || "";

  return (
    <div className="c-journal-entry">
      <div className="c-journal-entry__date">
        <div>{dayjs(entry.date).format("MMM")}</div>
        <div>{dayjs(entry.date).format("D")}</div>
      </div>
      <div className="c-journal-entry__content">
        <h3 className="c-journal-entry__title">
          <Highlighter
            autoEscape
            searchWords={[highlightTerm]}
            textToHighlight={entry.title}
          />
        </h3>
        {entry.notes && (
          <div>
            <Highlighter
              autoEscape
              searchWords={[highlightTerm]}
              textToHighlight={entry.notes}
            />
          </div>
        )}
        <div className="c-journal-entry__tags">
          {entry.tags.map((tag) => (
            <Tag key={tag._id}>{tag.name}</Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
