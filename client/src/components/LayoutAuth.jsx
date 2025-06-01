export default function LayoutAuth({ children }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* KIRI - Desktop */}
      <div className="hidden md:flex md:w-2/5 bg-gradient-to-r from-blue-900 to-blue-600 text-white flex-col p-10 relative">
        <img
          src="/images/logo.png"
          alt="SkyNotes Logo"
          className="w-60 mt-20"
        />
        <p className="max-w-md text-white text-xl font-medium mt-4 text-justify">
          SkyNote is a fast cloud-based note-taking platform that allows users
          to create personal or collaborative notes with friends. With a simple
          interface and easy access from various devices, SkyNote helps you
          capture ideas, tasks, and collaborate seamlessly.
        </p>
        <footer className="absolute left-10 bottom-6 text-sm font-semibold">
          © 2025 SkyNotes Group. All Rights Reserved
        </footer>
      </div>

      {/* KIRI - Mobile */}
      <div className="md:hidden w-full bg-gradient-to-r from-blue-900 to-blue-600 text-white flex flex-col items-center text-center px-6 py-8">
        <img
          src="/images/logo.png"
          alt="SkyNotes Logo"
          className="w-40 mb-4"
        />
        <p className="text-sm font-medium">
          SkyNote is a fast note-taking platform to create personal or collaborative notes with friends. Capture ideas, tasks, and collaborate seamlessly.
        </p>
        <footer className="mt-6 text-xs font-semibold">
          © 2025 SkyNotes Group
        </footer>
      </div>

      {/* KANAN */}
      {children}
    </div>
  );
}
