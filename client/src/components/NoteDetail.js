import React from 'react';

const NoteDetailModal = ({ note, onClose }) => {
  if (!note) return null;

  const lastViewedDate = note.lastViewed instanceof Date
    ? note.lastViewed
    : new Date(note.lastViewed);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Note Details</h2>
        <p><strong>Title:</strong> {note.title}</p>
        <p><strong>Last Viewed:</strong> {lastViewedDate.toLocaleString()}</p>
        <p><strong>Author:</strong> {note.author || 'Unknown'}</p>
        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailModal;
