import NavBar from "components/NavBar";
import NoteGrid from "components/NoteGrid";

function App() {
  return (
    <div className="container mx-auto max-w-5xl py-8 space-y-8">
      <NavBar />
      <NoteGrid />
    </div>
  );
}

export default App;
