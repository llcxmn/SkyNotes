import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import NoteMenu from './NoteMenu';
import NoteDetail from './NoteDetail';
import NoteShare from './NoteShare';
import {auth} from '../firebase'; 
import { getUserNotes, createNote } from '../lib/dynamoDB';

const Recently = ({ searchTerm, sortBy }) => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [notesData, setNotesData] = useState([]);
  const [trashData, setTrashData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hanya modal yang dibuka dari titik tiga
  const [selectedNote, setSelectedNote] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Fetch notes from DB
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.displayName || "User");

        const fetchNotes = async () => {
          try {
            const notes = await getUserNotes(user.uid);
            const now = Date.now();
            const filtered = notes
              .filter(note => !note.deleted)
              .map(note => ({
                id: note.noteId,
                title: note.title,
                lastViewed: new Date(note.lastViewed),
                image: note.image || 'https://storage.googleapis.com/a1aa/image/be8802ad-74c0-4848-694a-ece413157a5b.jpg',
                author: user.displayName || "User"
              }))
              .filter(note => (now - note.lastViewed.getTime()) < 10 * 3600000);
            setNotesData(filtered);
          } catch (error) {
            console.error("Failed to fetch notes:", error);
          } finally {
            setLoading(false);
          }
        };

        fetchNotes();
      }
    });

    return () => unsubscribe();
  }, []);

  const updateNote = async (noteId, updates) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    const updatedNote = notesData.find(n => n.id === noteId);
    if (!updatedNote) return;
    const newNote = { ...updatedNote, ...updates, userId, noteId };
    await createNote(newNote);
  };

  // Filter dan sort notes
  const filteredNotes = notesData.filter(note =>
    (note?.title || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const sortedNotes = filteredNotes.sort((a, b) => {
    if (sortBy === 'name') {
      return a.title.localeCompare(b.title);
    } else {
      return b.lastViewed - a.lastViewed;
    }
  });

  const handleDelete = async (noteId) => {
    try {
      setLoading(true);
      await updateNote(noteId, { deleted: true });
      setNotesData(prevNotes => prevNotes.filter(note => note.id !== noteId));
      setTrashData([]); // Trash is now managed by DB
      if (selectedNote?.id === noteId) {
        setShowDetail(false);
        setSelectedNote(null);
      }
    } catch (error) {
      alert("Failed to move note to trash.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {/* Add Notes */}
      <div
        onClick={() => navigate('/notespage')}
        className="flex flex-col space-y-2 cursor-pointer select-none"
      >
        <div className="bg-white rounded-lg aspect-square flex items-center justify-center">
          <FontAwesomeIcon icon={faPlus} className="h-16 w-16 md:h-20 md:w-20 text-blue-700" />
        </div>
        <span className="text-white font-medium text-sm md:text-base">Add Notes</span>
      </div>

      {sortedNotes.map((note) => (
        <div
          key={note.id}
          className="relative flex flex-col space-y-2 cursor-pointer select-none"
        >
          {/* Klik gambar / judul navigasi ke NotesPage dengan membawa id */}
          <div
            className="relative"
            onClick={() => navigate(`/notespage?noteId=${note.id}`, { state: { noteId: note.id } })}
          >
            <img
              alt={note.title}
              className="rounded-lg aspect-square object-cover"
              src={note.image}
            />
            <span className="text-white font-medium text-sm md:text-base">{note.title}</span>
            <span className="text-white text-xs md:text-sm font-light select-text">
              {displayName} - {Math.floor((Date.now() - note.lastViewed) / 3600000)} jam
            </span>
          </div>

          {/* Titik tiga untuk buka menu (modal detail/share) */}
          <div className="absolute top-1 right-1" onClick={e => e.stopPropagation()}>
            <NoteMenu
              onDelete={() => handleDelete(note.id)}
              onDetail={() => { setSelectedNote(note); setShowDetail(true); }}
              onShare={() => setShowShare(true)}
            />
          </div>
        </div>
      ))}

      {/* Modal hanya untuk titik tiga */}
      {showDetail && <NoteDetail note={selectedNote} onClose={() => setShowDetail(false)} />}
      {showShare && <NoteShare onClose={() => setShowShare(false)} />}
    </div>
  );
};

Recently.defaultProps = {
  searchTerm: '',
  sortBy: 'lastViewed',
};

export default Recently;
