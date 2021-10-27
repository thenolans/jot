import Button from "components/core/Button";
import Layout from "components/core/Layout";
import PageTitle from "components/core/PageTitle";
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
        <MasonryGrid>
          {notes.map((note) => {
            return (
              <Note onClick={() => setNoteToEdit(note)} key={note._id}>
                {note.content}
              </Note>
            );
          })}
        </MasonryGrid>
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
          note={noteToEdit}
          isOpen={Boolean(noteToEdit)}
          onClose={() => setNoteToEdit(null)}
        />
      )}
    </Layout>
  );
}
