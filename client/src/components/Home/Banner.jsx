import React from "react";
import { Sparkles } from "lucide-react";

const Banner = () => {
  return (
    <div className="w-full py-3 bg-[#f5f5dc] border-b-[3px] border-stone-900 flex justify-center items-center overflow-hidden">
           {" "}
      <div className="flex items-center gap-4">
                {/* Emerald Badge with Neo-brutalist shadow */}       {" "}
        <span className="px-3 py-1 border-2 border-stone-900 rounded-lg text-[10px] font-black uppercase tracking-widest text-white bg-emerald-700 shadow-[3px_3px_0px_0px_rgba(28,25,23,1)]">
                    New Feature        {" "}
        </span>
               {" "}
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-stone-800">
                    <Sparkles size={14} className="text-emerald-600" />
                    Advanced AI Resume Logic Added          {" "}
          <Sparkles size={14} className="text-emerald-600" />       {" "}
        </p>
                {/* Sophisticated Dot Separators */}       {" "}
        <div className="hidden md:flex items-center gap-1 ml-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#556b2f]" />
                    <div className="w-1 h-1 rounded-full bg-[#556b2f]/40" />
                    <div className="w-1 h-1 rounded-full bg-[#556b2f]/20" />   
             {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default Banner;
