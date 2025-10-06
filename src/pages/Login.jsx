import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  AiOutlineMail,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { CiLock } from "react-icons/ci";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

   const handleLogin = (e) => {
     e.preventDefault();
     if (name && password) {
       navigate("/dashboard");
     } else {
       alert("Please enter both email and password");
     }
   };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-green-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
          Welcome !!!
        </h2>
        <p className="mb-6">Login with your credentials.</p>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div className="flex items-center border border-green-300 rounded-lg px-3 py-2">
            <AiOutlineMail className="text-green-600 text-xl mr-2" />
            <input
              type="name"
              placeholder="Username"
              className="flex-1 outline-none bg-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex items-center border border-green-300 rounded-lg px-3 py-2">
            <CiLock className="text-green-600 text-xl mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="flex-1 outline-none bg-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 text-xl focus:outline-none"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-green-700 to-green-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}
