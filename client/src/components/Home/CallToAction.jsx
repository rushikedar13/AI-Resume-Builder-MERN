import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const CallToAction = () => {
  return (
    <div className="bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto border-[3px] border-stone-900 bg-white rounded-[3rem] p-10 md:p-16 shadow-[16px_16px_0px_0px_rgba(85,107,47,0.2)] relative overflow-hidden">
        {/* Decorative Corner Element */}
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles size={120} className="text-[#556b2f]" />
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700">
                Ready to Deploy
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 leading-tight max-w-md uppercase tracking-tighter">
              Build a Resume That <br />
              <span className="text-emerald-700 italic">Stands Out</span> and
              Gets Hired
            </h2>
            <p className="text-stone-400 font-bold text-sm uppercase tracking-wider">
              Join 500+ professionals using AI logic.
            </p>
          </div>

          <Link
            to="/app"
            className="group flex items-center gap-3 rounded-2xl py-6 px-12 bg-emerald-700 text-white font-black uppercase tracking-widest text-lg shadow-[0px_8px_0px_0px_rgba(5,150,105,0.3)] hover:bg-emerald-800 hover:translate-y-[2px] hover:shadow-[0px_4px_0px_0px_rgba(5,150,105,0.3)] active:translate-y-[4px] active:shadow-none transition-all"
          >
            <span>Get Started</span>
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
