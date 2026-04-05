import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineMail,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { CiLock } from "react-icons/ci";
import { getUser, loginUser } from "../store/features/authSlice";
import toast from "react-hot-toast";
import loginBgImg from "../assets/images/loginBg.png"



export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const { error, loading } = useSelector((store) => store.auth);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username) {
      toast.error("Username should not be empty");
      return;
    }

    if (!password) {
      toast.error("Password should not be empty");
      return;
    }

    try {
      const resultAction = await dispatch(loginUser({ username, password }));

      if (loginUser.fulfilled.match(resultAction)) {
        await dispatch(getUser());
        navigate("/dashboard", { replace: true });
        toast.success("Login successful");
      } else {
        // Show the error in a toast
        const errorMsg = resultAction.payload || "Login failed";
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  
return (
  <div
    className="min-h-screen flex items-center justify-center"
    style={{
      backgroundImage: `url(${loginBgImg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    <div className="relative w-full max-w-5xl h-[500px]">
      {/* RIGHT SIDE - GREEN PANEL */}
      <div className="absolute right-0 top-0 w-2/3 h-full bg-gradient-to-br from-green-800/80 via-green-700/70 to-green-600/70 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white">
        {/* <div className="absolute inset-0 bg-black/10 rounded-2xl"></div> */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-wide mb-3">Welcome</h1>

          <p className="text-sm uppercase tracking-wider text-white/80 mb-2">
            Budget Implementation Tracking System
          </p>
          <p className="text-sm text-white/70">
            Enter your username and password to login!!!
          </p>
        </div>
      </div>

      {/* LEFT SIDE - LOGIN */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[40%] bg-white p-8 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.25)] z-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Login please
        </h2>

        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
          {/* Username */}
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 focus-within:border-green-500">
            <AiOutlineMail className="text-green-600 text-xl mr-2" />
            <input
              type="text"
              placeholder="Enter your username"
              className="flex-1 outline-none bg-transparent text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 focus-within:border-green-500">
            <CiLock className="text-green-700 text-xl mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="flex-1 outline-none bg-transparent text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 text-lg"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember me
            </label>
            <span className="text-green-600 cursor-pointer hover:underline">
              Forgot Password?
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-300 text-white py-2 rounded-lg font-semibold"
          >
            LOG IN
          </button>
        </form>
      </div>
    </div>
  </div>
);

  // return (
  //   <div className="flex flex-col gap-6 items-center justify-center min-h-screen p-6 bg-green-50">
  //     <h2 className="text-2xl md:text-3xl font-bold text-green-800 tracking-wide text-center mb-4">
  //       BUDGET IMPLEMENTATION TRACKING SYSTEM
  //     </h2>
  //     <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
  //       <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
  //         Welcome !!!
  //       </h2>
  //       <p className="mb-6">Login with your credentials.</p>

  //       <form className="flex flex-col gap-4" onSubmit={handleLogin}>
  //         {/* {error && (
  //           <div style={{ color: "tomato", fontSize: "16px" }}>{error}</div>
  //         )} */}
  //         <div className="flex items-center border border-green-300 rounded-lg px-3 py-2">
  //           <AiOutlineMail className="text-green-600 text-xl mr-2" />
  //           <input
  //             type="name"
  //             placeholder="Username"
  //             className="flex-1 outline-none bg-transparent"
  //             value={username}
  //             onChange={(e) => setUsername(e.target.value)}
  //           />
  //         </div>

  //         <div className="flex items-center border border-green-300 rounded-lg px-3 py-2">
  //           <CiLock className="text-green-600 text-xl mr-2" />
  //           <input
  //             type={showPassword ? "text" : "password"}
  //             placeholder="Password"
  //             className="flex-1 outline-none bg-transparent"
  //             value={password}
  //             onChange={(e) => setPassword(e.target.value)}
  //           />
  //           <button
  //             type="button"
  //             onClick={() => setShowPassword(!showPassword)}
  //             className="text-gray-400 text-xl focus:outline-none"
  //           >
  //             {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
  //           </button>
  //         </div>

  //         <button
  //           type="submit"
  //           className="bg-gradient-to-r from-green-700 to-green-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
  //         >
  //           LOGIN
  //         </button>
  //       </form>
  //     </div>

  //     {/* <Toaster
  //             position="top-right"
  //             toastOptions={{
  //               duration: 3000,
  //               style: {
  //                 background: "#16a34a",
  //                 color: "#fff",
  //                 fontWeight: "600",
  //                 borderRadius: "8px",
  //               },
  //               error: {
  //                 style: { background: "#dc2626" },
  //               },
  //             }}
  //           /> */}
  //   </div>
  // );
}
