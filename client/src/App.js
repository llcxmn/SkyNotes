import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import LandingPage from './pages/LandingPage';
import LanggananPage from "./pages/langganan-page";
import AuthPage from './pages/Auth';
import UserProfile from './pages/UserProfile';

// Components
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
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<LanggananPage />} />
        
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<UserProfile />} />

        {/* Main Layout Routes */}
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
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
};

export default App;