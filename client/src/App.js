import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
      <div className="bg-white m-0 p-0 min-h-screen">
        <Navbar />
        <Routes>
          {/* Semua route dengan layout Navbar + Sidebar */}
          <Route
            path="/"
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
            element={
                <NotesPage />
            }
          />
          <Route
            path="/notespagecollaboration"
            element={
                <NotesPageCollaboration />
            }
          />
          {/* Route tanpa sidebar/layout khusus */}
          <Route path="/pricing" element={<div className="text-white p-10">Pricing Page</div>} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
