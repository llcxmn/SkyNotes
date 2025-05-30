import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faShareAlt,
  faCheckSquare,
  faBold,
  // faComments, // Assuming you uncommented this if needed
  faShirt,
  faPencilAlt,
  faArrowsAlt,
  faXmark,
  faEraser,
  faUndo,
  faRedo,
  faPalette
} from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { getUserNotes, createNote } from '../lib/dynamoDB';
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase'; 
import AllNotes from './AllNotes'; // <-- Import AllNotes for user preferences

// Mock current user for single-user app
// const currentUser = {
//   name: "User", // Simplified name
//   status: "Free",
// };

const NOTE_AREA_WIDTH = 794; // A4 width at 96 DPI (approx)
const NOTE_AREA_HEIGHT = 1123; // A4 height at 96 DPI (approx)

const NotesPage = () => {
  const [currentDocId, setCurrentDocId] = useState(null);
  const [title, setTitle] = useState("Untitled SkyNote");
  const [notes, setNotes] = useState({});
  const [themeColor, setThemeColor] = useState("#fde6e6");
  const [wordCount, setWordCount] = useState(0);

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

  // New currentUser state
  const [currentUser, setCurrentUser] = useState({ name: "User", status: "Free", id: null });

  useEffect(() => {
    // Use Firebase auth to get user info, fallback to AllNotes.js logic
    const unsubscribe = auth && auth.onAuthStateChanged ? onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          name: user.displayName || "User",
          status: user.status || "Free",
          id: user.uid
        });
      }
    }) : () => {};
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    let idFromUrl = queryParams.get('noteId');
    if (!idFromUrl) {
      idFromUrl = 'note_' + Date.now();
      window.history.replaceState({}, '', `${window.location.pathname}?noteId=${idFromUrl}`);
    }
    setCurrentDocId(idFromUrl);
  }, []);

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

  // clearCanvas is now primarily for the "Clear Canvas" button
  const clearCanvas = useCallback(() => { // Removed saveHistory param as it's always true from button
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      saveCanvasHistory(); // Save this cleared state to history
    }
  }, [saveCanvasHistory]); // Dependency: saveCanvasHistory (which depends on canvasHistoryStep)


  // Remove localStorage-based load effect, replace with DynamoDB fetch
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
  }, [currentDocId, currentUser?.id]);

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

  useEffect(() => {
    const totalChars = Object.values(notes).reduce((acc, note) => acc + (note.text ? note.text.length : 0), 0);
    setWordCount(totalChars);
  }, [notes]);

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

    // Ensure globalCompositeOperation is correctly set for the current tool
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
    if (!isDrawing || !canvasRef.current) return; // Ensure mouseup is only processed if drawing was active

    const ctx = canvasRef.current.getContext('2d');
    ctx.closePath(); 

    // It's good practice to reset gCO if it was changed, especially for eraser
    if (drawTool === 'eraser') {
        ctx.globalCompositeOperation = 'source-over'; 
    }
    
    saveCanvasHistory(); // Save state AFTER drawing stroke is complete and gCO is reset
    
    setIsDrawing(false);
    setLastPoint(null);
  };
  
  // This effect is for things like an eraser that paints with the theme color.
  // Since the current eraser uses 'destination-out', this effect isn't strictly needed for it.
  // Kept for reference or if theme affects other canvas aspects.
  useEffect(() => {
    // If the themeColor was meant to be the canvas background fill (not just the div behind it)
    // and you wanted to redraw content on top of this new fill:
    // const canvas = canvasRef.current;
    // if (canvas && canvasHistory.length > 0 && canvasHistoryStep >= 0) {
    //   const ctx = canvas.getContext('2d');
    //   ctx.fillStyle = themeColor;
    //   ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill with new theme
    //   restoreCanvasFromHistory(canvasHistoryStep); // Redraw current history state
    // }
  }, [themeColor /*, restoreCanvasFromHistory, canvasHistoryStep, canvasHistory*/]);


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
    const noteElement = noteRefs.current[key]; // This gives the DOM element
    if (!noteArea || !noteElement) return;

    const areaRect = noteArea.getBoundingClientRect();
    const currentNoteState = notes[key]; // Get dimensions from state for accuracy
    
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
  };

  const handleNoteMouseUp = () => {
    if (dragData.current.isDragging) {
      // Consider if auto-save is needed here
    }
    dragData.current = { key: null, offsetX: 0, offsetY: 0, isDragging: false };
    document.removeEventListener('mousemove', handleNoteMouseMove);
    document.removeEventListener('mouseup', handleNoteMouseUp);
  };

  const addNote = (type = 'text') => {
    const newKey = 'noteobj_' + Date.now();
    let noteWidth = 200;
    let noteHeight = 100;
    let noteText = type === 'yusuf' ? "Yusuf" :
                   type === 'ak' ? "Ak" :
                   type === 'budi' ? "Budi" :
                   type === 'akhdan' ? "Akhdan" :
                   type === 'adi_budi' ? "Notes Adi dan Budi" :
                   type === 'beso' ? "Beso" : "New Note";
    // Default Tailwind classes (will be overridden by inlineStyle if color picker is used for this note)
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
    } else if (['yusuf', 'ak', 'budi', 'akhdan'].includes(type)){
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

    setNotes(prev => ({
      ...prev,
      [newKey]: {
        text: noteText,
        top: initialTop,
        left: initialLeft,
        width: noteWidth,
        height: noteHeight,
        color: noteColorClass, // Store the class for default styling
        borderColor: noteBorderColorClass, // Store the class for default styling
        inlineStyle: {}, // Initialize empty, to be filled by color picker
        fontSize: type === 'beso' ? 'text-4xl' : 'text-base'
      }
    }));
    setSelectedNoteId(newKey);
    setMoveMode(false);
    setDrawingMode(false);
  };

  const handleNoteTextChange = (e, id) => {
    setNotes(prev => ({
      ...prev,
      [id]: { ...prev[id], text: e.target.value }
    }));
  };

  const handleSave = async () => {
    if (!currentDocId || !currentUser?.id) {
      alert("Error: No document ID or user. Cannot save.");
      return;
    }
    const canvas = canvasRef.current;
    let drawingDataUrl = null;
    if (canvas && canvasHistory.length > 0 && canvasHistoryStep >=0) {
        drawingDataUrl = canvas.toDataURL('image/png');
    }
    const now = new Date().toISOString();
    // Try to preserve createdAt if it exists in the loaded doc, otherwise use now
    let createdAt = now;
    if (notes && typeof notes === 'object' && Object.keys(notes).length > 0) {
      // Try to find createdAt from the loaded doc if available
      if (typeof window !== 'undefined' && window.localStorage) {
        // Defensive: try to get from localStorage if ever needed (legacy)
        const storageKey = `skyNoteData_${currentDocId}`;
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            if (parsed.createdAt) createdAt = parsed.createdAt;
          } catch {}
        }
      }
      // Or, if you loaded the doc from DynamoDB, you could keep it in a ref/state
      // For now, fallback to now
    }
    const dataToSave = {
      userId: currentUser.id,
      noteId: currentDocId,
      title,
      notes,
      themeColor,
      drawingDataUrl,
      lastViewed: now,
      createdAt,
      updatedAt: now,
      image: 'https://storage.googleapis.com/a1aa/image/be8802ad-74c0-4848-694a-ece413157a5b.jpg',
      // Add any other attributes you want to persist from AllNotes.js
    };
    try {
      await createNote(dataToSave);
      alert(`Notes for ${currentDocId} saved to cloud!`);
    } catch (err) {
      alert('Failed to save note to DynamoDB.');
      console.error(err);
    }
  };

  // Update deleteNote to also delete from DynamoDB
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
          notes: Object.fromEntries(Object.entries(notes).filter(([nid]) => nid !== id)),
          themeColor,
          drawingDataUrl: canvasRef.current ? canvasRef.current.toDataURL('image/png') : null,
          updatedAt: new Date().toISOString(),
        };
        await createNote(dataToSave);
      } catch (err) {
        console.error('Failed to update note after delete', err);
      }
    }
  };

  const handleFormat = (command) => {
    if (selectedNoteId && noteRefs.current[selectedNoteId]) {
        alert(`Formatting '${command}' would apply to the selected note if it were a rich text editor.`);
    } else {
        alert("Please select a note to format.");
    }
  };

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
                // Clear old Tailwind classes if inline styles are now dominant
                color: '', 
                borderColor: ''
            }
        }));
    } else if (colorPickerTarget === 'drawing') {
      setDrawingColor(newColorHex);
    }
    setShowColorPicker(false);
    setActiveColorPickerNoteId(null);
  };

  const availableColors = ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF', '#000000', '#FFFFFF', '#fde6e6', '#e6f7fD'];

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
            <FontAwesomeIcon icon={faSave} />
          </button>
          <button
            onClick={() => { setColorPickerTarget('theme'); setShowColorPicker(sp => !sp); }}
            className="p-2 hover:bg-gray-100 rounded-md"
            title="Change Theme Color"
          >
            <FontAwesomeIcon icon={faShirt} />
          </button>
          <button onClick={() => alert("Share functionality would be implemented here.")} className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition" title="Share">
            <FontAwesomeIcon icon={faShareAlt} />
          </button>
        </div>
      </div>

      {showColorPicker && (
        <div className="absolute top-20 mt-2 z-[100] bg-white shadow-lg rounded-md p-2 border border-gray-300 right-4 lg:right-auto"> {/* Position adjustment */}
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
          <button onClick={() => alert("Image insert would require a contentEditable field or more complex logic.")} className={`w-full px-3 py-2 rounded-md transition ${!selectedNoteId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`} title="Insert Image" disabled={!selectedNoteId}>
            <FontAwesomeIcon icon={faImage} />
          </button>

          <div className="pt-2 border-t w-full"></div>

          <button
            onClick={() => { setMoveMode(prev => !prev); if (!moveMode) {setDrawingMode(false); setSelectedNoteId(null); } }}
            className={`w-full px-3 py-2 rounded-md transition font-bold ${moveMode ? 'bg-yellow-400 text-black' : 'hover:bg-gray-200'} ${drawingMode ? 'opacity-50 cursor-not-allowed' : ''}`} title="Move Notes (M)"
            disabled={drawingMode}
          >
            <FontAwesomeIcon icon={faArrowsAlt} />
          </button>

          <div className="pt-2 border-t w-full"></div>
          <p className="text-xs text-gray-500 self-start">Drawing:</p>
          <button
            onClick={() => { setDrawingMode(true); setDrawTool('pencil'); setMoveMode(false); setSelectedNoteId(null);}}
            className={`w-full px-3 py-2 rounded-md transition font-bold ${drawingMode && drawTool === 'pencil' ? 'bg-yellow-400 text-black' : 'hover:bg-gray-200'}`} title="Draw (Pencil)"
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </button>
          <button
            onClick={() => { setDrawingMode(true); setDrawTool('eraser'); setMoveMode(false); setSelectedNoteId(null);}}
            className={`w-full px-3 py-2 rounded-md transition font-bold ${drawingMode && drawTool === 'eraser' ? 'bg-yellow-400 text-black' : 'hover:bg-gray-200'}`} title="Eraser"
          >
            <FontAwesomeIcon icon={faEraser} />
          </button>
          <button
            onClick={() => {setColorPickerTarget('drawing'); setShowColorPicker(prev => !prev);}}
            disabled={!drawingMode || drawTool === 'eraser'}
            className={`w-full px-3 py-2 rounded-md transition ${!drawingMode || drawTool === 'eraser' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
            title="Drawing Color"
          >
            <FontAwesomeIcon icon={faPalette} style={{color: drawingColor}}/>
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
            <button onClick={clearCanvas} className="w-full px-3 py-2 rounded-md transition bg-red-200 text-black hover:bg-red-300" title="Clear Drawing"> {/* Changed to call clearCanvas directly */}
              Clear Canvas
            </button>
          )}
        </div>
              {/* Word Count */}
      <div className="fixed bottom-10 right-10 flex items-center bg-white rounded-xl shadow-md border border-gray-200 z-50">
        <div className="px-4 py-2 text-black text-sm font-semibold">{wordCount}/100</div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-r-xl font-semibold">Char</button>
      </div>

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
            // Determine style: prioritize inlineStyle, fallback to Tailwind classes
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
                    onChange={(e) => handleNoteTextChange(e, id)}
                    className="flex-1 resize-none outline-none bg-transparent text-sm"
                    style={{ fontSize: note.fontSize === 'text-base' ? 'inherit' : note.fontSize }}
                    placeholder="Enter note text"
                  />
                )}
                {moveMode && (
                  <div className="absolute inset-0 bg-black opacity-0 transition-opacity group-hover:opacity-10" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;