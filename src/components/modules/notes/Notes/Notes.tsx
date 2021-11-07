import { createNote, getNotes } from "api/notes";
import Button from "components/core/Button";
import Icon from "components/core/Icon";
import Layout from "components/core/Layout";
import PageTitle from "components/core/PageTitle";
import SROnly from "components/core/SROnly";
import Tip from "components/core/Tip";
import { NoteSettingsProvider } from "contexts/noteSettings";
import useQueryWithUpdater from "hooks/useQueryWithUpdater";
import { useState } from "react";
import { Note as NoteType, QueryKeys } from "types";

import EditNoteModal from "../EditNoteModal";
import MasonryGrid from "../MasonryGrid";
import Note from "../Note";
import NoteSettingsModal from "../NoteSettingsModal";

export default function Notes() {
  const {
    data: notes = [],
    setData: updateNotes,
    isLoading,
    hasLoadedData,
  } = useQueryWithUpdater<NoteType[]>(QueryKeys.NOTES_LIST, () => getNotes());
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteType | null>(null);

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
              >
                <Icon size="fa-2x" variant="fa-gear" />
                <SROnly>Edit journal</SROnly>
              </Button>
            </div>
          </div>
          {(() => {
            if (isLoading) {
              return (
                <div className="text-center space-y-4 text-primary-600">
                  <Icon size="fa-3x" variant="fa-circle-o-notch" spin />
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
