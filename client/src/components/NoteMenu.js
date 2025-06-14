import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const NoteMenu = ({ onDelete, onDetail, onShare }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative z-50">
      <button
        onClick={(e) => {
          e.stopPropagation(); // Cegah klik propagate ke parent
          setOpen(!open);
        }}
        className="text-white text-xl px-2 hover:bg-black hover:bg-opacity-30 rounded-full"
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-28 bg-white text-black border rounded shadow z-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDetail();
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Detail
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare();
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Share
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              Swal.fire({
                title: 'Are you sure you want to delete this?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: "#2563eb",
                cancelButtonColor:"#6b7280",
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                reverseButtons: true
              }).then((result) => {
                if (result.isConfirmed) {
                  onDelete(); 
                  Swal.fire('Deleted!', 'Your note has been deleted.', 'success');
                }
              });
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left hover:bg-red-100 text-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteMenu;
