import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const ContentLayout = ({ title, searchTerm, setSearchTerm, sortBy, setSortBy, children }) => {
  return (
    <section className="flex-1 flex flex-col gap-4 mt-8 md:mt-0 px-4 md:px-8 min-h-screen">
      {/* Search Bar */}
      <div className="flex justify-end">
        <div className="flex items-center bg-white rounded-md px-4 py-2 w-full md:w-64">
          <input
            type="text"
            placeholder="Search Notes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="outline-none flex-grow text-black placeholder-gray-400"
          />
          <FontAwesomeIcon icon={faSearch} className="text-gray-600 ml-0" />
        </div>
      </div>

      {/* Header Title + Sorting */}
      <div className="mt-4 flex justify-between items-center mb-4">
        <h1 className="text-white font-extrabold text-3xl md:text-4xl select-none">{title}</h1>

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

      {/* Content from child */}
      {children}
    </section>
  );
};

export default ContentLayout;
