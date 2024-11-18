import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { StudyNote } from '../types';

export default function NotesList() {
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    const allNotes = await db.notes.orderBy('updatedAt').reverse().toArray();
    setNotes(allNotes);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      const filtered = notes.filter(note => 
        note.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
        note.subject.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setNotes(filtered);
    } else {
      loadNotes();
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Study Notes</h1>
        <button
          onClick={() => navigate('/note')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          New Note
        </button>
      </div>

      <input
        type="search"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={handleSearch}
        className="w-full p-2 border rounded mb-4"
      />

      <div className="space-y-4">
        {notes.map(note => (
          <div
            key={note.id}
            onClick={() => navigate(`/note/${note.id}`)}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{note.title}</h2>
                <p className="text-gray-600">{note.subject}</p>
              </div>
              {note.bookmarked && (
                <span className="text-yellow-500">★</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}