import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useState } from "react";

export default function RegisterForm({ onSwitchForm }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Register berhasil!");
    } catch (err) {
      alert("Gagal register: " + err.message);
    }
  };  

  return (
    <div
      style={{ backgroundImage: "url('/images/cloud-bg.png')" }}
      className="w-full md:w-3/5 bg-cover bg-center bg-blue-600 flex flex-col justify-center items-center px-6 md:px-12 py-10 min-h-screen"
    >
      <div className="w-full max-w-md md:ml-64">
        <h2 className="text-2xl font-bold text-black mb-1">Hi Skyper!</h2>
        <h1 className="text-5xl font-bold text-black mb-4">Create Account</h1>
        <p className="text-sm text-gray-600 mb-10">
          Let’s create personal notes or collaborate with friends quickly and easily!
        </p>

        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          {/* Username */}
          <div>
            <label className="text-lg font-semibold text-black">Username</label>
            <div className="flex items-center border-b border-gray-400 py-2">
              <input
                type="text"
                placeholder="Enter Your username"
                className="flex-1 bg-transparent placeholder-gray-400 text-lg focus:outline-none"
              />
              <FaUser className="text-gray-500" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-lg font-semibold text-black">Email</label>
            <div className="flex items-center border-b border-gray-400 py-2">
              <input
                type="email"
                placeholder="Enter Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent placeholder-gray-400 text-lg focus:outline-none"
              />
              <FaEnvelope className="text-gray-500" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-lg font-semibold text-black">Password</label>
            <div className="flex items-center border-b border-gray-400 py-2">
              <input
                type="password"
                placeholder="Enter Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent placeholder-gray-400 text-lg focus:outline-none"
              />
              <FaLock className="text-gray-500" />
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="text-white font-semibold py-3 mt-5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 transition"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm mt-6 text-black">
          Already have an account?{" "}
          <button
          type="button"
          onClick={onSwitchForm}
          className="font-bold hover:underline"
        >
          Login
          </button>
        </p>

      </div>
    </div>
  );
}
