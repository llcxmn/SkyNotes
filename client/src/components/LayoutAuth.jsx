import LoginForm from "./forms/LoginForm";
import RegisterForm from "./forms/RegisterForm";

export default function LayoutAuth({ children }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans overflow-hidden">
      {/* KIRI */}
      <div className="w-full md:w-2/5 bg-gradient-to-r from-blue-900 to-blue-600 text-white flex flex-col p-6 md:p-10 relative">
        <img
          src="/images/logo.png"
          alt="SkyNotes Logo"
          className="w-48 md:w-60 mt-6 md:mt-20 mx-auto md:ml-9"
        />
        <p className="max-w-md text-justify text-white text-base md:text-xl font-medium mt-4 mx-auto md:ml-9">
          SkyNote is a fast cloud-based note-taking platform that allows users
          to create personal or collaborative notes with friends. With a simple
          interface and easy access from various devices, SkyNote helps you
          capture ideas, tasks, and collaborate seamlessly.
        </p>
        <footer className="absolute left-4 bottom-4 text-xs md:text-sm font-semibold">
          © 2025 SkyNotes Group. All Right Reserved
        </footer>
      </div>

      {/* KANAN */}
      {children}
    </div>
  );
}
