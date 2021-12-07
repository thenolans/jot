import BodyText from "components/core/BodyText";
import ConfirmModal from "components/core/ConfirmModal";
import ContextMenu from "components/core/ContextMenu";
import Heading from "components/core/Heading";
import Highlighter from "components/core/Highlighter";
import Tag from "components/core/Tag";
import Urls from "constants/urls";
import useSearchParams, { asStringParam } from "hooks/useSearchParams";
import { reverse } from "named-urls";
import { useState } from "react";
import { Entry } from "types";
import http from "utils/http";

import EditJournalEntryModal from "../EditJournalEntryModal";

type Props = {
  entry: Entry;
  refetch: () => void;
};

export default function JournalEntry({ entry, refetch }: Props) {
  const [searchParams] = useSearchParams();
  const highlightTerm = asStringParam(searchParams.q) || "";
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  async function deleteEntry() {
    await http.delete(
      reverse(Urls.api["journal:entry"], {
        journalId: entry.journalId,
        entryId: entry._id,
      })
    );

    refetch();
  }

  return (
    <div className="p-4 border rounded-lg bg-white space-y-4">
      <div className="flex items-center justify-between">
        <Heading as="h4">
          <Highlighter
            autoEscape
            searchWords={[highlightTerm]}
            textToHighlight={entry.title}
          />
        </Heading>
        <ContextMenu>
          <ContextMenu.Action onClick={() => setIsEditing(true)}>
            Edit entry
          </ContextMenu.Action>
          <ContextMenu.Action onClick={() => setIsConfirmingDelete(true)}>
            Delete entry
          </ContextMenu.Action>
        </ContextMenu>
      </div>
      {entry.notes && (
        <BodyText>
          <Highlighter
            autoEscape
            searchWords={[highlightTerm]}
            textToHighlight={entry.notes}
          />
        </BodyText>
      )}
      {!!entry.tags.length && (
        <div className="space-x-1">
          {entry.tags.map((tag) => (
            <Tag key={tag._id}>{tag.name}</Tag>
          ))}
        </div>
      )}

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
      <ConfirmModal
        ariaLabel="Confirm entry delete"
        isOpen={isConfirmingDelete}
        onClose={() => setIsConfirmingDelete(false)}
        onConfirm={() => deleteEntry()}
        title="Are you sure you want to delete this entry?"
      />
    </div>
  );
}
