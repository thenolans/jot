import { createNote, getNotes } from "api/notes";
import Button from "components/core/Button";
import ContentLoader from "components/core/ContentLoader";
import Icon, { Eye, EyeOff, Plus } from "components/core/Icon";
import { SearchInput } from "components/core/Input";
import Layout from "components/core/Layout";
import PageTitle from "components/core/PageTitle";
import Tip from "components/core/Tip";
import Tooltip from "components/core/Tooltip";
import useDebounce from "hooks/useDebounce";
import useQueryWithUpdater from "hooks/useQueryWithUpdater";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { Note as NoteType, QueryKeys } from "types";
import getMarkdownSelection from "utils/getMarkdownSelection";

import EditNoteModal from "../EditNoteModal";
import MasonryGrid from "../MasonryGrid";
import Note from "../Note";

export default function Notes() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [shouldScramblePrivateNotes, setShouldScramblePrivateNotes] =
    useState(true);
  const {
    data: notes = [],
    setData: updateNotes,
    isLoading,
    hasLoadedData,
  } = useQueryWithUpdater<NoteType[]>(
    [QueryKeys.NOTES_LIST, debouncedQuery],
    () => getNotes(query)
  );
  const [noteToEdit, setNoteToEdit] = useState<NoteType | null>(null);
  const [selection, setSelection] = useState<number | null>(null);
  const tooltipText = shouldScramblePrivateNotes
    ? "Unscramble private notes"
    : "Scramble private notes";

  useEffect(() => {
    queryClient.invalidateQueries([QueryKeys.NOTES_LIST]);
  }, [debouncedQuery, queryClient]);

  async function addNote() {
    const newNote = await createNote();
    updateNotes([newNote, ...notes]);
    setNoteToEdit(newNote);
  }

  return (
    <Layout>
      <div className="space-y-8 lg:space-y-16">
        <div className="flex flex-wrap justify-between items-center">
          <PageTitle>Notes</PageTitle>
          <Tooltip className="ml-auto md:mr-4" title={tooltipText}>
            <Button
              theme="link-primary"
              onClick={() =>
                setShouldScramblePrivateNotes(!shouldScramblePrivateNotes)
              }
              aria-label={tooltipText}
            >
              <Icon icon={shouldScramblePrivateNotes ? Eye : EyeOff} />
            </Button>
          </Tooltip>
          <div className="w-full mt-4 md:w-auto md:mt-0">
            <SearchInput
              placeholder="Search notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        {(() => {
          if (isLoading) {
            return <ContentLoader label="Fetching notes.." />;
          } else if (!notes.length && hasLoadedData) {
            return (
              <Tip
                title="You have not created any notes, yet!"
                description="Use markdown to create notes with bulleted lists, links, and more!"
              />
            );
          } else {
            return (
              <MasonryGrid>
                {notes.map((note) => {
                  return (
                    <Note
                      scrambleContent={shouldScramblePrivateNotes}
                      note={note}
                      // @ts-expect-error
                      onClick={(e) => {
                        setNoteToEdit(note);
                        setSelection(getMarkdownSelection(e.target));
                      }}
                      key={note._id}
                    />
                  );
                })}
              </MasonryGrid>
            );
          }
        })()}
      </div>

      <Button
        className="u-floating-button"
        theme="rounded"
        aria-label="Create note"
        onClick={() => addNote()}
      >
        <Icon size={32} icon={Plus} />
      </Button>

      {noteToEdit && (
        <EditNoteModal
          selection={selection}
          onUpdate={(note) => {
            updateNotes((draft) => {
              if (!draft) return;

              const updatedIndex = draft.findIndex((n) => n._id === note._id);
              draft[updatedIndex] = note;
            });
          }}
          onDelete={(noteId) => {
            updateNotes((draft) => {
              if (!draft) return;

              const deletedIndex = draft.findIndex(
                (note) => note._id === noteId
              );
              draft.splice(deletedIndex, 1);
            });
          }}
          note={noteToEdit}
          isOpen={Boolean(noteToEdit)}
          onClose={() => setNoteToEdit(null)}
        />
      )}
    </Layout>
  );
}
