import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEllipsisV, faTrashRestore, faTrash } from '@fortawesome/free-solid-svg-icons';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { getUserNotes, deleteNote } from '../lib/dynamoDB';
import Swal from 'sweetalert2';

const Trash = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastViewed');
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trashNotes, setTrashNotes] = useState([]);
  const [displayName, setDisplayName] = useState('User');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.displayName || "User");
        const fetchTrash = async () => {
          try {
            const notes = await getUserNotes(user.uid);
            const trashed = notes.filter(note => note.deleted).map(note => ({
              id: note.noteId,
              userId: note.userId || user.uid,
              title: note.title,
              lastViewed: new Date(note.lastViewed),
              image: note.image || 'https://storage.googleapis.com/a1aa/image/be8802ad-74c0-4848-694a-ece413157a5b.jpg',
            }));
            setTrashNotes(trashed);
          } catch (error) {
            console.error("Failed to fetch trash notes:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchTrash();
      }
    });
    return () => unsubscribe();
  }, []);

  const filtered = trashNotes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = filtered.sort((a, b) => {
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    return b.lastViewed - a.lastViewed;
  });

  const handleRestore = (id) => {
    alert(`Pulihkan catatan dengan ID: ${id}`);
    // Implementasi logika pemulihan catatan
  };

  const handleDelete = async (id) => {
    const note = trashNotes.find(n => n.id === id);
    if (!note) {
      Swal.fire('Error', 'Note not found.', 'error');
      return;
    }

    Swal.fire({
      title: 'Yakin ingin menghapus permanen catatan ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor:"#6b7280",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          const userId = String(note.userId);
          const noteId = String(id);
          await deleteNote(userId, noteId);
          setTrashNotes(prev => prev.filter(n => n.id !== id));
          Swal.fire('Terhapus!', 'Catatan berhasil dihapus permanen.', 'success');
        } catch (error) {
          console.error('Permanent delete error:', error);
          Swal.fire('Gagal!', 'Gagal menghapus catatan secara permanen.', 'error');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <section className="flex-1 flex flex-col gap-4 mt-8 md:mt-0 px-4 md:px-8 min-h-screen">
      {/* Search Bar */}
      <div className="flex justify-end">
        <div className="flex items-center bg-white rounded-md px-4 py-2 w-full md:w-64">
          <input
            type="text"
            placeholder="Search Trash Notes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="outline-none flex-grow text-black placeholder-gray-400"
          />
          <FontAwesomeIcon icon={faSearch} className="text-gray-600 ml-0" />
        </div>
      </div>

      {/* Title + Sort */}
      <div className="mt-4 flex justify-between items-center mb-4">
        <h1 className="text-white font-extrabold text-3xl md:text-4xl select-none">Trash</h1>
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

      {/* Notes List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {sorted.map(note => (
          <div key={note.id} className="relative group flex flex-col space-y-2 select-none cursor-default">
            <img
              alt={note.title}
              className="rounded-lg aspect-square object-cover cursor-pointer"
              src={note.image}
              onClick={() => navigate(`/notespage?noteId=${note.id}`)}
            />
            <span
              className="text-white font-medium text-sm md:text-base cursor-pointer"
              onClick={() => navigate(`/notespage?noteId=${note.id}`)}
            >
              {note.title}
            </span>
            <span className="text-white text-xs md:text-sm font-light">
              Dihapus {Math.floor((Date.now() - note.lastViewed) / 3600000)} jam lalu
            </span>

            {/* Titik tiga */}
            <div
              className="absolute top-2 right-2 bg-white rounded-full p-2 cursor-pointer group-hover:opacity-100 opacity-0 transition"
              onClick={() => setMenuOpenId(menuOpenId === note.id ? null : note.id)}
            >
              <FontAwesomeIcon icon={faEllipsisV} className="text-gray-800 w-4 h-4" />
            </div>

            {/* Menu */}
            {menuOpenId === note.id && (
              <div className="absolute top-10 right-2 bg-white rounded-md shadow-lg z-10 w-40">
                <button
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleRestore(note.id)}
                >
                  <FontAwesomeIcon icon={faTrashRestore} className="w-4 h-4" />
                  Pulihkan
                </button>
                <button
                  className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  onClick={() => handleDelete(note.id)}
                >
                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                  Hapus Permanen
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Trash;
