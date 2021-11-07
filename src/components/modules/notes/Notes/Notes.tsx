import { createNote, getNotes } from "api/notes";
import Button from "components/core/Button";
import Icon from "components/core/Icon";
import Layout from "components/core/Layout";
import PageTitle from "components/core/PageTitle";
import Tip from "components/core/Tip";
import useQueryWithUpdater from "hooks/useQueryWithUpdater";
import { useState } from "react";
import { Note as NoteType, QueryKeys } from "types";
import scramble from "utils/scramble";

import EditNoteModal from "../EditNoteModal";
import MasonryGrid from "../MasonryGrid";
import Note from "../Note";

export default function Notes() {
  const {
    data: notes = [],
    setData: updateNotes,
    isLoading,
    hasLoadedData,
  } = useQueryWithUpdater<NoteType[]>(QueryKeys.NOTES_LIST, () => getNotes());
  const [noteToEdit, setNoteToEdit] = useState<NoteType | null>(null);

  async function addNote() {
    const newNote = await createNote();
    updateNotes([newNote, ...notes]);
    setNoteToEdit(newNote);
  }

  return (
    <Layout>
      <div className="space-y-8 lg:space-y-16">
        <div className="flex justify-between items-center">
          <PageTitle>Notes</PageTitle>
          <Button onClick={() => addNote()}>Create note</Button>
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
                      content={
                        note.scrambleContent
                          ? scramble(note.content)
                          : note.content
                      }
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
  );
}
