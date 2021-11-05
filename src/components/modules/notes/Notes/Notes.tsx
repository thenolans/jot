import Button from "components/core/Button";
import Icon from "components/core/Icon";
import Layout from "components/core/Layout";
import PageTitle from "components/core/PageTitle";
import Tip from "components/core/Tip";
import Urls from "constants/urls";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Note as NoteType } from "types";
import { useImmer } from "use-immer";
import http from "utils/http";

import EditNoteModal from "../EditNoteModal";
import MasonryGrid from "../MasonryGrid";
import Note from "../Note";

function fetchNotes(): Promise<NoteType[]> {
  return http.get(Urls.api["notes:list"]).then((res) => res.data.data);
}

function createEmptyNote(): Promise<NoteType> {
  return http.post(Urls.api["notes:list"]).then((res) => res.data.data);
}

export default function Notes() {
  const { data = [], isLoading } = useQuery("notes-list", fetchNotes);
  const [notes, updateNotes] = useImmer<NoteType[]>([]);
  const [noteToEdit, setNoteToEdit] = useState<NoteType | null>(null);

  useEffect(() => {
    if (!!data.length) {
      updateNotes(data);
    }
  }, [data, updateNotes]);

  async function addNote() {
    const newNote = await createEmptyNote();
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
          } else if (!notes.length) {
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
                      content={note.content}
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
            updateNotes((existingNotes) => {
              const updatedIndex = existingNotes.findIndex(
                (n) => n._id === note._id
              );
              existingNotes[updatedIndex] = note;
            });
          }}
          onDelete={(noteId) => {
            updateNotes((prevNotes) => {
              const deletedIndex = prevNotes.findIndex(
                (note) => note._id === noteId
              );
              prevNotes.splice(deletedIndex, 1);
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
