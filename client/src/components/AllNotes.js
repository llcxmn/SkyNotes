import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

const AllNotes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortBy, setSortBy] = React.useState('lastViewed');

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
          onClick={() => navigate('/notes')}
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
    </section>
  );
};

export default AllNotes;
