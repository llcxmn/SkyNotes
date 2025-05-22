import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentLayout from '../components/ContentLayout'; // pastikan path-nya sesuai
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Collaboration = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastViewed');

  const collabData = [
    {
      id: 1,
      name: 'Collaboration 1',
      owner: 'Iwan Manjul',
      notesCount: 3,
      previews: [
        { color: 'bg-purple-200' },
        { isLines: true },
        { color: 'bg-yellow-300' },
        { isPlus: true },
      ],
    },
    {
      id: 2,
      name: 'Project Alpha',
      owner: 'Iwan Manjul',
      notesCount: 5,
      previews: [
        { color: 'bg-pink-200' },
        { color: 'bg-blue-100' },
        { color: 'bg-green-200' },
        { isPlus: true },
      ],
    },
    {
      id: 3,
      name: 'Marketing Team',
      owner: 'Iwan Manjul',
      notesCount: 2,
      previews: [
        { color: 'bg-red-100' },
        { isLines: true },
        { isPlus: true },
        { color: 'bg-orange-200' },
      ],
    },
  ];

  const filtered = collabData.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return b.notesCount - a.notesCount;
  });

  return (
    <ContentLayout
      title="Collaboration"
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      sortBy={sortBy}
      setSortBy={setSortBy}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {sorted.map((collab) => (
          <div
            key={collab.id}
            onClick={() => navigate('/notes')}
            className="flex flex-col space-y-2 cursor-pointer select-none"
          >
            <div className="bg-white rounded-lg aspect-square grid grid-cols-2 grid-rows-2 gap-1 p-2 shadow-xl">
              {collab.previews.map((p, i) => (
                <div
                  key={i}
                  className={`rounded-md flex items-center justify-center ${p.color || ''
                    } ${p.isLines ? 'bg-[url("https://www.transparenttextures.com/patterns/lined-paper.png")] bg-cover' : ''}`}
                >
                  {p.isPlus && (
                    <FontAwesomeIcon icon={faPlus} className="text-black w-4 h-4" />
                  )}
                </div>
              ))}
            </div>
            <span className="text-white font-medium text-sm md:text-base">{collab.name}</span>
            <span className="text-white text-xs md:text-sm font-light select-text">
              {collab.owner} – {collab.notesCount} notes
            </span>
          </div>
        ))}

        {/* Add Collaboration Box */}
        {/* Add Collaboration Box */}
        <div
          onClick={() => alert('Add new collaboration')}
          className="flex flex-col space-y-2 cursor-pointer select-none"
        >
          <div className="bg-white rounded-lg aspect-square flex items-center justify-center shadow-xl">
            <FontAwesomeIcon icon={faPlus} className="text-blue-700 w-10 h-10" />
          </div>
          <span className="text-white font-medium text-sm md:text-base text-center">Add collaboration</span>
        </div>

      </div>
    </ContentLayout>
  );
};

export default Collaboration;
