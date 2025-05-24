import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faShareAlt,
  faCheckSquare,
  faBold,
  faComments,
  faShirt,
  faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';

const currentUser = {
  name: "John Doe",
  status: "Free",
};

const NotesPageCollaboration = ({ readOnly = false, initialNotes }) => {
  const [notes, setNotes] = useState(initialNotes || {});
  const [title, setTitle] = useState("Untitled");
  const [wordCount, setWordCount] = useState(0);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [emails, setEmails] = useState('');
  const [themeColor, setThemeColor] = useState("#fc4e4e");
  const [showNewNote, setShowNewNote] = useState(false);

  // Chat state
  const [isChatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'John Doe', text: 'Hello, how can I help you?' },
    { id: 2, user: 'You', text: 'Hi! Just testing chat.' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Untuk tombol T (Text mode)
  const [textModeActive, setTextModeActive] = useState(false);
  const [textInput, setTextInput] = useState('');

  const editableRefs = useRef({});

  useEffect(() => {
    const allTexts = Object.values(notes).join(' ');
    const count = allTexts.trim() === '' ? 0 : allTexts.trim().split(/\s+/).length;
    setWordCount(count);
  }, [notes]);

  const handleInputChange = (e, key) => {
    if (readOnly) return;
    const text = e.target.innerText || '';
    setNotes(prev => ({ ...prev, [key]: text }));
  };

  // Simulasi save: update state, bisa dikembangkan ke backend
  const handleSave = () => {
    // Save notes (di sini hanya console.log, atau bisa simpan ke server)
    console.log('Saved notes:', notes);
  };

  const handleBold = () => document.execCommand('bold', false, null);
  const handleStrikethrough = () => document.execCommand('strikeThrough', false, null);
  const handleChecklist = () => document.execCommand('insertHTML', false, '<input type="checkbox"/> ');

  const fileInputRef = useRef(null);
  const handleInsertImage = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
      const base64 = event.target.result;
      document.execCommand('insertImage', false, base64);
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const handleShare = () => {
    alert(`Invited: ${emails}`);
    setEmails('');
    setShareModalOpen(false);
  };

  const handleThemeChange = () => {
    const newColor = themeColor === '#fc4e4e' ? '#4eaffc' : '#fc4e4e';
    setThemeColor(newColor);
  };

  const handleAddNote = () => {
    const newKey = 'note' + Date.now();
    setNotes(prev => ({ ...prev, [newKey]: '' }));
    setShowNewNote(true);
  };

  // Toggle mode T
  const toggleTextMode = () => {
    setTextModeActive((prev) => !prev);
    setTextInput('');
  };

  // Simpan teks input dari T ke notes dan tutup kotak input
  const saveTextInput = () => {
    if (textInput.trim() === '') {
      setTextModeActive(false);
      return;
    }
    const newKey = 'note' + Date.now();
    setNotes(prev => ({ ...prev, [newKey]: textInput }));
    setTextInput('');
    setTextModeActive(false);
  };

  // Cancel input teks T
  const cancelTextInput = () => {
    setTextInput('');
    setTextModeActive(false);
  };

  // Chat send handler
  const sendChatMessage = () => {
    if (chatInput.trim() === '') return;
    const newMsg = {
      id: Date.now(),
      user: 'You',
      text: chatInput.trim(),
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  // Handle Enter key in chat input
  const handleChatInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  return (
    <div className="relative min-h-screen font-sans">

      {/* Top Bar */}
      <div className="absolute top-6 left-10 flex items-center bg-white rounded-xl shadow-md border border-gray-200 px-6 py-3 space-x-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={readOnly}
          className="text-sm font-semibold outline-none bg-transparent max-w-xs"
          placeholder="Untitled"
        />
        <span className={`text-xs font-semibold px-3 py-1 rounded-md ${currentUser.status === 'Premium' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
          }`}>
          {currentUser.status}
        </span>
      </div>

      {/* Right Toolbar */}
      <div className="absolute top-6 right-10 flex items-center bg-white rounded-xl shadow-md border border-gray-200 px-4 py-2 space-x-3">
        <span className="text-sm font-semibold max-w-xs truncate">{currentUser.name}</span>
        <button onClick={handleSave} className="p-2 hover:bg-gray-100 rounded-md" title="Save">
          <FontAwesomeIcon icon={faSave} />
        </button>
        <button
          onClick={() => setChatOpen(prev => !prev)}
          className="p-2 hover:bg-gray-100 rounded-md"
          title="Chat"
          aria-expanded={isChatOpen}
          aria-controls="chatbox"
        >
          <FontAwesomeIcon icon={faComments} />
        </button>
        <button onClick={handleThemeChange} className="p-2 hover:bg-gray-100 rounded-md" title="Change Theme">
          <FontAwesomeIcon icon={faShirt} />
        </button>
        <button onClick={() => setShareModalOpen(true)} className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition" title="Share">
          <FontAwesomeIcon icon={faShareAlt} />
        </button>
      </div>

      {/* Note Area - A4 Centered */}
      <div
        className="relative mx-auto mt-40 w-[650px] h-[800px] shadow-lg rounded"
        style={{ backgroundColor: themeColor }}
      >
        {Object.entries(notes).map(([key, val], i) => {
          const positions = [
            { top: '90px', left: '360px', w: '220px' },
            { top: '400px', left: '230px', w: '140px' },
            { top: '600px', left: '400px', w: '250px' },
          ];
          const pos = positions[i] || { top: '100px', left: `${100 + i * 250}px`, w: '220px' };

          return (
            <div
              key={key}
              ref={(el) => (editableRefs.current[key] = el)}
              contentEditable={!readOnly}
              suppressContentEditableWarning
              onInput={(e) => handleInputChange(e, key)}
              spellCheck={false}
              role="textbox"
              aria-multiline="true"
              className="absolute text-black font-bold p-3 border border-black rounded-md bg-red-600 shadow-md min-h-[100px]"
              style={{ top: pos.top, left: pos.left, width: pos.w }}
            >
              {val}
            </div>
          );
        })}

        {!showNewNote && !readOnly && (
          <button
            onClick={handleAddNote}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-yellow-300 text-black font-bold px-6 py-3 rounded-xl shadow-md hover:bg-yellow-400 transition"
          >
            + Add Note (T)
          </button>
        )}
      </div>

      {/* Kotak input teks transparan untuk tombol T */}
      {textModeActive && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
            <textarea
              autoFocus
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full h-32 border border-gray-300 rounded p-2 resize-none outline-none"
              placeholder="Type your note here..."
            />
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={cancelTextInput}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveTextInput}
                className="px-4 py-2 bg-yellow-300 text-black font-bold rounded hover:bg-yellow-400 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Toolbar */}
      {!readOnly && showNewNote && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center bg-white rounded-xl shadow-md border border-gray-200 px-6 py-3 space-x-4 z-50">
          <button
            onClick={toggleTextMode}
            className={`font-bold px-4 py-2 rounded-md transition ${textModeActive ? 'bg-yellow-300 text-black' : 'bg-transparent text-black hover:bg-yellow-100'}`}
            title="Text (T)"
          >
            T
          </button>
          <button onClick={handleBold} className="px-4 py-2 rounded-md hover:bg-gray-100 transition" title="Bold (B)">
            <FontAwesomeIcon icon={faBold} />
          </button>
          <button onClick={handleChecklist} className="px-4 py-2 rounded-md hover:bg-gray-100 transition" title="Checklist">
            <FontAwesomeIcon icon={faCheckSquare} />
          </button>
          <button onClick={handleInsertImage} className="px-4 py-2 rounded-md hover:bg-gray-100 transition" title="Insert Image">
            <FontAwesomeIcon icon={faImage} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{ display: 'none' }}
          />
          <button onClick={handleStrikethrough} className="px-4 py-2 rounded-md hover:bg-gray-100 transition" title="Strikethrough">
            <FontAwesomeIcon icon={faPencilAlt} />
          </button>
        </div>
      )}

      {/* Word Count */}
      <div className="fixed bottom-10 right-10 flex items-center bg-white rounded-xl shadow-md border border-gray-200 z-50">
        <div className="px-4 py-2 text-black text-sm font-semibold">{wordCount}/100</div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-r-xl font-semibold">Word</button>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Share Notes</h2>
            <input
              type="text"
              placeholder="Enter emails separated by commas"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShareModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Box */}
      {isChatOpen && (
        <div
          id="chatbox"
          className="fixed bottom-20 right-10 w-80 h-96 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Chat with collaborators"
        >
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-md ${msg.user === 'You' ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'}`}
              >
                <div className="text-xs font-semibold">{msg.user}</div>
                <div>{msg.text}</div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-gray-300 flex space-x-2">
            <textarea
              aria-label="Type your message"
              rows={1}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleChatInputKeyDown}
              className="flex-1 resize-none border border-gray-300 rounded px-3 py-1 outline-none"
              placeholder="Type a message..."
            />
            <button
              onClick={sendChatMessage}
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition"
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPageCollaboration;