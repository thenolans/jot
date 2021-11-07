import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

type NoteSettingsContextType = {
  scramblePrivateNotes: boolean;
  setScramblePrivateNotes: Dispatch<SetStateAction<boolean>>;
};

const NoteSettingsContext = createContext<NoteSettingsContextType>({
  scramblePrivateNotes: true,
  setScramblePrivateNotes() {},
});

export function NoteSettingsProvider({ children }: { children: ReactNode }) {
  const [scramblePrivateNotes, setScramblePrivateNotes] = useState(true);

  return (
    <NoteSettingsContext.Provider
      value={{ scramblePrivateNotes, setScramblePrivateNotes }}
    >
      {children}
    </NoteSettingsContext.Provider>
  );
}

export default NoteSettingsContext;
