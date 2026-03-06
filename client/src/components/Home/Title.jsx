import React from "react";

const Title = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center text-center mt-10 mb-14 px-6">
      {/* Precision Accent Line */}
      <div className="w-12 h-[1px] bg-emerald-700/30 mb-6" />

      <h2 className="text-4xl sm:text-6xl font-black text-stone-900 tracking-tighter uppercase leading-[0.9]">
        {title}
      </h2>

      <div className="mt-6 max-w-2xl relative">
        {/* Subtle decorative brackets to imply engineering/code */}
        <span className="absolute -left-4 top-0 text-stone-200 font-light text-2xl hidden md:block">
          [
        </span>
        <p className="text-sm md:text-base text-stone-500 font-medium leading-relaxed tracking-tight px-2">
          {description}
        </p>
        <span className="absolute -right-4 top-0 text-stone-200 font-light text-2xl hidden md:block">
          ]
        </span>
      </div>
    </div>
  );
};

export default Title;
