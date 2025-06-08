import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for new notes
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faShareAlt,
  faCheckSquare,
  faBold,
  faShirt,
  faPencilAlt,
  faArrowsAlt,
  faEraser,
  faUndo,
  faRedo,
  faPalette
} from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { getUserNotes, createNote, getUserScale } from '../lib/dynamoDB'; // Import getUserScale
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase'; // Assuming firebase.js exports 'auth'
import Swal from 'sweetalert2'; // For alerts

// Establish socket connection outside the component to prevent re-connections on re-renders
// Ensure this matches your server's socket.io port (3001)
const socket = io('http://localhost:3001');

const NOTE_AREA_WIDTH = 794; // A4 width at 96 DPI (approx)
const NOTE_AREA_HEIGHT = 1123; // A4 height at 96 DPI (approx)

const NotesPage = () => {
  const [currentDocId, setCurrentDocId] = useState(null);
  const [title, setTitle] = useState("Untitled SkyNote");
  const [notes, setNotes] = useState({}); // Notes stored as an object { id: noteData }
  const [themeColor, setThemeColor] = useState("#fde6e6");
  const [wordCount, setWordCount] = useState(0);
  const [wordLimit, setWordLimit] = useState(100); // Default to 100, will be updated

  const [drawingMode, setDrawingMode] = useState(false);
  const [drawTool, setDrawTool] = useState('pencil');
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);
  const [drawingColor, setDrawingColor] = useState("#000000");
  const canvasRef = useRef(null);
  const [canvasHistory, setCanvasHistory] = useState([]);
  const [canvasHistoryStep, setCanvasHistoryStep] = useState(-1);

  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [moveMode, setMoveMode] = useState(false);
  const dragData = useRef({ key: null, offsetX: 0, offsetY: 0, isDragging: false });
  const noteAreaRef = useRef(null);
  const noteRefs = useRef({});

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerTarget, setColorPickerTarget] = useState(null);
  const [activeColorPickerNoteId, setActiveColorPickerNoteId] = useState(null);

  // New currentUser state (for Firebase auth)
  const [currentUser, setCurrentUser] = useState({ name: "Guest", status: "Free", id: null });
  const [saved, setSaved] = useState(false);

  // Socket.IO specific states
  const [chatMessages, setChatMessages] = useState([]);
  const [currentChatMessage, setCurrentChatMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // --- Firebase Authentication Effect ---
  useEffect(() => {
    // Use Firebase auth to get user info
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser({
          name: user.displayName || "User",
          status: "Free", // Default status, you might fetch this from a user profile in DB
          id: user.uid
        });
        // Fetch word limit from DynamoDB scale table
        try {
          const scale = await getUserScale(user.uid);
          if (scale && scale.word_limit) {
            setWordLimit(Number(scale.word_limit));
          } else {
            setWordLimit(100); // fallback
          }
        } catch {
          setWordLimit(100);
        }
      } else {
        setCurrentUser({ name: "Guest", status: "Free", id: null });
        setWordLimit(100);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- Document ID from URL Effect ---
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    let idFromUrl = queryParams.get('noteId');
    if (!idFromUrl) {
      idFromUrl = 'note_' + Date.now(); // Generate new ID if not present
      window.history.replaceState({}, '', `${window.location.pathname}?noteId=${idFromUrl}`);
    }
    setCurrentDocId(idFromUrl);
  }, []);

  // --- Socket.IO Connection and Listeners Effect ---
  useEffect(() => {
    // Event listener for successful connection
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      setIsConnected(true);
    });

    // Event listener for disconnection
    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      setIsConnected(false);
    });

    // Listener for when a note is updated by another client
    socket.on('note-updated', (updatedNote) => {
      console.log('Note updated by another client:', updatedNote);
      setNotes((prevNotes) => ({
        ...prevNotes,
        [updatedNote.id]: updatedNote,
      }));
    });

    // Listener for when a new note is added by another client
    socket.on('note-added', (newNote) => {
      console.log('Note added by another client:', newNote);
      setNotes((prevNotes) => ({
        ...prevNotes,
        [newNote.id]: newNote,
      }));
    });

    // Listener for new chat messages
    socket.on('new-chat-message', (message) => {
      console.log('New chat message:', message);
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup function: Disconnect socket listeners when the component unmounts
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('note-updated');
      socket.off('note-added');
      socket.off('new-chat-message');
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // --- Canvas History Management ---
  const saveCanvasHistory = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    setCanvasHistory(prevHistory => {
      const newHistory = prevHistory.slice(0, canvasHistoryStep + 1);
      newHistory.push(dataUrl);
      return newHistory;
    });
    setCanvasHistoryStep(prevStep => prevStep + 1);
  }, [canvasHistoryStep]);

  const restoreCanvasFromHistory = useCallback((step) => {
    if (!canvasRef.current || !canvasHistory[step]) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = canvasHistory[step];
  }, [canvasHistory]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      saveCanvasHistory(); // Save this cleared state to history
    }
  }, [saveCanvasHistory]);

  // --- Load Notes from DynamoDB Effect ---
  useEffect(() => {
    if (!currentDocId || !currentUser?.id || !canvasRef.current) return;
    const fetchNotes = async () => {
      try {
        const items = await getUserNotes(currentUser.id);
        const doc = items.find(item => item.noteId === currentDocId);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const initializeEmptyCanvasForHistory = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL();
          setCanvasHistory([dataUrl]);
          setCanvasHistoryStep(0);
        };

        if (doc) {
          setTitle(doc.title || `SkyNote ${currentDocId}`);
          setNotes(doc.notes || {});
          setThemeColor(doc.themeColor || "#fde6e6");
          if (doc.drawingDataUrl) {
            const img = new window.Image();
            img.onload = () => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
              const loadedDataUrl = canvas.toDataURL();
              setCanvasHistory([loadedDataUrl]);
              setCanvasHistoryStep(0);
            };
            img.onerror = () => {
              initializeEmptyCanvasForHistory();
            };
            img.src = doc.drawingDataUrl;
          } else {
            initializeEmptyCanvasForHistory();
          }
        } else {
          setTitle(`SkyNote ${currentDocId}`);
          setNotes({});
          setThemeColor("#fde6e6");
          initializeEmptyCanvasForHistory();
        }
      } catch (error) {
        setTitle(`SkyNote ${currentDocId}`);
        setNotes({});
        setThemeColor("#fde6e6");
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL();
          setCanvasHistory([dataUrl]);
          setCanvasHistoryStep(0);
        }
        console.error('Failed to fetch notes from DynamoDB', error);
      }
    };
    fetchNotes();
  }, [currentDocId, currentUser?.id]); // Re-fetch when docId or user changes

  // --- Undo/Redo Functions ---
  const handleUndo = () => {
    if (canvasHistoryStep > 0) {
      setCanvasHistoryStep(prevStep => {
        const newStep = prevStep - 1;
        restoreCanvasFromHistory(newStep);
        return newStep;
      });
    }
  };

  const handleRedo = () => {
    if (canvasHistoryStep < canvasHistory.length - 1) {
      setCanvasHistoryStep(prevStep => {
        const newStep = prevStep + 1;
        restoreCanvasFromHistory(newStep);
        return newStep;
      });
    }
  };

  // --- Word Count Effect ---
  useEffect(() => {
    const totalChars = Object.values(notes).reduce((acc, note) => acc + (note.text ? note.text.length : 0), 0);
    setWordCount(totalChars);
  }, [notes]);

  // --- Canvas Drawing Handlers ---
  const handleCanvasMouseDown = (e) => {
    if (!drawingMode || !canvasRef.current) return;
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLastPoint({ x, y });

    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDrawing || !drawingMode || !lastPoint || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    if (drawTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 20;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = drawingColor;
      ctx.lineWidth = 5;
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    setLastPoint({ x: currentX, y: currentY });
  };

  const handleCanvasMouseUp = () => {
    if (!isDrawing || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    ctx.closePath();

    // Reset globalCompositeOperation if it was changed for eraser
    if (drawTool === 'eraser') {
      ctx.globalCompositeOperation = 'source-over';
    }

    saveCanvasHistory(); // Save state AFTER drawing stroke is complete
    setIsDrawing(false);
    setLastPoint(null);
  };

  // --- Note Movement Handlers ---
  const handleNoteMouseDown = (e, id) => {
    if (!moveMode || drawingMode || !noteAreaRef.current) return;
    const noteElement = noteRefs.current[id];
    const noteAreaRect = noteAreaRef.current.getBoundingClientRect();
    if (!noteElement) return;

    dragData.current = {
      key: id,
      offsetX: e.clientX - noteAreaRect.left - noteElement.offsetLeft,
      offsetY: e.clientY - noteAreaRect.top - noteElement.offsetTop,
      isDragging: true,
    };
    setSelectedNoteId(id);
    document.addEventListener('mousemove', handleNoteMouseMove);
    document.addEventListener('mouseup', handleNoteMouseUp);
  };

  const handleNoteMouseMove = (e) => {
    if (!dragData.current.isDragging || !moveMode || !noteAreaRef.current) return;
    const { key, offsetX, offsetY } = dragData.current;
    if (!key) return;

    const noteArea = noteAreaRef.current;
    const noteElement = noteRefs.current[key];
    if (!noteArea || !noteElement) return;

    const areaRect = noteArea.getBoundingClientRect();
    const currentNoteState = notes[key];

    const noteWidth = currentNoteState ? currentNoteState.width : noteElement.offsetWidth;
    const noteHeight = currentNoteState ? currentNoteState.height : noteElement.offsetHeight;

    let newLeft = e.clientX - areaRect.left - offsetX;
    let newTop = e.clientY - areaRect.top - offsetY;

    newLeft = Math.max(0, Math.min(newLeft, NOTE_AREA_WIDTH - noteWidth));
    newTop = Math.max(0, Math.min(newTop, NOTE_AREA_HEIGHT - noteHeight));

    setNotes(prev => ({
      ...prev,
      [key]: { ...prev[key], top: newTop, left: newLeft }
    }));
    // TODO: Consider emitting a 'note-moved' event if real-time position updates are needed
    // This would require a new socket event on the server. For now, only text changes are real-time.
  };

  const handleNoteMouseUp = () => {
    if (dragData.current.isDragging) {
      // If you want to save position changes to DynamoDB immediately after drag ends:
      // handleSave();
    }
    dragData.current = { key: null, offsetX: 0, offsetY: 0, isDragging: false };
    document.removeEventListener('mousemove', handleNoteMouseMove);
    document.removeEventListener('mouseup', handleNoteMouseUp);
  };

  // --- Add Note Function ---
  const addNote = (type = 'text') => {
    const newKey = uuidv4(); // Use uuidv4 for robust unique IDs
    let noteWidth = 200;
    let noteHeight = 100;
    let noteText = type === 'yusuf' ? "Yusuf" :
      type === 'ak' ? "Ak" :
        type === 'budi' ? "Budi" :
          type === 'akhdan' ? "Akhdan" :
            type === 'adi_budi' ? "Notes Adi dan Budi" :
              type === 'beso' ? "Beso" : "New Note";
    let noteColorClass = 'bg-yellow-200';
    let noteBorderColorClass = 'border-yellow-400';

    if (type === 'adi_budi') {
      noteColorClass = 'bg-white';
      noteBorderColorClass = 'border-blue-500';
      noteWidth = 250;
      noteHeight = 70;
    } else if (type === 'beso') {
      noteColorClass = 'bg-yellow-300';
      noteBorderColorClass = 'border-yellow-500';
      noteWidth = 180;
      noteHeight = 120;
    } else if (['yusuf', 'ak', 'budi', 'akhdan'].includes(type)) {
      noteColorClass = 'bg-pink-200';
      noteBorderColorClass = 'border-pink-400';
      if (type === 'budi') {
        noteColorClass = 'bg-blue-200';
        noteBorderColorClass = 'border-blue-400';
      }
      noteWidth = 100;
      noteHeight = 50;
    }

    const initialTop = Math.max(0, Math.min(100 + Object.keys(notes).length * 20, NOTE_AREA_HEIGHT - noteHeight - 20));
    const initialLeft = Math.max(0, Math.min(100 + Object.keys(notes).length * 20, NOTE_AREA_WIDTH - noteWidth - 20));

    const newNote = {
      id: newKey, // Ensure the ID is part of the note object
      text: noteText,
      top: initialTop,
      left: initialLeft,
      width: noteWidth,
      height: noteHeight,
      color: noteColorClass,
      borderColor: noteBorderColorClass,
      inlineStyle: {},
      fontSize: type === 'beso' ? 'text-4xl' : 'text-base'
    };

    setNotes(prev => ({
      ...prev,
      [newKey]: newNote // Add to state using newKey as the object key
    }));
    setSelectedNoteId(newKey);
    setMoveMode(false);
    setDrawingMode(false);

    // Emit 'add-note' event to the server
    socket.emit('add-note', newNote);
    console.log('Emitted add-note:', newNote);
  };

  // --- Handle Note Text Change (Real-time Collaboration) ---
  const handleNoteTextChange = (e, id) => {
    const updatedNote = {
      ...notes[id],
      text: e.target.value,
      timestamp: new Date().toISOString(), // Add timestamp for update tracking
    };

    setNotes(prev => ({
      ...prev,
      [id]: updatedNote,
    }));

    // Emit 'update-note' event to the server for real-time collaboration
    socket.emit('update-note', updatedNote);
    console.log('Emitted update-note:', updatedNote);
  };

  // --- Save Function (to DynamoDB) ---
  const handleSave = async () => {
    if (!currentDocId || !currentUser?.id) {
      Swal.fire('Error', 'No document ID or user. Cannot save.', 'error');
      return;
    }
    const canvas = canvasRef.current;
    let drawingDataUrl = null;
    if (canvas && canvasHistory.length > 0 && canvasHistoryStep >= 0) {
      drawingDataUrl = canvas.toDataURL('image/png');
    }
    const now = new Date().toISOString();
    let createdAt = now;

    // This part of the original code attempts to get createdAt from localStorage,
    // which might not be consistent with DynamoDB. For a multi-user app, createdAt
    // should ideally be set once on creation in DynamoDB.
    // Keeping it for now as per original user code, but note this potential inconsistency.
    if (notes && typeof notes === 'object' && Object.keys(notes).length > 0) {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storageKey = `skyNoteData_${currentDocId}`;
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            if (parsed.createdAt) createdAt = parsed.createdAt;
          } catch { }
        }
      }
    }

    const dataToSave = {
      userId: currentUser.id,
      noteId: currentDocId,
      title,
      notes, // Save the entire notes object
      themeColor,
      drawingDataUrl,
      lastViewed: now,
      createdAt,
      updatedAt: now,
      image: 'https://storage.googleapis.com/a1aa/image/be8802ad-74c0-4848-694a-ece413157a5b.jpg', // Placeholder image
    };
    try {
      await createNote(dataToSave); // Assuming createNote handles both creation and updates
      setSaved(true);
      Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'Your notes have been saved in cloud.',
        timer: 1500,
        showConfirmButton: false
      });
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      Swal.fire('Failed to Save', 'Something went wrong while saving your note.', 'error');
      console.error(err);
    }
  };

  // --- Delete Note Function (and update DynamoDB) ---
  const deleteNote = async (id) => {
    setNotes(prev => {
      const newNotes = { ...prev };
      delete newNotes[id];
      return newNotes;
    });
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
    // Optionally, update the note in DynamoDB after local delete
    if (currentDocId && currentUser?.id) {
      try {
        const dataToSave = {
          userId: currentUser.id,
          noteId: currentDocId,
          title,
          notes: Object.fromEntries(Object.entries(notes).filter(([nid]) => nid !== id)), // Send updated notes object
          themeColor,
          drawingDataUrl: canvasRef.current ? canvasRef.current.toDataURL('image/png') : null,
          updatedAt: new Date().toISOString(),
        };
        await createNote(dataToSave); // Assuming createNote updates existing notes
      } catch (err) {
        console.error('Failed to update note after delete', err);
      }
    }
  };

  // --- Formatting (Placeholder as it's not a rich text editor) ---
  const handleFormat = (command) => {
    if (selectedNoteId && noteRefs.current[selectedNoteId]) {
      Swal.fire({
        icon: 'info',
        title: 'Formatting Feature',
        text: `Formatting '${command}' would apply to the selected note if this were a rich text editor. This is a basic text area.`,
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'No Note Selected',
        text: "Please select a note to format.",
      });
    }
  };

  // --- Color Picker Handlers ---
  const handleColorChange = (color) => {
    const newColorHex = color.hex;
    if (colorPickerTarget === 'theme') {
      setThemeColor(newColorHex);
    } else if (colorPickerTarget === 'note' && activeColorPickerNoteId && notes[activeColorPickerNoteId]) {
      setNotes(prev => ({
        ...prev,
        [activeColorPickerNoteId]: {
          ...prev[activeColorPickerNoteId],
          inlineStyle: {
            backgroundColor: newColorHex,
            borderColor: newColorHex // You might want a darker/lighter shade for border
          },
          color: '', // Clear old Tailwind classes if inline styles are now dominant
          borderColor: ''
        }
      }));
      // Emit update for note color change
      socket.emit('update-note', {
        ...notes[activeColorPickerNoteId],
        inlineStyle: { backgroundColor: newColorHex, borderColor: newColorHex },
        color: '',
        borderColor: ''
      });
    } else if (colorPickerTarget === 'drawing') {
      setDrawingColor(newColorHex);
    }
    setShowColorPicker(false);
    setActiveColorPickerNoteId(null);
  };

  const availableColors = ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF', '#000000', '#FFFFFF', '#fde6e6', '#e6f7fD'];

  // --- Chat Message Handlers ---
  const handleSendChatMessage = () => {
    if (!currentChatMessage.trim()) return;

    const message = {
      id: uuidv4(),
      text: currentChatMessage.trim(),
      sender: currentUser.name || 'Guest', // Use current user's name
      timestamp: new Date().toISOString(),
    };
    // Optimistically add to local chat messages
    setChatMessages((prevMessages) => [...prevMessages, message]);
    // Emit chat message to the server
    socket.emit('send-chat-message', message);
    console.log('Emitted send-chat-message:', message);
    setCurrentChatMessage(''); // Clear chat input
  };

  if (!currentDocId) {
    return <div className="flex justify-center items-center min-h-screen">Loading document...</div>;
  }

  return (
    <div className="relative min-h-screen font-sans bg-gray-100 flex flex-col items-center p-4">
      {/* Top Bar */}
      <div className="w-full max-w-5xl flex justify-between items-center bg-white rounded-xl shadow-md border border-gray-200 px-6 py-3 mb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold outline-none bg-transparent p-1 rounded hover:bg-gray-100 focus:bg-gray-100"
            placeholder="Untitled SkyNote"
          />
          <span className={`text-xs font-semibold px-3 py-1 rounded-md ${currentUser.status === 'Premium' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
            {currentUser.status}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold max-w-xs truncate">{currentUser.name}</span>
          <button onClick={handleSave} className="p-2 hover:bg-gray-100 rounded-md" title="Save Note">
            <FontAwesomeIcon icon={saved ? faCheckSquare : faSave} />
          </button>
          <button
            onClick={() => { setColorPickerTarget('theme'); setShowColorPicker(sp => !sp); }}
            className="p-2 hover:bg-gray-100 rounded-md"
            title="Change Theme Color"
          >
            <FontAwesomeIcon icon={faShirt} />
          </button>
          <button onClick={() => Swal.fire('Share', 'Share functionality would be implemented here.', 'info')} className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition" title="Share">
            <FontAwesomeIcon icon={faShareAlt} />
          </button>
        </div>
      </div>

      {showColorPicker && (
        <div className="absolute top-20 mt-2 z-[100] bg-white shadow-lg rounded-md p-2 border border-gray-300 right-4 lg:right-auto">
          <div className="grid grid-cols-7 gap-1">
            {availableColors.map(c => (
              <button
                key={c}
                style={{ backgroundColor: c }}
                className="w-6 h-6 rounded-full border border-gray-300"
                onClick={() => handleColorChange({ hex: c })}
              />
            ))}
          </div>
          <button onClick={() => setShowColorPicker(false)} className="mt-2 text-xs text-gray-500 hover:text-black w-full text-center">Close</button>
        </div>
      )}

      <div className="flex w-full max-w-5xl gap-4">
        {/* Left Sidebar - Tools */}
        <div className="flex flex-col items-center bg-white rounded-xl shadow-md border border-gray-200 p-3 space-y-3 h-fit sticky top-24">
          <button
            onClick={() => addNote('text')}
            className="font-bold px-3 py-2 rounded-md transition bg-yellow-400 text-black hover:bg-yellow-500 shadow-sm w-full text-sm"
            title="Add Generic Text Note (T)"
          >
            Text Box
          </button>

          <div className="pt-2 border-t w-full"></div>

          <button
            onClick={() => handleFormat('bold')}
            disabled={drawingMode || !selectedNoteId}
            className={`w-full px-3 py-2 rounded-md transition ${drawingMode || !selectedNoteId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`} title="Bold (B)"
          >
            <FontAwesomeIcon icon={faBold} />
          </button>
          <button
            onClick={() => handleFormat('insertUnorderedList')}
            disabled={drawingMode || !selectedNoteId}
            className={`w-full px-3 py-2 rounded-md transition ${drawingMode || !selectedNoteId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`} title="Checklist"
          >
            <FontAwesomeIcon icon={faCheckSquare} />
          </button>
          <button onClick={() => Swal.fire('Image', 'Image insert would require a contentEditable field or more complex logic.', 'info')} className={`w-full px-3 py-2 rounded-md transition ${!selectedNoteId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`} title="Insert Image" disabled={!selectedNoteId}>
            <FontAwesomeIcon icon={faImage} />
          </button>

          <div className="pt-2 border-t w-full"></div>

          <button
            onClick={() => { setMoveMode(prev => !prev); if (!moveMode) { setDrawingMode(false); setSelectedNoteId(null); } }}
            className={`w-full px-3 py-2 rounded-md transition font-bold ${moveMode ? 'bg-yellow-400 text-black' : 'hover:bg-gray-200'} ${drawingMode ? 'opacity-50 cursor-not-allowed' : ''}`} title="Move Notes (M)"
            disabled={drawingMode}
          >
            <FontAwesomeIcon icon={faArrowsAlt} />
          </button>

          <div className="pt-2 border-t w-full"></div>
          <p className="text-xs text-gray-500 self-start">Drawing:</p>
          <button
            onClick={() => { setDrawingMode(true); setDrawTool('pencil'); setMoveMode(false); setSelectedNoteId(null); }}
            className={`w-full px-3 py-2 rounded-md transition font-bold ${drawingMode && drawTool === 'pencil' ? 'bg-yellow-400 text-black' : 'hover:bg-gray-200'}`} title="Draw (Pencil)"
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </button>
          <button
            onClick={() => { setDrawingMode(true); setDrawTool('eraser'); setMoveMode(false); setSelectedNoteId(null); }}
            className={`w-full px-3 py-2 rounded-md transition font-bold ${drawingMode && drawTool === 'eraser' ? 'bg-yellow-400 text-black' : 'hover:bg-gray-200'}`} title="Eraser"
          >
            <FontAwesomeIcon icon={faEraser} />
          </button>
          <button
            onClick={() => { setColorPickerTarget('drawing'); setShowColorPicker(prev => !prev); }}
            disabled={!drawingMode || drawTool === 'eraser'}
            className={`w-full px-3 py-2 rounded-md transition ${!drawingMode || drawTool === 'eraser' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
            title="Drawing Color"
          >
            <FontAwesomeIcon icon={faPalette} style={{ color: drawingColor }} />
          </button>
          <button
            onClick={handleUndo}
            disabled={!drawingMode || canvasHistoryStep <= 0}
            className={`w-full px-3 py-2 rounded-md transition ${!drawingMode || canvasHistoryStep <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`} title="Undo Drawing"
          >
            <FontAwesomeIcon icon={faUndo} />
          </button>
          <button
            onClick={handleRedo}
            disabled={!drawingMode || canvasHistoryStep >= canvasHistory.length - 1}
            className={`w-full px-3 py-2 rounded-md transition ${!drawingMode || canvasHistoryStep >= canvasHistory.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`} title="Redo Drawing"
          >
            <FontAwesomeIcon icon={faRedo} />
          </button>
          {drawingMode && (
            <button onClick={clearCanvas} className="w-full px-3 py-2 rounded-md transition bg-red-200 text-black hover:bg-red-300" title="Clear Drawing">
              Clear Canvas
            </button>
          )}
        </div>

        {/* Main Note Area */}
        <div
          ref={noteAreaRef}
          className="relative shadow-lg rounded-md overflow-hidden"
          style={{ width: `${NOTE_AREA_WIDTH}px`, height: `${NOTE_AREA_HEIGHT}px`, backgroundColor: themeColor, cursor: drawingMode ? 'crosshair' : (moveMode ? 'grab' : 'default') }}
          onClick={() => { if (!moveMode && !drawingMode) setSelectedNoteId(null); }}
        >
          <canvas
            ref={canvasRef}
            width={NOTE_AREA_WIDTH}
            height={NOTE_AREA_HEIGHT}
            className="absolute top-0 left-0"
            style={{ zIndex: drawingMode ? 25 : 10, pointerEvents: drawingMode ? 'auto' : 'none' }}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp} // End drawing if mouse leaves canvas
          />

          {Object.entries(notes).map(([id, note]) => {
            const noteDynamicStyle = (note.inlineStyle && Object.keys(note.inlineStyle).length > 0)
              ? { ...note.inlineStyle }
              : {};

            const noteClasses = `absolute p-2 border-2 rounded-md shadow-md flex flex-col group
              ${moveMode ? 'cursor-move' : 'cursor-default'}
              ${selectedNoteId === id && !drawingMode ? 'ring-2 ring-offset-1 ring-blue-500 z-30' : 'z-20'}
              ${(!note.inlineStyle || Object.keys(note.inlineStyle).length === 0) ? (note.color || 'bg-yellow-200') : ''}
              ${(!note.inlineStyle || Object.keys(note.inlineStyle).length === 0) ? (note.borderColor || 'border-yellow-400') : ''}
              ${note.fontSize || 'text-base'}`;

            return (
              <div
                key={id}
                ref={el => noteRefs.current[id] = el}
                className={noteClasses}
                style={{
                  top: note.top, left: note.left,
                  width: note.width, height: note.height,
                  boxSizing: 'border-box',
                  ...noteDynamicStyle
                }}
                onMouseDownCapture={(e) => {
                  if (moveMode && !drawingMode) {
                    handleNoteMouseDown(e, id);
                  }
                }}
                onClick={() => {
                  if (!drawingMode) {
                    setSelectedNoteId(id);
                    setMoveMode(false);
                  }
                }}
              >
                {note.fontSize === 'text-4xl' ? (
                  <div className="text-4xl font-bold leading-tight truncate">{note.text}</div>
                ) : (
                  <textarea
                    value={note.text}
                    onChange={(e) => {
                      // Prevent typing if wordCount >= wordLimit
                      if (wordCount >= wordLimit && e.target.value.length > (note.text ? note.text.length : 0)) return;
                      handleNoteTextChange(e, id);
                    }}
                    className="flex-1 resize-none outline-none bg-transparent text-sm"
                    style={{ fontSize: note.fontSize === 'text-base' ? 'inherit' : note.fontSize }}
                    placeholder="Enter note text"
                    maxLength={wordLimit}
                  />
                )}
                {selectedNoteId === id && !drawingMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering parent onClick
                      setActiveColorPickerNoteId(id);
                      setColorPickerTarget('note');
                      setShowColorPicker(true);
                    }}
                    className="absolute -top-3 -right-3 bg-white p-1 rounded-full shadow-md border border-gray-300 hover:bg-gray-100"
                    title="Change Note Color"
                  >
                    <FontAwesomeIcon icon={faPalette} className="text-gray-600 text-xs" />
                  </button>
                )}
                {moveMode && (
                  <div className="absolute inset-0 bg-black opacity-0 transition-opacity group-hover:opacity-10" />
                )}
              </div>
            );
          })}
        </div>
        
        {/* Right Sidebar - Chat
        <div className="flex flex-col flex-1 bg-white p-6 rounded-lg shadow-md max-h-[calc(100vh-2rem)] md:max-h-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Real-time Chat
          </h2>
          <p className={`text-sm text-center mb-4 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          </p>
          <div className="flex-1 overflow-y-auto mb-4 p-2 border border-gray-200 rounded-md bg-gray-50 flex flex-col-reverse">
            {chatMessages.slice().reverse().map((msg) => ( // Reverse to show latest at bottom
              <div key={msg.id} className="mb-2">
                <span className="font-semibold text-blue-700 text-sm">{msg.sender}: </span>
                <span className="text-gray-800 text-sm">{msg.text}</span>
                <span className="block text-right text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              placeholder="Type your message..."
              value={currentChatMessage}
              onChange={(e) => setCurrentChatMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSendChatMessage();
              }}
            />
            <button
              onClick={handleSendChatMessage}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-300 ease-in-out transform hover:scale-105"
            >
              Send
            </button>
          </div>
        </div> */}
      </div>

      {/* Word Count */}
      <div className="fixed bottom-10 right-10 flex items-center bg-white rounded-xl shadow-md border border-gray-200 z-50">
        <div className="px-4 py-2 text-black text-sm font-semibold">{wordCount}/{wordLimit}</div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-r-xl font-semibold">Char</button>
      </div>
    </div>
  );
};

export default NotesPage;
