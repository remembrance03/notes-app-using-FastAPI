import React, { useState, useEffect } from 'react';
import { Plus, X, Edit2, Trash2, Save, Search, BookOpen } from 'lucide-react';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [apiUrl, setApiUrl] = useState('http://127.0.0.1:8000');
  const [isConnected, setIsConnected] = useState(false);

  // Simulated data for preview
  useEffect(() => {
    const demoNotes = [
      { id: 1, title: "welcome to Tea's notes app", content: "hey there! i’m a notebook and i'm ready to hold all your brilliant ideas and secrets." },
      { id: 2, title: 'getting started', content: 'tap “New Note” to create your first masterpiece.\nedit it, decorate it, or just jot down your wildest idea.' },
      { id: 3, title: 'features', content: '✨ create, edit, & delete notes\n🔍 search through your notes' }
    ];
    setNotes(demoNotes);
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${apiUrl}/notes`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setIsConnected(false);
    }
  };

  const createNote = async () => {
    if (!newNote.title.trim()) return;
    
    try {
      const response = await fetch(`${apiUrl}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote)
      });
      
      if (response.ok) {
        await fetchNotes();
        setNewNote({ title: '', content: '' });
        setIsCreating(false);
      }
    } catch (error) {
      const demoNote = { ...newNote, id: Date.now() };
      setNotes([...notes, demoNote]);
      setNewNote({ title: '', content: '' });
      setIsCreating(false);
    }
  };

  const updateNote = async (id, updatedNote) => {
    try {
      const response = await fetch(`${apiUrl}/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote)
      });
      
      if (response.ok) {
        await fetchNotes();
        setEditingId(null);
      }
    } catch (error) {
      setNotes(notes.map(n => n.id === id ? { ...n, ...updatedNote } : n));
      setEditingId(null);
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/notes/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchNotes();
      }
    } catch (error) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-amber-50" style={{
      backgroundImage: `
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 31px,
          rgba(139, 92, 46, 0.1) 31px,
          rgba(139, 92, 46, 0.1) 32px
        )
      `
    }}>
      {/* Notebook Header */}
      <div className="bg-gradient-to-b from-amber-800 to-amber-900 text-amber-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-10 h-10" />
              <div>
                <h1 className="text-4xl font-bold" style={{ fontFamily: 'Brush Script MT, cursive' }}>
                  Tea's Notes
                </h1>
                <p className="text-amber-200 mt-1" style={{ fontFamily: 'Brush Script MT, cursive' }}>Personal Notes & Ideas</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-amber-400'} animate-pulse`} />
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                New Note
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-700 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-amber-50 text-amber-900 placeholder-amber-600 rounded-lg border-2 border-amber-700 focus:outline-none focus:border-amber-600 transition-all"
              style={{ fontFamily: 'Brush Script MT, cursive', fontSize: '18px' }}
            />
          </div>
        </div>
      </div>

      {/* Main Content - Notebook Pages */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Create Note Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-amber-50 rounded-lg shadow-2xl max-w-2xl w-full p-8 border-4 border-amber-800 relative"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 31px,
                    rgba(139, 92, 46, 0.15) 31px,
                    rgba(139, 92, 46, 0.15) 32px
                  )
                `
              }}>
              {/* Red margin line */}
              <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-red-400 opacity-50" />
              
              <div className="flex justify-between items-center mb-6 relative">
                <div className="flex-1" />
                <h2 className="text-3xl font-bold text-amber-900 text-center flex-1" style={{ fontFamily: 'Brush Script MT, cursive' }}>
                  New Note
                </h2>
                <div className="flex-1 flex justify-end">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="text-amber-700 hover:text-amber-900 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="relative pl-8">
                <input
                  type="text"
                  placeholder="Note title..."
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="w-full px-4 py-3 text-xl font-semibold bg-transparent border-b-2 border-amber-300 focus:border-amber-600 outline-none mb-6 text-amber-900"
                  style={{ fontFamily: 'Brush Script MT, cursive' }}
                />
                
                <textarea
                  placeholder="Start writing..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-3 bg-transparent text-amber-900 outline-none resize-none leading-8"
                  style={{ 
                    fontFamily: 'Brush Script MT, cursive',
                    lineHeight: '32px',
                    fontSize: '18px'
                  }}
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6 relative">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-6 py-2 text-amber-700 hover:bg-amber-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createNote}
                  className="px-6 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes Grid - Paper Pages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isEditing={editingId === note.id}
              onEdit={() => setEditingId(note.id)}
              onSave={(updatedNote) => updateNote(note.id, updatedNote)}
              onDelete={() => deleteNote(note.id)}
              onCancel={() => setEditingId(null)}
            />
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-20 bg-amber-50 rounded-lg border-4 border-dashed border-amber-300">
            <div className="text-6xl mb-4">📓</div>
            <h3 className="text-2xl font-semibold text-amber-900 mb-2" style={{ fontFamily: 'Brush Script MT, cursive' }}>
              No notes found
            </h3>
            <p className="text-amber-700" style={{ fontFamily: 'Brush Script MT, cursive' }}>
              {searchTerm ? 'Try a different search term' : 'Start writing your first note'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const NoteCard = ({ note, isEditing, onEdit, onSave, onDelete, onCancel }) => {
  const [editedNote, setEditedNote] = useState({ title: note.title, content: note.content });

  useEffect(() => {
    setEditedNote({ title: note.title, content: note.content });
  }, [note]);

  if (isEditing) {
    return (
      <div className="bg-amber-50 rounded-lg shadow-xl p-6 border-4 border-amber-700 relative transform hover:scale-105 transition-all"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 31px,
              rgba(139, 92, 46, 0.15) 31px,
              rgba(139, 92, 46, 0.15) 32px
            )
          `
        }}>
        {/* Red margin line */}
        <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-red-400 opacity-50" />
        
        <div className="relative pl-6">
          <input
            type="text"
            value={editedNote.title}
            onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
            className="w-full px-3 py-2 text-xl font-semibold bg-transparent border-b-2 border-amber-400 focus:border-amber-600 outline-none mb-4 text-amber-900"
            style={{ fontFamily: 'Brush Script MT, cursive', fontSize: '22px' }}
          />
          <textarea
            value={editedNote.content}
            onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
            rows={8}
            className="w-full px-3 py-2 text-amber-900 bg-transparent outline-none resize-none"
            style={{ 
              fontFamily: 'Brush Script MT, cursive',
              lineHeight: '32px',
              fontSize: '18px'
            }}
          />
        </div>
        
        <div className="flex justify-end gap-2 mt-4 relative">
          <button
            onClick={onCancel}
            className="p-2 text-amber-700 hover:bg-amber-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSave(editedNote)}
            className="p-2 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 rounded-lg shadow-xl p-6 border-4 border-amber-700 hover:shadow-2xl transition-all transform hover:-rotate-1 hover:scale-105 group cursor-pointer relative"
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 31px,
            rgba(139, 92, 46, 0.15) 31px,
            rgba(139, 92, 46, 0.15) 32px
          )
        `
      }}>
      {/* Red margin line */}
      <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-red-400 opacity-50" />
      
      <div className="relative pl-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-amber-900 flex-1 line-clamp-2" style={{ fontFamily: 'Brush Script MT, cursive', fontSize: '24px' }}>
            {note.title}
          </h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onEdit}
              className="p-2 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-700 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <p className="text-amber-800 whitespace-pre-wrap line-clamp-6 leading-8" style={{ 
          fontFamily: 'Brush Script MT, cursive',
          lineHeight: '32px',
          fontSize: '18px'
        }}>
          {note.content}
        </p>
        
        <div className="mt-6 pt-4 border-t border-amber-300">
          <span className="text-xs text-amber-600" style={{ fontFamily: 'Brush Script MT, cursive' }}>
            Note #{note.id}
          </span>
        </div>
      </div>

      {/* Paper corner fold effect */}
      <div className="absolute top-0 right-0 w-0 h-0 border-t-[30px] border-t-amber-100 border-l-[30px] border-l-transparent opacity-0 group-hover:opacity-100 transition-opacity" 
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      />
    </div>
  );
};

export default App;