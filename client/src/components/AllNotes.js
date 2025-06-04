import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getUserNotes, createNote, getUserScale, logNoteAction } from '../lib/dynamoDB';
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import NoteMenu from './NoteMenu';
import NoteDetail from './NoteDetail';
import NoteShare from './NoteShare';
import Swal from 'sweetalert2';
import { auth } from '../firebase';

const AllNotes = () => {
  const [notesData, setNotesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortBy, setSortBy] = React.useState('lastViewed');

  const [selectedNote, setSelectedNote] = React.useState(null);
  const [showDetail, setShowDetail] = React.useState(false);
  const [showShare, setShowShare] = React.useState(false);

  const [displayName, setDisplayName] = useState("");
  const [notePerDay, setNotePerDay] = useState(null);
  const [todayNotesCount, setTodayNotesCount] = useState(0);

  useEffect(() => {
    const fetchNotesAndScale = async () => {
      if (auth.currentUser) {
        try {
          // Fetch notes
          const notes = await getUserNotes(auth.currentUser.uid);
          const formattedNotes = notes
            .filter(note => !note.deleted)
            .map(note => ({
              id: note.noteId,
              title: note.title,
              lastViewed: new Date(note.lastViewed),
              createdAt: note.createdAt,
              image: note.image || 'https://storage.googleapis.com/a1aa/image/be8802ad-74c0-4848-694a-ece413157a5b.jpg'
            }));
          setNotesData(formattedNotes);

          // Fetch note_per_day and used_this_day from scale table
          const scale = await getUserScale(auth.currentUser.uid);
          setNotePerDay(scale && scale.note_per_day ? Number(scale.note_per_day) : null);
          setTodayNotesCount(scale && scale.used_this_day ? Number(scale.used_this_day) : 0);
        } catch (error) {
          console.error("Failed to fetch notes or scale:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.displayName || "User");
        fetchNotesAndScale();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddNote = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!auth.currentUser) {
      return navigate('/auth', { state: { from: '/allnotes' } });
    }
    // Check note_per_day limit using used_this_day
    if (notePerDay !== null && todayNotesCount >= notePerDay) {
      Swal.fire({
        title: `You have reached your daily limit ${notePerDay} notes/day`,
        customClass: {
          title: 'swal-custom-title-small'
        },
        icon: 'warning',
        width: '450px',
        showCancelButton: true,
        confirmButtonColor: "#2563eb",
        cancelButtonColor: "#6b7280",
        confirmButtonText: 'Upgrade Plan',
        cancelButtonText: 'Nanti Saja',
        reverseButtons: true // upgrade
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/upgrade-plan');
          window.location.href = '/pricing';
        }
      });
      return;
    }
    try {
      setLoading(true);
      const now = new Date();
      const newNote = {
        noteId: `note_${now.getTime()}`,
        userId: auth.currentUser.uid,
        title: "Untitled Note",
        content: "",
        lastViewed: now.toISOString(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        image: 'https://storage.googleapis.com/a1aa/image/be8802ad-74c0-4848-694a-ece413157a5b.jpg'
      };
      await createNote(newNote);
      await logNoteAction({ userId: newNote.userId, noteId: newNote.noteId, action: 'create', noteData: newNote });
      // Increment used_this_day in scale table
      const scale = await getUserScale(auth.currentUser.uid);
      const newUsed = (scale && scale.used_this_day ? Number(scale.used_this_day) : 0) + 1;
      await import('../lib/dynamoDB').then(db => db.upsertUserScale(auth.currentUser.uid, scale.note_per_day, newUsed));
      setNotesData(prev => [{
        ...newNote,
        id: newNote.noteId,
        lastViewed: new Date(newNote.lastViewed)
      }, ...prev]);
      setTodayNotesCount(c => c + 1);
      navigate(`/notespage?noteId=${newNote.noteId}`, {
        state: { newNote: true }
      });
    } catch (error) {
      alert("Failed to create note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateNote = async (noteId, updates) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    // Fetch the full note from DB to ensure all fields are present
    const notes = await getUserNotes(userId);
    const fullNote = notes.find(n => n.noteId === noteId);
    if (!fullNote) return;
    const newNote = { ...fullNote, ...updates, userId, noteId };
    await createNote(newNote);
    await logNoteAction({ userId, noteId, action: 'update', noteData: newNote });
  };

  const handleDelete = async (noteId) => {
    try {
      setLoading(true);
      await updateNote(noteId, { deleted: true });
      await logNoteAction({ userId: auth.currentUser.uid, noteId, action: 'delete' });
      setNotesData(prev => prev.filter(note => note.id !== noteId));
    } catch (error) {
      alert("Failed to move note to trash.");
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notesData.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedNotes = filteredNotes.sort((a, b) => {
    if (sortBy === 'name') {
      return a.title.localeCompare(b.title);
    } else {
      return b.lastViewed - a.lastViewed;
    }
  });

  return (
    <section className="flex-1 flex flex-col gap-4 mt-8 md:mt-0 px-4 md:px-8 min-h-screen">
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      )}
      {!loading && (
        <>
          {/* Search Bar */}
          <div className="flex justify-end">
            <div className="flex items-center bg-white rounded-md px-4 py-2 w-full md:w-64">
              <input
                type="text"
                placeholder="Search All Notes"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="outline-none flex-grow text-black placeholder-gray-400"
              />
              <FontAwesomeIcon icon={faSearch} className="text-gray-600 ml-0" />
            </div>
          </div>

          {/* Title + Sort */}
          <div className="mt-4 flex justify-between items-center mb-4">
            <h1 className="text-white font-extrabold text-3xl md:text-4xl select-none">All Notes</h1>
            <div className="text-white font-semibold text-sm select-none flex items-center space-x-4">
              <span
                onClick={() => setSortBy('name')}
                className={`cursor-pointer ${sortBy === 'name' ? 'text-yellow-400' : 'text-white'}`}
              >
                Name
              </span>
              <span
                onClick={() => setSortBy('lastViewed')}
                className={`cursor-pointer ${sortBy === 'lastViewed' ? 'text-yellow-400' : 'text-white'}`}
              >
                Last viewed
              </span>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">

            {/* Add Notes Box */}
            <div
              onClick={handleAddNote}
              className="flex flex-col space-y-2 cursor-pointer select-none"
            >
              <div className="bg-white rounded-lg aspect-square flex items-center justify-center">
                <FontAwesomeIcon icon={faPlus} className="h-16 w-16 md:h-20 md:w-20 text-blue-700" />
              </div>
              <span className="text-white font-medium text-sm md:text-base">Add Notes</span>
            </div>

            {/* List Notes */}
            {sortedNotes.map((note) => (
              <div
                key={note.id}
                className="relative flex flex-col space-y-2 cursor-pointer select-none"
              >
                <div
                  className="relative"
                  onClick={() => navigate(`/notespage?noteId=${note.id}`)}
                >
                  <img
                    alt={note.title}
                    className="rounded-lg aspect-square object-cover"
                    src={note.image}
                  />
                </div>
                <span className="text-white font-medium text-sm md:text-base">{note.title}</span>
                <span className="text-white text-xs md:text-sm font-light select-text">
                  {displayName} - {Math.floor((Date.now() - note.lastViewed) / 3600000)} jam
                </span>
                <div className="absolute top-1 right-1">
                  <NoteMenu
                    onDelete={() => handleDelete(note.id)}
                    onDetail={() => { setSelectedNote(note); setShowDetail(true); }}
                    onShare={() => setShowShare(true)}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      {showDetail && <NoteDetail note={selectedNote} onClose={() => setShowDetail(false)} />}
      {showShare && <NoteShare onClose={() => setShowShare(false)} />}
    </section>
  );
};

export default AllNotes;
