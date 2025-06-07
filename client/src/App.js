import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import LandingPage from './pages/LandingPage';
import LanggananPage from "./pages/langganan-page";
import AuthPage from './pages/Auth';
import UserProfile from './pages/UserProfile';
import BillingPage from './pages/BillingPage';

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
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from './components/ProtectedRoute';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<LanggananPage />} />

          {/* Auth Routes */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<UserProfile />} />

          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <BillingPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/trash"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Trash />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/allnotes"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AllNotes />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/collaboration"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Collaboration />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notespage"
            element={
              <ProtectedRoute>
                <NotesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notespagecollaboration"
            element={
              <ProtectedRoute>
                <NotesPageCollaboration />
              </ProtectedRoute>
            }
          />

          {/* Other Routes */}
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;