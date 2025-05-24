import { useEffect, useRef, useState } from "react";
import {onAuthStateChanged, updatePassword, signOut, deleteUser } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import HeaderPrivate from "../components/headers/HeaderPrivate";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleChangePassword = async () => {
    try {
      if (!newPassword) {
        toast.warning("Masukkan password baru.");
        return;
      }
      await updatePassword(auth.currentUser, newPassword);
      toast.success("Password berhasil diubah!");
      setNewPassword("");
    } catch (err) {
      if (err.code === "auth/requires-recent-login") {
        toast.error("Silakan login ulang untuk mengganti password.");
      } else {
        toast.error("Gagal mengganti password: " + err.message);
      }
    }
  };

  const handleDeletePicture = () => {
    setPreviewURL("");
    setImageFile(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Yakin ingin logout?",
      icon: "warning",
      iconColor: "#ef4444",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor:"#6b7280",
      cancelButtonText: "Batal",
      confirmButtonText: "Yes, Logout",
    });

    if (result.isConfirmed) {
      try {
        await signOut(auth);
        toast.success("Berhasil logout.");
        window.location.href = "/";
      } catch (err) {
        toast.error("Gagal logout: " + err.message);
      }
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus akun?",
      text: "Akun akan dihapus secara permanen!",
      icon: "warning",
      iconColor: "#ef4444",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      cancelButtonText: "Batal",
      confirmButtonText: "Ya, Hapus!",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(auth.currentUser);
        toast.success("Akun berhasil dihapus.");
        window.location.href = "/";
      } catch (err) {
        if (err.code === "auth/requires-recent-login") {
          toast.error("Silakan login ulang sebelum menghapus akun.");
        } else {
          toast.error("Gagal menghapus akun: " + err.message);
        }
      }
    }
  };

  return (
    <>
      <HeaderPrivate />
      <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
        <div className="flex flex-col md:flex-row w-full max-w-5xl mt-6 rounded-3xl overflow-hidden bg-white shadow-2xl">

          {/* LEFT SECTION */}
          <div className="w-full md:w-1/3 flex flex-col items-center bg-white">
            <div className="w-full bg-gradient-to-br from-blue-900 to-blue-500 text-white flex flex-col items-center py-10 px-4">
              <div className="relative mb-4">
                <img
                  src={
                    previewURL ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || "User")}&background=0D8ABC&color=fff`
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white"
                />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">
                {user?.displayName || "User"}
              </h2>
            </div>

            <div className="w-full bg-white flex flex-col items-center py-8 gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImageFile(file);
                    setPreviewURL(URL.createObjectURL(file));
                  }
                }}
                className="hidden"
              />

              <button
                onClick={triggerFileInput}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-md transition"
              >
                Choose Profile Picture
              </button>

              <button
                onClick={handleDeletePicture}
                disabled={!previewURL}
                className="border border-black text-black px-5 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Delete Profile Picture
              </button>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="w-full md:w-2/3 p-6 md:p-10 bg-white rounded-b-3xl md:rounded-r-3xl">
            <h2 className="text-3xl font-bold text-black mb-8">Personal Informations</h2>
            <form className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={user?.displayName || ""}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                />
              </div>

              {/* Change Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Change Password</label>
                <div className="flex flex-col gap-3">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                  >
                    Confirm
                  </button>
                </div>
              </div>

              {/* Subscription */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Status Langganan</label>
                <input
                  type="text"
                  placeholder="Premium / Free"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-semibold transition flex-1"
                >
                  Delete My Account
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition flex-1"
                >
                  Logout
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}
