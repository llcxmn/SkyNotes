import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function HeaderPrivate() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  return (
    <>
      {/* Overlay Drawer */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="font-bold text-lg">SkyNotes</h2>
          <button onClick={() => setIsMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 pt-6">
          <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/pricing" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
            <img
              src={
                user?.photoURL ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "User")}&background=0D8ABC&color=fff`
              }
              className="w-8 h-8 rounded-full"
              alt="Avatar"
            />
            <span>{user?.displayName || "User"}</span>
          </Link>
        </div>
      </div>

      {/* Header */}
      <header className="py-4 px-6 bg-gradient-to-r from-blue-800 to-blue-500 shadow-md rounded-xl mt-6 mx-4 md:mx-16">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/images/logo.png" alt="SkyNotes Logo" className="w-24 h-auto" />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-white font-semibold">
            <Link to="/dashboard" className="hover:underline">Home</Link>
            <Link to="/pricing" className="hover:underline">Pricing</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>

            <Link
              to="/profile"
              className="bg-white text-black rounded-full px-4 py-1 flex items-center space-x-2 shadow-sm hover:shadow-md transition"
            >
              <span className="font-semibold">{user?.displayName || "User"}</span>
              <img
                src={
                  user?.photoURL ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "User")}&background=0D8ABC&color=fff`
                }
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            </Link>
          </nav>

          {/* Hamburger Button */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>
    </>
  );
}
