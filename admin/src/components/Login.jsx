import { useState } from "react";
import { motion as Motion } from "framer-motion";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaBook } from "react-icons/fa";
import apiClient from "../api/client";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await apiClient.post("/api/admin/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));
      toast.success("Login Successful 🎉");
      onLogin(data.admin);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 flex justify-center items-center p-4">
        <Motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 w-[400px]"
        >
            <div className="flex justify-center mb-4">
                <FaBook className="text-white" size={45} />
            </div>

            <h1 className="text-3xl font-bold text-center text-white mb-2">
                SellBook Admin
            </h1>

            <p className="text-center text-gray-200 mb-6">
                Welcome Back 👋
            </p>

            <form onSubmit={handleSubmit}>

                <div className="mb-4">
                    <label className="block mb-2 font-medium">
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter Admin Email"
                        className="w-full border rounded-lg p-3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-6 relative">
                    <label className="block mb-2 font-medium">
                        Password
                    </label>

                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        className="w-full border rounded-lg p-3 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-11"
                    >
                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white py-3 rounded-lg font-semibold transition duration-300"
                    >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>
        </Motion.div>
    </div>
  );
}

export default Login;
