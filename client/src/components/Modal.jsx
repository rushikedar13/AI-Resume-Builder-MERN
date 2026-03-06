import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ title, children, onClose }) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-[#fcfcf9] border-[3px] border-stone-900 rounded-[2.5rem] shadow-[12px_12px_0px_0px_rgba(28,25,23,1)] overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b-[3px] border-stone-900 flex justify-between items-center bg-white">
            <h3 className="text-xl font-black text-stone-900 uppercase tracking-tight">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-100 rounded-xl border-2 border-transparent hover:border-stone-900 transition-all"
            >
              <X size={24} className="text-stone-900" />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Modal;
