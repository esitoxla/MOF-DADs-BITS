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
import loginBgImg from "../assets/images/loginBg.png";
import loginImg from "../assets/images/LoginPage.jpeg";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-0"
      style={{
        backgroundImage: `url(${loginImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div className="relative w-full max-w-5xl h-[600px] sm:h-[650px] lg:h-[500px]">
        {/* RIGHT SIDE - GREEN PANEL */}
        <div
          className="
        absolute
        left-1/2 top-[54%] sm:top-[60%] 
        -translate-x-1/2 -translate-y-1/2

        w-full max-w-[500px]
        h-[520px]

        sm:max-w-[600px]

        lg:left-auto lg:right-0 lg:top-1/2
        lg:translate-x-0 lg:-translate-y-1/2
        lg:w-2/3 lg:max-w-none lg:h-full

        rounded-2xl
        flex items-start lg:items-center
        justify-center
        text-white
        overflow-hidden
      "
          style={{
            backgroundImage: `url(${loginBgImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute top-5 sm:top-8 lg:static text-center px-5">
            <h1 className="text-xl sm:text-2xl uppercase text-white mb-2">
              Welcome !!!!
            </h1>

            <p className="text-lg sm:text-2xl text-white font-bold mb-3">
              Budget Implementation Tracking System
            </p>

            <p className="text-lg sm:text-2xl text-white">
              MINISTRY OF FINANCE
            </p>
          </div>
        </div>

        {/* LEFT SIDE - LOGIN */}
        <div
          className="
        absolute
        left-1/2 top-2/3
        -translate-x-1/2 -translate-y-1/2

        w-[90%]
        max-w-[400px]

        sm:w-[75%]
        sm:max-w-[430px]

        lg:left-0 lg:top-1/2
        lg:translate-x-0 lg:-translate-y-1/2
        lg:w-[40%]
        lg:max-w-none

        bg-white
        p-5 sm:p-8
        rounded-2xl
        shadow-[0_25px_70px_rgba(0,0,0,0.25)]
        z-10
      "
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Login please
          </h2>

          <form className="flex flex-col gap-5" onSubmit={handleLogin}>
            {/* Username */}
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 focus-within:border-green-500">
              <AiOutlineMail className="text-green-600 text-xl mr-2 shrink-0" />

              <input
                type="text"
                placeholder="Enter your username"
                className="flex-1 min-w-0 outline-none bg-transparent text-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 focus-within:border-green-500">
              <CiLock className="text-green-700 text-xl mr-2 shrink-0" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="flex-1 min-w-0 outline-none bg-transparent text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 text-lg shrink-0"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
              <label className="flex items-center gap-2 whitespace-nowrap">
                <input type="checkbox" />
                Remember me
              </label>

              <span className="text-green-600 cursor-pointer hover:underline whitespace-nowrap">
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
