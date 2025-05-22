import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Recently = ({ searchTerm, sortBy }) => {
  const navigate = useNavigate();

  const notesData = [
    {
      id: 1,
      title: 'Meeting notes',
      lastViewed: new Date(2025, 4, 20, 10, 0),
      image: 'https://storage.googleapis.com/a1aa/image/be8802ad-74c0-4848-694a-ece413157a5b.jpg',
    },
    {
      id: 2,
      title: 'Project Plan',
      lastViewed: new Date(2025, 4, 19, 15, 30),
      image: 'https://storage.googleapis.com/a1aa/image/be8802ad-74c0-4848-694a-ece413157a5b.jpg',
    },
    {
      id: 3,
      title: 'UI Sketches',
      lastViewed: new Date(2025, 4, 18, 9, 15),
      image: 'https://storage.googleapis.com/a1aa/image/be8802ad-74c0-4848-694a-ece413157a5b.jpg',
    },
    {
      id: 4,
      title: 'Ideas',
      lastViewed: new Date(2025, 4, 17, 14, 45),
      image: 'https://storage.googleapis.com/a1aa/image/be8802ad-74c0-4848-694a-ece413157a5b.jpg',
    },
    {
      id: 5,
      title: 'Daily Journal',
      lastViewed: new Date(2025, 4, 16, 11, 5),
      image: 'https://storage.googleapis.com/a1aa/image/be8802ad-74c0-4848-694a-ece413157a5b.jpg',
    },
  ];

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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {/* Add Notes Box */}
      <div
        onClick={() => navigate('/notes')}
        className="flex flex-col space-y-2 cursor-pointer select-none"
      >
        <div className="bg-white rounded-lg aspect-square flex items-center justify-center">
          <FontAwesomeIcon icon={faPlus} className="h-16 w-16 md:h-20 md:w-20 text-blue-700" />
        </div>
        <span className="text-white font-medium text-sm md:text-base">Add Notes</span>
      </div>

      {/* Other Notes */}
      {sortedNotes.map((note) => (
        <div
          key={note.id}
          onClick={() => navigate('/notes')}
          className="flex flex-col space-y-2 cursor-pointer select-none"
        >
          <img
            alt={note.title}
            className="rounded-lg aspect-square object-cover"
            src={note.image}
          />
          <span className="text-white font-medium text-sm md:text-base">{note.title}</span>
          <span className="text-white text-xs md:text-sm font-light select-text">
            Iwan Manjul - {Math.floor((Date.now() - note.lastViewed) / 3600000)} jam
          </span>
        </div>
      ))}
    </div>
  );
};

// Default props jika belum dikirim dari Dashboard
Recently.defaultProps = {
  searchTerm: '',
  sortBy: 'lastViewed',
};

export default Recently;
