import React, { useState } from 'react';

const NoteShare = ({ onClose }) => {
  const [emails, setEmails] = useState('');
  const [shareLink] = useState('https://example.com/shared-file'); // Placeholder link
  const [anyoneAccess, setAnyoneAccess] = useState('can edit');
  const [isAnyoneDropdownOpen, setIsAnyoneDropdownOpen] = useState(false);
  const [collaborators, setCollaborators] = useState(['John Doe', 'Jane Smith', 'Michael Johnson']);
  const [isCollaboratorDropdownOpen, setIsCollaboratorDropdownOpen] = useState(false);

  const handleInvite = () => {
    const emailList = emails.split(',').map(e => e.trim()).filter(e => e !== '');
    if (emailList.length === 0) {
      alert('Please enter at least one email');
      return;
    }
    console.log('Inviting:', emailList);
    alert(`Invitations sent to: ${emailList.join(', ')}`);
    setEmails('');
    onClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black font-bold text-xl"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">Share this file</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Emails, comma separated"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleInvite}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Invite
          </button>
        </div>
        <div className="flex items-center mb-4">
          <button onClick={handleCopyLink} className="text-blue-600 font-semibold">Copy Link</button>
        </div>
        <div>
          <p className="font-semibold mb-1">Who has access</p>
          
          <div className="mb-2 border border-gray-200 rounded-md">
            <button
              onClick={() => setIsAnyoneDropdownOpen(!isAnyoneDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2"
            >
              <span>Anyone <span className="text-gray-600 italic">{anyoneAccess}</span></span>
              <span className="text-gray-700">{isAnyoneDropdownOpen ? '▲' : '▼'}</span>
            </button>
            {isAnyoneDropdownOpen && (
              <div className="border-t border-gray-200">
                <button
                  onClick={() => { setAnyoneAccess('can edit'); setIsAnyoneDropdownOpen(false); }}
                  className="w-full text-left px-3 py-1 hover:bg-gray-100"
                >
                  can edit
                </button>
                <button
                  onClick={() => { setAnyoneAccess('view only'); setIsAnyoneDropdownOpen(false); }}
                  className="w-full text-left px-3 py-1 hover:bg-gray-100"
                >
                  view only
                </button>
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-md mb-2">
            <button
              onClick={() => setIsCollaboratorDropdownOpen(!isCollaboratorDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2"
            >
              <span>Collaborator <span className="text-gray-600 italic">{collaborators.length} person</span></span>
              <span className="text-gray-700">{isCollaboratorDropdownOpen ? '▲' : '▼'}</span>
            </button>
            {isCollaboratorDropdownOpen && (
              <ul className="border-t border-gray-200">
                {collaborators.map((collaborator, index) => (
                  <li key={index} className="px-3 py-1">{collaborator}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteShare;
