import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<NotesList />} />
          <Route path="/note/:id?" element={<NoteEditor />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;