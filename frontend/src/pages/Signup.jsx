import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";

import config from "../config";

export default function Signup() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isSubmitting) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isSubmitting, navigate]);

  async function handleSignup(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${config.API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        alert("Server returned an invalid response");
        console.error("Invalid response:", await res.text());
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        setIsSubmitting(false);
        return;
      }

      if (data.token) {
        login(data.token, data.user);
        navigate('/welcome');
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Unable to reach server.");
      setIsSubmitting(false);
    }
  }


  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root font-display bg-white dark:bg-black">
      <ThemeToggle />
      <div className="flex flex-1 w-full">
        <div className="flex flex-col md:flex-row flex-1">
          
          <div className="hidden lg:flex flex-1 bg-white dark:bg-black items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50"></div>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-900/50 dark:from-white dark:to-white/50 relative z-10 font-display select-none p-4">
              SKILLSYNC
            </h1>
          </div>
          
          <div className="w-full lg:w-2/5 flex flex-col justify-center items-center p-8 sm:p-12 bg-white dark:bg-black transition-colors duration-300">
            <div className="w-full max-w-md">

              
              <h1 className="text-gray-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight text-left pb-2">
                Create Account
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">Join SkillSync to start tracking your skills.</p>

              <form onSubmit={handleSignup}>
                
                <div className="flex flex-col gap-4 mb-5">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-gray-900 dark:text-white text-sm font-semibold leading-normal pb-2">Full Name</p>
                    <div className="flex w-full flex-1 items-center rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/50 transition-all duration-200 ease-in-out bg-white dark:bg-[#193322] h-14 hover:border-gray-400 dark:hover:border-gray-500">
                      <input
                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden text-gray-900 dark:text-white focus:outline-none focus:ring-0 focus:border-none border-none shadow-none focus:shadow-none bg-transparent h-full placeholder:text-gray-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                        placeholder="Enter your full name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </label>
                </div>

                
                <div className="flex flex-col gap-4 mb-5">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-gray-900 dark:text-white text-sm font-semibold leading-normal pb-2">Email Address</p>
                    <div className="flex w-full flex-1 items-center rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/50 transition-all duration-200 ease-in-out bg-white dark:bg-[#193322] h-14 hover:border-gray-400 dark:hover:border-gray-500">
                      <input
                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden text-gray-900 dark:text-white focus:outline-none focus:ring-0 focus:border-none border-none shadow-none focus:shadow-none bg-transparent h-full placeholder:text-gray-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                        placeholder="Enter your email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </label>
                </div>

                
                <div className="flex flex-col gap-4 mb-8">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-gray-900 dark:text-white text-sm font-semibold leading-normal pb-2">Password</p>
                    <div className="flex w-full flex-1 items-center rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/50 transition-all duration-200 ease-in-out bg-white dark:bg-[#193322] h-14 hover:border-gray-400 dark:hover:border-gray-500">
                      <input
                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden text-gray-900 dark:text-white focus:outline-none focus:ring-0 focus:border-none border-none shadow-none focus:shadow-none bg-transparent h-full placeholder:text-gray-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                        placeholder="Create a password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        aria-label="Toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 dark:text-gray-400 flex items-center justify-center px-4 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200 h-full focus:outline-none focus:ring-0 focus:border-none border-none shadow-none focus:shadow-none"
                      >
                        <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </label>
                </div>

                
                <div className="w-full mb-6">
                  <button
                    type="submit"
                    className="flex items-center justify-center text-center font-bold transition-all duration-200 ease-in-out w-full h-14 rounded-xl bg-[#13ec5b] text-[#102216] hover:bg-[#0fd450] hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary/20"
                  >
                    Sign Up
                  </button>
                </div>
              </form>

              
              <p className="text-center text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link className="font-bold text-primary dark:text-primary hover:underline transition-all duration-200" to="/login">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
