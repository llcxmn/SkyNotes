import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../contexts/AuthContext';
import {
  faHistory,
  faTrash,
  faTableCellsLarge,
  faFolder,
  faEdit,
  faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import {auth} from '../firebase'; 
const Sidebar = () => {
   const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.displayName || "User"); // fallback if no name
      }
    });

    return () => unsubscribe(); 
  }, []);

  const activeClass =
    "text-yellow-400 border-b border-gray-400 pb-2 w-full flex items-center space-x-2";
  const inactiveClass =
    "text-white hover:text-yellow-400 border-b border-gray-400 pb-2 w-full flex items-center space-x-2";
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };
  return (
    <aside className="flex flex-col space-y-6 md:w-1/6 text-white select-none gap-[130px]">
      <nav className="flex flex-col space-y-3 font-semibold text-lg">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-1">Hi, {displayName}</h2>
          <p className="text-sm font-normal">Welcome to SkyNotes!</p>
        </div>
        <div className="space-y-4 w-full">
          <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
            <FontAwesomeIcon icon={faHistory} />
            <span>Recently</span>
          </NavLink>

          <NavLink to="/trash" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
            <FontAwesomeIcon icon={faTrash} />
            <span>Trash</span>
          </NavLink>

          <NavLink to="/allnotes" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
            <FontAwesomeIcon icon={faTableCellsLarge} />
            <span>All Notes</span>
          </NavLink>

          <NavLink to="/collaboration" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
            <FontAwesomeIcon icon={faFolder} />
            <span>Collaboration</span>
          </NavLink>
          
        </div>
      </nav>

      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2 font-semibold text-white text-lg">
          <FontAwesomeIcon icon={faEdit} />
          <span>Total Notes</span>
        </div>
        <div className="w-full bg-white rounded-full h-2">
          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "20%" }}></div>
        </div>
        <p className="text-xs font-normal text-white">2 out of 10 Notes have been used</p>
        <NavLink
          to="/pricing"
          className="bg-yellow-400 text-black font-bold rounded-lg py-3 px-6 w-max hover:bg-yellow-300 transition-colors inline-block text-center"
        >
          Get more Notes
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
