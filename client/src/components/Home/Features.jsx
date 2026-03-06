import React, { useState } from "react";
import { Zap, BarChart3, ShieldCheck, FileSpreadsheet } from "lucide-react";
import Title from "./Title"; // Assuming Title also follows the theme

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const featureList = [
    {
      title: "Real-Time Audit",
      desc: "Live document scoring based on proprietary AI logic and modern engineering benchmarks.",
      icon: <BarChart3 className="size-5" />,
    },
    {
      title: "Enterprise Encryption",
      desc: "Bank-grade data protection ensuring your professional history remains private and secure.",
      icon: <ShieldCheck className="size-5" />,
    },
    {
      title: "Audit-Ready Reports",
      desc: "Export comprehensive ATS compatibility reports to refine your job application strategy.",
      icon: <FileSpreadsheet className="size-5" />,
    },
  ];

  return (
    <div
      id="features"
      className="bg-[#FCFAF2] py-24 scroll-mt-12 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        {/* Subtle Badge */}
        <div className="flex items-center gap-2 px-4 py-1 border border-emerald-700/20 rounded-full mb-8">
          <Zap size={12} className="text-emerald-700 fill-emerald-700" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-800">
            Precision Workflow
          </span>
        </div>

        <Title
          title="Engineered for Impact"
          description="A high-performance suite designed to transform your professional narrative into a data-driven document."
        />

        <div className="grid lg:grid-cols-2 gap-16 mt-20 items-center">
          {/* Left Side: Illustration / Image with Frame */}
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-700/5 -rotate-2 rounded-[2rem] border border-stone-900/5 transition-transform group-hover:rotate-0" />
            <div className="relative bg-white border border-stone-900/10 p-4 rounded-[2rem] shadow-sm">
              <img
                className="w-full h-auto rounded-[1.5rem] grayscale group-hover:grayscale-0 transition-all duration-700"
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png"
                alt="System Preview"
              />
            </div>
          </div>

          {/* Right Side: Sophisticated Feature List */}
          <div className="space-y-6">
            {featureList.map((item, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setActiveFeature(idx)}
                className={`relative pl-8 py-8 transition-all duration-500 border-l ${
                  activeFeature === idx
                    ? "border-emerald-700 bg-white shadow-[0px_10px_30px_-15px_rgba(0,0,0,0.05)]"
                    : "border-stone-900/10 hover:border-emerald-700/30"
                }`}
              >
                <div className={`flex gap-6 items-start`}>
                  <div
                    className={`p-3 border rounded-xl transition-colors ${
                      activeFeature === idx
                        ? "bg-emerald-700 text-white border-emerald-700"
                        : "bg-white text-stone-400 border-stone-900/10"
                    }`}
                  >
                    {item.icon}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-stone-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-stone-500 font-medium leading-relaxed max-w-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Micro-Interaction Indicator */}
                {activeFeature === idx && (
                  <div className="absolute top-0 right-0 h-1 w-1 bg-emerald-700 m-4 rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
