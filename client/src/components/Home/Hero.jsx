import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ArrowRight, Menu, X, Sparkles, Zap } from "lucide-react";

const Hero = () => {
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const logos = ["Microsoft", "Google", "Meta", "Apple", "Amazon"];

  return (
    <div className="min-h-screen bg-[#FCFAF2] text-stone-900 selection:bg-emerald-100 overflow-x-hidden">
      {/* --- Sophisticated Navigation --- */}
      <nav className="sticky top-0 z-50 bg-[#FCFAF2]/80 backdrop-blur-md border-b border-stone-900/10 py-6 px-6 md:px-16 lg:px-24 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-emerald-700 border border-stone-900 rounded-xl text-white shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] transition-transform group-hover:-translate-y-0.5">
            <Zap size={18} fill="currentColor" />
          </div>
          <span className="font-black text-2xl tracking-tighter uppercase">
            Resume<span className="text-emerald-700">AI</span>
          </span>
        </Link>

        {/* Desktop Nav links with high tracking */}
        <div className="hidden md:flex items-center gap-10 font-black text-[10px] uppercase tracking-[0.4em] text-stone-400">
          <a
            href="#features"
            className="hover:text-emerald-700 transition-colors"
          >
            Features
          </a>
          <a href="#demo" className="hover:text-emerald-700 transition-colors">
            Architecture
          </a>
          <a
            href="#contact"
            className="hover:text-emerald-700 transition-colors"
          >
            Contact
          </a>
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <Link
              to="/app?state=register"
              className="bg-stone-900 border border-stone-900 text-white px-8 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(5,150,105,0.3)] hover:bg-emerald-700 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
            >
              Get Started
            </Link>
          ) : (
            <Link
              to="/app"
              className="bg-emerald-700 border border-stone-900 text-white px-8 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(28,25,23,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
            >
              Dashboard
            </Link>
          )}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2 text-stone-900"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* --- Hero Content --- */}
      <section className="relative pt-24 pb-32 px-6 flex flex-col items-center text-center">
        {/* Subtle Engineering Grid Pattern */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-10 px-4 py-1.5 bg-white border border-stone-900/20 rounded-full"
        >
          <Sparkles size={12} className="text-emerald-600" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-500">
            Precision Intelligence // Gemini 1.5 Pro
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-9xl font-black tracking-tighter text-stone-900 leading-[0.85] max-w-6xl uppercase"
        >
          Land your dream <br />
          <span className="text-emerald-700 italic underline decoration-stone-900/5 underline-offset-8">
            Job with AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-sm md:text-base text-stone-500 max-w-xl font-bold leading-relaxed uppercase tracking-tight"
        >
          High-performance resume auditing and tailoring{" "}
          <br className="hidden md:block" /> for the modern technical architect.
        </motion.p>

        {/* Tactile CTAs with Thinner Borders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex flex-wrap justify-center gap-6"
        >
          <Link
            to="/app"
            className="group bg-emerald-700 border border-stone-900 text-white px-10 py-5 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-[6px_6px_0px_0px_rgba(28,25,23,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <div className="flex items-center gap-3">
              Initialize Builder
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1.5 transition-transform"
              />
            </div>
          </Link>

          <button className="flex items-center gap-3 bg-white border border-stone-900 px-10 py-5 rounded-xl font-black uppercase tracking-widest text-[11px] text-stone-900 shadow-[6px_6px_0px_0px_rgba(85,107,47,0.15)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            <Play size={16} fill="currentColor" />
            Watch Demo
          </button>
        </motion.div>

        {/* Brand Section */}
        <div className="mt-40 w-full max-w-5xl">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-[1px] flex-grow bg-stone-900/10" />
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-stone-300">
              Validated Infrastructure
            </p>
            <div className="h-[1px] flex-grow bg-stone-900/10" />
          </div>

          <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-20 grayscale contrast-125">
            {logos.map((logo) => (
              <span
                key={logo}
                className="font-black text-xl tracking-tighter text-stone-500"
              >
                {logo.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
