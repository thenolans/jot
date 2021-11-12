import { createNote, getNotes } from "api/notes";
import Button from "components/core/Button";
import Icon, { Gear } from "components/core/Icon";
import Input from "components/core/Input";
import Layout from "components/core/Layout";
import Loader from "components/core/Loader";
import PageTitle from "components/core/PageTitle";
import Tip from "components/core/Tip";
import { NoteSettingsProvider } from "contexts/noteSettings";
import useDebounce from "hooks/useDebounce";
import useQueryWithUpdater from "hooks/useQueryWithUpdater";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { Note as NoteType, QueryKeys } from "types";

import EditNoteModal from "../EditNoteModal";
import MasonryGrid from "../MasonryGrid";
import Note from "../Note";
import NoteSettingsModal from "../NoteSettingsModal";

export default function Notes() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const {
    data: notes = [],
    setData: updateNotes,
    isLoading,
    hasLoadedData,
  } = useQueryWithUpdater<NoteType[]>(
    [QueryKeys.NOTES_LIST, debouncedQuery],
    () => getNotes(query)
  );
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteType | null>(null);

  useEffect(() => {
    queryClient.invalidateQueries([QueryKeys.NOTES_LIST]);
  }, [debouncedQuery, queryClient]);

  async function addNote() {
    const newNote = await createNote();
    updateNotes([newNote, ...notes]);
    setNoteToEdit(newNote);
  }

  return (
    <NoteSettingsProvider>
      <Layout>
        <div className="space-y-8 lg:space-y-16">
          <div className="flex justify-between items-center">
            <PageTitle>Notes</PageTitle>
            <div className="flex items-center">
              <Button onClick={() => addNote()}>Create note</Button>
              <Button
                onClick={() => setIsEditingSettings(true)}
                className="ml-4"
                theme="link--primary"
                aria-label="Edit settings"
              >
                <Icon size={32} icon={Gear} />
              </Button>
            </div>
          </div>
          <Input
            placeholder="Search notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {(() => {
            if (isLoading) {
              return (
                <div className="text-center space-y-4 text-primary-600">
                  <Loader size={48} />
                  <div>Fetching notes...</div>
                </div>
              );
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
                        note={note}
                        onClick={() => setNoteToEdit(note)}
                        key={note._id}
                      />
                    );
                  })}
                </MasonryGrid>
              );
            }
          })()}
        </div>

        {/* Modals */}
        <NoteSettingsModal
          isOpen={isEditingSettings}
          onClose={() => setIsEditingSettings(false)}
        />
        {noteToEdit && (
          <EditNoteModal
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
    </NoteSettingsProvider>
  );
}
