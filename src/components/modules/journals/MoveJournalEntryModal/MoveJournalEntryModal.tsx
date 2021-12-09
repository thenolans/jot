import { getJournals, updateEntry } from "api/journals";
import Button from "components/core/Button";
import Checkbox from "components/core/Checkbox";
import ContentLoader from "components/core/ContentLoader";
import Label from "components/core/Label";
import Loader from "components/core/Loader";
import Modal, { ModalProps } from "components/core/Modal";
import SROnly from "components/core/SROnly";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Entry, QueryKeys } from "types";

type Props = Pick<ModalProps, "isOpen"> & {
  onClose: (shouldRefetch?: boolean) => void;
  entry: Entry;
};

export default function MoveJournalEntryModal({ entry, ...props }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [journalToMoveTo, setJournalToMoveTo] = useState<string | null>(null);
  const { data: journalOptions = [], isLoading } = useQuery(
    QueryKeys.JOURNAL_LIST,
    getJournals
  );

  useEffect(() => {
    return () => setJournalToMoveTo(null);
  }, []);

  async function moveEntry() {
    if (!journalToMoveTo) return;

    setIsSaving(true);

    await updateEntry(entry.journalId, entry._id, {
      journalId: journalToMoveTo,
    });

    setIsSaving(false);

    props.onClose(true);
  }

  return (
    <Modal
      ariaLabel="Move a journal entry"
      title="Move journal entry"
      {...props}
    >
      <Modal.Scroll>
        <Modal.Body>
          <Label className="mb-4">
            To which journal would you like to move this entry?
          </Label>
          {isLoading ? (
            <ContentLoader label="Fetching journal options..." />
          ) : (
            <div className="space-y-2">
              {journalOptions.map((journal) => (
                <Checkbox
                  key={journal._id}
                  checked={journal._id === journalToMoveTo}
                  onChange={() => setJournalToMoveTo(journal._id)}
                  label={journal.name}
                />
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal.Scroll>
      <Modal.Footer>
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => props.onClose()} theme="link-muted">
            Cancel
          </Button>
          <Button
            onClick={() => moveEntry()}
            disabled={!journalToMoveTo || isSaving}
          >
            {isSaving ? (
              <>
                <Loader />
                <SROnly>Submitting...</SROnly>
              </>
            ) : (
              <>Move entry</>
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
