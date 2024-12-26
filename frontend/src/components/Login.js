import React, { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { BsFillEyeFill } from "react-icons/bs";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import ENDPOINT from "../common";
import { toast } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const loginUser = async (userDetails) => {
    try {
      const res = await fetch(ENDPOINT.auth.login, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.endsWith("@gmail.com")) {
      toast.error("Please provide valid email");
    } else {
      const userDetails = {
        email,
        password,
      };
      loginUser(userDetails);
    }
  };

  return (
    <section
      id="login"
      className="w-full h-[100vh] flex justify-center items-center py-12 md:py-16 bg-slate-50"
    >
      <div className="bg-white px-4 md:px-8 py-8 md:py-10 rounded-2xl w-[90vw] md:w-[32vw] shadow-lg">
        <div className="w-full flex justify-center">
          <FaRegUserCircle className="h-32 w-40 text-blue-700" />
        </div>
        <form className="w-full" onSubmit={handleSubmit}>
          <label className="block text-gray-900 font-semibold text-md">
            Email :
          </label>
          <input
            type="text"
            className="h-9 w-full mt-1 outline-none border border-gray-300 rounded-lg px-3 pb-0.5"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block text-gray-900 font-semibold text-md mt-4">
            Password :
          </label>
          <div className="flex items-center relative">
            <input
              type={showPassword ? "text" : "password"}
              className="h-9 w-full mt-1 outline-none border border-gray-300 rounded-lg pl-3 pr-14 pb-0.5"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {showPassword ? (
              <BsFillEyeSlashFill
                className="h-5 w-5 absolute right-5 mt-1"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <BsFillEyeFill
                className="h-5 w-5 absolute right-5 mt-1"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          <p className="text-end w-full mt-1">
            <span className="font-semibold text-md hover:text-red-500 hover:underline text-gray-900 cursor-pointer">
              Forget Password ?
            </span>
          </p>

          <button
            type="submit"
            className="bg-blue-500 rounded-full px-8 pb-1.5 pt-1 text-white mx-auto block mt-4 md:mt-2 hover:bg-blue-700 hover:scale-110 transition-all"
          >
            Login
          </button>
          <div className="text-center md:text-left">
            <p className="text-gray-900 font-semibold text-md mt-4">
              Don't have an account ?{" "}
              <Link to="/signup" className="hover:text-red-500 hover:underline">
                Sign up{" "}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
