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

const Recently = ({ searchTerm, sortBy }) => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
    
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setDisplayName(user.displayName || "User"); // fallback if no name
          }
        });
    
        return () => unsubscribe(); 
      }, []);

  // Simulasi data awal
  const initialNotes = [
    {
      id: 1,
      title: 'Meeting notes ',
      lastViewed: new Date(2025, 4, 20, 10, 0),
      image: 'https://storage.googleapis.com/a1aa/image/be8802ad-74c0-4848-694a-ece413157a5b.jpg',
      author: 'Iwan Manju',
    },
    {
      id: 2,
      title: 'Project Plan ',
      lastViewed: new Date(2025, 4, 19, 8, 30),
      image: 'https://storage.googleapis.com/a1aa/image/be8802ad-74c0-4848-694a-ece413157a5b.jpg',
      author: displayName,
    },
  ];

  const [notesData, setNotesData] = useState(initialNotes);
  const [trashData, setTrashData] = useState([]);

  // Hanya modal yang dibuka dari titik tiga
  const [selectedNote, setSelectedNote] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showShare, setShowShare] = useState(false);

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

  const handleDelete = (noteId) => {
    const noteToDelete = notesData.find(note => note.id === noteId);
    if (!noteToDelete) return;

    setTrashData(prevTrash => [...prevTrash, noteToDelete]);
    setNotesData(prevNotes => prevNotes.filter(note => note.id !== noteId));

    if (selectedNote?.id === noteId) {
      setShowDetail(false);
      setSelectedNote(null);
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
            onClick={() => navigate('/notespage', { state: { noteId: note.id } })}
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
