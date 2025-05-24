import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth-related pages
import AuthPage from './pages/Auth';
import UserProfile from './pages/UserProfile';

// Main layout components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import NotesPage from './components/NotesPage';
import Trash from './components/Trash';
import AllNotes from './components/AllNotes';
import Collaboration from './components/Collaboration';
import MainLayout from './components/MainLayout';
import NotesPageCollaboration from './components/NotesPageCollaboration';

const App = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white m-0 p-0 min-h-screen">
        <Navbar />
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<UserProfile />} />

          {/* Main Layout Routes */}
          <Route
            path="/"
            element={<Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path="/trash"
            element={
              <MainLayout>
                <Trash />
              </MainLayout>
            }
          />
          <Route
            path="/allnotes"
            element={
              <MainLayout>
                <AllNotes />
              </MainLayout>
            }
          />
          <Route
            path="/collaboration"
            element={
              <MainLayout>
                <Collaboration />
              </MainLayout>
            }
          />
          <Route
            path="/notespage"
            element={<NotesPage />}
          />
          <Route
            path="/notespagecollaboration"
            element={<NotesPageCollaboration />}
          />
          
          {/* Other Routes */}
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;