import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function RegisterForm({ onSwitchForm }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [bgImage, setBgImage] = useState("/images/cloud-bg.png");

  // Detect screen width and switch background
  useEffect(() => {
    const updateBg = () => {
      setBgImage(window.innerWidth < 768
        ? "/images/cloud-bg-mobile.png"
        : "/images/cloud-bg.png");
    };
    updateBg(); // run once on mount
    window.addEventListener("resize", updateBg);
    return () => window.removeEventListener("resize", updateBg);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: username,
      })

      toast.success("Register berhasil! Silahkan login.");
      onSwitchForm();
    } catch (err) {
      toast.error("Register gagal: " + err.message);
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${bgImage})` }}
      className="w-full md:w-3/5 bg-cover bg-center bg-no-repeat bg-blue-600 flex flex-col justify-center items-center px-6 md:px-12 py-10 min-h-screen"
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 bg-transparent placeholder-gray-400 text-lg focus:outline-none"
              />
              <FaUser className="text-black" />
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
              <FaEnvelope className="text-black" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-lg font-semibold text-black">Password</label>
            <div className="flex items-center border-b border-gray-400 py-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent placeholder-gray-400 text-lg focus:outline-none"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <FaEyeSlash className="text-black" />
                ) : (
                  <FaEye className="text-black" />
                )}
              </button>
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
