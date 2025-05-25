import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayName, setDisplayName] = useState("User");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.displayName || "User");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="mx-4 md:mx-28 mt-6 rounded-xl bg-gradient-to-r from-[#0B3B8A] to-[#0B6FFF] px-6 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img alt="SkyNotes logo" className="w-28 h-10" src="logoSkynote.png" />
        </div>

        <div className="flex items-center gap-6">
          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 text-white font-semibold text-base select-none">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/pricing" className="hover:underline">Pricing</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>

          <Link to="/profile" className="flex items-center space-x-2 bg-white rounded-full px-3 py-2 text-black font-semibold text-sm">
            <span>{displayName}</span>
            <img
              alt="User avatar"
              className="w-8 h-8 rounded-full object-cover"
              src="https://storage.googleapis.com/a1aa/image/af86ecee-31cd-4f12-1378-5a28ca947752.jpg"
            />
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white text-2xl focus:outline-none"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <ul className="md:hidden mt-4 space-y-2 text-white font-semibold text-base">
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li><Link to="/pricing" className="hover:underline">Pricing</Link></li>
          <li><Link to="/contact" className="hover:underline">Contact</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;