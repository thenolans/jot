import "./JournalEntry.css";

import Button from "components/core/Button";
import Highlighter from "components/core/Highlighter";
import Icon, { Edit } from "components/core/Icon";
import Tag from "components/core/Tag";
import dayjs from "dayjs";
import useSearchParams, { asStringParam } from "hooks/useSearchParams";
import { useState } from "react";
import { Entry } from "types";

import EditJournalEntryModal from "../EditJournalEntryModal";

type Props = {
  entry: Entry;
  refetch: () => void;
};

export default function JournalEntry({ entry, refetch }: Props) {
  const [searchParams] = useSearchParams();
  const highlightTerm = asStringParam(searchParams.q) || "";
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="c-journal-entry">
      <div className="c-journal-entry__date">
        <div>{dayjs(entry.date).format("MMM")}</div>
        <div>{dayjs(entry.date).format("D")}</div>
      </div>
      <div className="c-journal-entry__content">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="c-journal-entry__title">
              <Highlighter
                autoEscape
                searchWords={[highlightTerm]}
                textToHighlight={entry.title}
              />
            </h3>
            <Button
              onClick={() => setIsEditing(true)}
              className="ml-auto pl-4"
              theme="link--muted"
              aria-label="Edit entry"
            >
              <Icon size={20} icon={Edit} />
            </Button>
          </div>
        </div>
        {entry.notes && (
          <div>
            <Highlighter
              autoEscape
              searchWords={[highlightTerm]}
              textToHighlight={entry.notes}
            />
          </div>
        )}
        {!!entry.tags.length && (
          <div className="c-journal-entry__tags">
            {entry.tags.map((tag) => (
              <Tag key={tag._id}>{tag.name}</Tag>
            ))}
          </div>
        )}
      </div>

      <EditJournalEntryModal
        entry={entry}
        isOpen={isEditing}
        onClose={(shouldRefetch?: boolean) => {
          if (shouldRefetch) {
            refetch();
          }

          setIsEditing(false);
        }}
      />
    </div>
  );
}
