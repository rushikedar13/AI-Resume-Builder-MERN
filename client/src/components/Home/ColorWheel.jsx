import { Check, PaletteIcon, ChevronDown } from "lucide-react";
import { useState } from "react";

const ColorWheel = ({ selectedColor, onChange }) => {
  const colors = [
    { name: "Blue", value: "#3B82F6" },
    { name: "Teal", value: "#14B8A6" },
    { name: "Green", value: "#10B981" },
    { name: "Gray", value: "#6B7280" },
    { name: "Red", value: "#FF0000" },
    { name: "Black", value: "#000000" },
    { name: "Orange", value: "#FFA500" },
    { name: "HotPink", value: "#FF69B4" },
  ];
  const [isOpen, setisOpen] = useState(false);

  return (
    <div className="relative">
      {/* Precision Trigger Button */}
      <button
        onClick={() => setisOpen(!isOpen)}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-800 bg-white border border-stone-900 px-4 py-2 rounded-lg shadow-[3px_3px_0px_0px_rgba(28,25,23,0.1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
      >
        <PaletteIcon size={14} className="text-emerald-700" />
        <span className="max-sm:hidden">Accent Palette</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-64 p-4 z-[100] bg-[#FCFAF2] border border-stone-900 rounded-xl shadow-[8px_8px_0px_0px_rgba(28,25,23,0.05)]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-900/10">
            <span className="text-[9px] font-black uppercase tracking-widest text-stone-400">
              Select Accent
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="grid grid-cols-4 gap-3">
            {colors.map((color) => (
              <div
                key={color.value}
                className="relative cursor-pointer group flex flex-col items-center"
                onClick={() => {
                  onChange(color.value);
                  setisOpen(false);
                }}
              >
                {/* Color Swatch */}
                <div
                  className="w-10 h-10 rounded-lg border border-stone-900/10 group-hover:border-stone-900 transition-all flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: color.value }}
                >
                  {selectedColor === color.value && (
                    <div className="bg-black/20 w-full h-full flex items-center justify-center backdrop-blur-[1px]">
                      <Check className="size-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Micro Label */}
                <p className="text-[8px] font-bold uppercase tracking-tighter mt-1.5 text-stone-500">
                  {color.name}
                </p>

                {/* Active Indicator Dot */}
                {selectedColor === color.value && (
                  <div className="mt-1 w-1 h-1 rounded-full bg-stone-900" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorWheel;
