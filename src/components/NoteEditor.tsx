import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { geminiService } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { StudyNote } from '../types';

export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [note, setNote] = useState<StudyNote>({
    id: '',
    title: '',
    content: '',
    subject: '',
    bookmarked: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  useEffect(() => {
    if (id) {
      loadNote(id);
    }
  }, [id]);

  async function loadNote(noteId: string) {
    const loadedNote = await db.notes.get(noteId);
    if (loadedNote) {
      setNote(loadedNote);
    }
  }

  async function handleSave() {
    const updatedNote = {
      ...note,
      updatedAt: new Date(),
      id: note.id || Date.now().toString()
    };
    
    await db.notes.put(updatedNote);
    navigate('/');
  }

  async function handleGenerate() {
    if (!note.title) {
      alert('Please enter a title first');
      return;
    }

    setIsGenerating(true);
    try {
      const content = await geminiService.generateStudyMaterial(note.title);
      setNote(prev => ({ ...prev, content }));
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {id ? 'Edit Note' : 'New Note'}
        </h1>
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Save
        </button>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={note.title}
          onChange={e => setNote(prev => ({ ...prev, title: e.target.value }))}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Subject"
          value={note.subject}
          onChange={e => setNote(prev => ({ ...prev, subject: e.target.value }))}
          className="w-full p-2 border rounded"
        />

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isGenerating ? 'Generating...' : 'Generate with Gemini'}
        </button>

        <div className="border rounded p-4">
          <div className="mb-2">
            <label className="font-medium">Content</label>
          </div>
          <textarea
            value={note.content}
            onChange={e => setNote(prev => ({ ...prev, content: e.target.value }))}
            className="w-full h-64 p-2 border rounded"
            placeholder="Enter your study content here..."
          />
        </div>

        {note.content && (
          <div className="border rounded p-4">
            <div className="mb-2">
              <label className="font-medium">Preview</label>
            </div>
            <div className="prose max-w-none">
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}