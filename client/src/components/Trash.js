import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Trash = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortBy, setSortBy] = React.useState('lastViewed');

  // Simulasi notes yang dihapus
  const trashNotes = [
    {
      id: 1,
      title: 'Deleted Note A',
      lastViewed: new Date(2025, 4, 20, 10, 0),
      image: 'https://storage.googleapis.com/a1aa/image/be8802ad-74c0-4848-694a-ece413157a5b.jpg',
    },
    {
      id: 2,
      title: 'Old Draft',
      lastViewed: new Date(2025, 4, 18, 14, 30),
      image: 'https://storage.googleapis.com/a1aa/image/be8802ad-74c0-4848-694a-ece413157a5b.jpg',
    },
  ];

  const filtered = trashNotes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = filtered.sort((a, b) => {
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
          <div key={note.id} className="flex flex-col space-y-2 select-none cursor-default">
            <img
              alt={note.title}
              className="rounded-lg aspect-square object-cover"
              src={note.image}
            />
            <span className="text-white font-medium text-sm md:text-base">{note.title}</span>
            <span className="text-white text-xs md:text-sm font-light">
              Dihapus {Math.floor((Date.now() - note.lastViewed) / 3600000)} jam lalu
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Trash;
