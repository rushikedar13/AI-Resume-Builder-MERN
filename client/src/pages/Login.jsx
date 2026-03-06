import React, { useState } from "react";
import logo from "../assets/logo.svg";
import { Link, useSearchParams } from "react-router-dom";
import api from "../configs/api";
import { useDispatch } from "react-redux";
import { login } from "../app/features/authSlice";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Sparkles, ArrowRight } from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const state = searchParams.get("state") || "login";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/api/users/${state}`, formData);
      dispatch(login(data));
      localStorage.setItem("token", data.token);
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcf9] flex items-center justify-center p-6 selection:bg-emerald-100">
      {/* Absolute Logo Header */}
      <div className="absolute top-10 left-10 flex items-center gap-3">
        <Link
          to="/"
          className="p-3 bg-white border-2 border-stone-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          <img src={logo} alt="logo" className="h-8 w-auto" />
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[440px] bg-white border-[3px] border-stone-900 rounded-[3rem] p-12 shadow-[12px_12px_0px_0px_rgba(85,107,47,0.2)]"
      >
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <Sparkles size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
              AI Powered Workspace
            </span>
          </div>

          <h1 className="text-4xl font-black text-stone-900 tracking-tight leading-none mb-3">
            {state === "login" ? "Welcome Back." : "Get Started."}
          </h1>
          <p className="text-stone-500 font-bold text-sm">
            {state === "login"
              ? "Enter your credentials to access the audit suite."
              : "Create your account to start building resumes."}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {state !== "login" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <BoldInput
                  icon={<User size={20} />}
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <BoldInput
            icon={<Mail size={20} />}
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <BoldInput
            icon={<Lock size={20} />}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <div className="pt-4 space-y-6">
            <button
              type="submit"
              className="w-full bg-emerald-700 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-[0px_8px_0px_0px_rgba(5,150,105,0.3)] hover:bg-emerald-800 hover:translate-y-[2px] hover:shadow-[0px_4px_0px_0px_rgba(5,150,105,0.3)] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-3 uppercase tracking-wider"
            >
              {state === "login" ? "Sign In" : "Initialize Account"}
              <ArrowRight size={22} />
            </button>

            <div className="flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  setSearchParams({
                    state: state === "login" ? "register" : "login",
                  })
                }
                className="group text-sm font-bold text-stone-400 hover:text-[#556b2f] transition-colors"
              >
                {state === "login" ? "Need an account?" : "Already a member?"}
                <span className="ml-2 text-stone-900 group-hover:underline decoration-[#556b2f] underline-offset-4 decoration-2">
                  {state === "login" ? "Join the Waitlist" : "Log In instead"}
                </span>
              </button>

              <div className="w-16 h-1 bg-stone-100 rounded-full" />

              <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.3em]">
                Verified Secured Session
              </p>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const BoldInput = ({ icon, ...props }) => {
  return (
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-emerald-600 transition-colors">
        {icon}
      </div>
      <input
        {...props}
        className="w-full bg-stone-100 border-2 border-transparent p-5 pl-14 rounded-2xl outline-none font-bold text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-emerald-600 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)] transition-all"
        required
      />
    </div>
  );
};

export default Login;
