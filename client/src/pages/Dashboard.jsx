import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FilePenIcon,
  PlusIcon,
  UploadCloudIcon,
  LoaderCircle,
  XIcon,
  TrashIcon,
  LeafIcon,
  SparklesIcon,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";
import ATSResultsUI from "../components/ATSResultsUI";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Data & UI States
  const [allResumes, setAllResumes] = useState([]);
  const [atsData, setAtsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);
  const [targetJD, setTargetJD] = useState("");
  const [showTailorModal, setShowTailorModal] = useState(false);
  const [resumeToTailor, setResumeToTailor] = useState(null);

  // Modal States
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [showATSModal, setShowATSModal] = useState(false);

  // Form States
  const [title, setTitle] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [atsResumeFile, setAtsResumeFile] = useState(null);

  // const user = useUser();
  // const userId = user?.id;

  // Animation Config
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  // --- LOGIC ---
  const loadAllResume = useCallback(async () => {
    try {
      const { data } = await api.get("/api/users/resumes");
      setAllResumes(data.resumes || []);
    } catch (error) {
      toast.error("Failed to load resumes");
    }
  }, []);

  useEffect(() => {
    if (token) loadAllResume();
  }, [token, loadAllResume]);

  const handleCheckATS = async (e) => {
    e.preventDefault();
    if (!atsResumeFile || !jobDescription.trim())
      return toast.error("Provide CV and JD");
    setIsLoading(true);
    try {
      const rawText = await pdfToText(atsResumeFile);
      const cleanText = rawText
        .replace(/[\n\r]+/g, " ") // Replace newlines with spaces first
        .replace(/\s{2,}/g, " ") // Then collapse multiple spaces into one
        .trim();
      const { data } = await api.post("/api/ai/check-ats", {
        jobDescription,
        cvText: cleanText,
      });
      setAtsData(data.analysis);
      setShowATSModal(false);
      toast.success("Analysis Complete!");
    } catch (err) {
      toast.error(err.message || "Analysis failed");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadResume = async (e) => {
    e.preventDefault();
    if (!title.trim() || !resumeFile)
      return toast.error("Title and File required");

    setIsLoading(true);
    try {
      const extractedText = await pdfToText(resumeFile);

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error(
          "Could not extract text from this PDF. Is it a scanned image?",
        );
      }

      const { data } = await api.post("/api/ai/upload-resume", {
        title: title.trim(),
        resumeText: extractedText,
      });

      const newextractedText = await pdfToText(resumeFile);
      console.log("--- RAW TEXT SENT TO AI ---");
      console.log(newextractedText);

      if (data?.resumeId) {
        toast.success("Resume imported!");
        setShowUploadResume(false);
        navigate(`/app/builder/${data.resumeId}`);
      }
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  const createResume = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Enter a title");
    try {
      const { data } = await api.post("/api/resumes/create", {
        title: title.trim(),
      });
      navigate(`/app/builder/${data.resume._id}`);
    } catch (err) {
      toast.error("Creation failed");
    }
  };

  const deleteResume = async (id) => {
    if (!window.confirm("Delete this resume?")) return;
    try {
      await api.delete(`/api/resumes/delete/${id}`);
      setAllResumes((prev) => prev.filter((r) => r._id !== id));
      toast.success("Deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const createTailoredResume = async (
    aiParsedData,
    selectedResume,
    newTitle,
  ) => {
    try {
      // 1. Prepare the Payload
      // We spread aiParsedData so that 'experience', 'skills', etc.
      // are at the top level, matching your Mongoose Schema.
      const newResumePayload = {
        ...aiParsedData,
        title: newTitle,
        userId: user?._id || user?.id || selectedResume.userId,
        template: selectedResume.template || "classic",
        accent_color: selectedResume.accent_color || "#3B82F6",
      };

      // 2. The "Fresh Start" Cleanup
      // We must remove the old ID and timestamps so MongoDB generates NEW ones.
      delete newResumePayload._id;
      delete newResumePayload.createdAt;
      delete newResumePayload.updatedAt;

      console.log("Final Payload being sent to DB:", newResumePayload);

      // 3. Send to Backend
      const { data: saveResponse } = await api.post(
        "/api/resumes/create",
        newResumePayload,
      );

      // 1. Check if the save was successful
      if (saveResponse.resume || saveResponse._id) {
        // 2. Extract the ID (Backends often nest the object under a 'resume' key)
        const newResumeId = saveResponse.resume?._id || saveResponse._id;

        toast.success("New tailored version saved!");
        setShowTailorModal(false);

        // 3. Navigate to the builder
        // IMPORTANT: Ensure this path matches your Route path in App.jsx
        navigate(`/app/builder/${newResumeId}`);
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to save the tailored data.");
    }
  };

  // ✅ Use your React state variables
  // ✅ Accept 'selectedResume' as a parameter
  const handleTailor = async (selectedResume) => {
    // 1. Check if the function even starts
    // console.log("--- TAILOR PROCESS STARTED ---");
    // alert("Function Triggered!");

    if (!selectedResume) {
      console.error("Error: selectedResume is null or undefined");
      return toast.error("Please select a resume first");
    }

    if (!targetJD.trim()) {
      console.error("Error: targetJD is empty");
      return toast.error("Please paste a Job Description!");
    }

    setIsTailoring(true);
    console.log("Sending to Backend:", { selectedResume, targetJD });

    const newTitle = prompt(
      "Enter a title for your tailored resume:",
      "Software Developer - Tailored",
    );

    if (!newTitle) return;

    try {
      const { data: aiResponse } = await api.post("/api/ai/tailor", {
        resumeData: selectedResume,
        jobDescription: targetJD,
      });

      if (aiResponse.success || aiResponse.tailoredContent) {
        // 1. Correctly parse the data
        const tailoredData =
          typeof aiResponse.tailoredContent === "string"
            ? JSON.parse(aiResponse.tailoredContent)
            : aiResponse.tailoredContent;

        await createTailoredResume(tailoredData, selectedResume, newTitle);

        // 2. Build the payload using the parsed data (tailoredData)
        const newResumePayload = {
          userId: user?._id || user?.id || selectedResume.userId,
          title: newTitle,
          template: selectedResume.template,
          ...tailoredData, // Spread the actual AI results here
        };

        // 3. Remove metadata that belongs to the old resume
        delete newResumePayload._id;
        delete newResumePayload.createdAt;
        delete newResumePayload.updatedAt;

        const { data: saveResponse } = await api.post(
          "/api/resumes/create",
          newResumePayload,
        );

        if (saveResponse.resume || saveResponse._id) {
          setShowTailorModal(false);
          const newId = saveResponse.resume?._id || saveResponse._id;
          navigate(`/app/builder/${newId}`);
          toast.success("New tailored resume created!");
        }
      }
    } catch (error) {
      console.error("Tailoring Error:", error.response?.data || error.message);

      // Specifically alert the user about the AI format issue
      if (error.response?.status === 400) {
        toast.error(
          "AI had a formatting hiccup. Please try clicking 'Tailor' again.",
        );
      } else {
        toast.error("Something went wrong. Check console.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcf9] text-stone-800 font-sans selection:bg-emerald-100">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Bold Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14"
        >
          <div className="flex items-center gap-2 mb-3">
            <SparklesIcon size={18} className="text-emerald-500" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600/70">
              MERN Stack AI Auditor
            </span>
          </div>
          <h1 className="text-5xl font-black text-stone-900 leading-tight mb-4">
            Welcome back, <br />
            <span className="text-emerald-700 underline decoration-emerald-200 underline-offset-8">
              {user?.name || "Designer"}
            </span>
          </h1>
          <p className="text-lg text-stone-500 max-w-xl font-medium">
            Analyze, tailor, and refine your resumes using advanced AI logic.
          </p>
        </motion.div>

        {/* High-Contrast Action Cards */}
        <motion.div
          variants={containerVars}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          <ActionCard
            title="Create New"
            desc="Start with a blank canvas"
            icon={<PlusIcon size={28} />}
            onClick={() => setShowCreateResume(true)}
            variant="emerald"
          />
          <ActionCard
            title="Upload PDF"
            desc="AI will extract your data"
            icon={<UploadCloudIcon size={28} />}
            onClick={() => setShowUploadResume(true)}
            variant="olive"
          />

          <ActionCard
            title="ATS Audit"
            desc="Check your match score"
            icon={
              <LoaderCircle
                size={28}
                className={isLoading ? "animate-spin" : ""}
              />
            }
            onClick={() => setShowATSModal(true)}
            variant="cherry"
          />
          <ActionCard
            title="AI Tailor"
            desc="Match your latest resume to a JD"
            icon={<SparklesIcon size={28} />}
            onClick={() => {
              if (allResumes.length === 0)
                return toast.error("Create a resume first!");
              setResumeToTailor(allResumes[0]); // Picks the most recent one
              setShowTailorModal(true);
            }}
            variant="moss"
          />
        </motion.div>

        {/* Subtle Documents Grid */}
        <div className="flex items-end justify-between mb-8 border-b-2 border-stone-100 pb-4">
          <h2 className="text-xl font-black uppercase tracking-tighter text-stone-900">
            Recent Documents
          </h2>
          <span className="text-sm font-bold text-stone-400">
            {allResumes.length} total
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {allResumes.map((res) => (
            <motion.div
              whileHover={{
                y: -8,
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.05)",
              }}
              key={res._id}
              className="bg-white border-2 border-stone-100 p-7 rounded-[2rem] relative group cursor-pointer transition-all"
              onClick={() => navigate(`/app/builder/${res._id}`)}
            >
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mb-6">
                <FilePenIcon size={24} />
              </div>
              <h3 className="font-black text-lg text-stone-800 truncate mb-1">
                {res.title}
              </h3>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Modified {new Date(res.updatedAt).toLocaleDateString()}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteResume(res._id);
                }}
                className="absolute top-6 right-6 p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <TrashIcon size={18} />
              </button>
            </motion.div>
          ))}
        </div>

        {atsData && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-20 no-print"
          >
            {/* Neobrutalist Container to match your Editor */}
            <div className="bg-white border-4 border-emerald-600/10 rounded-[3rem] p-10">
              <div className="p-1">
                <ATSResultsUI data={atsData} onClear={() => setAtsData(null)} />
              </div>
            </div>
          </motion.section>
        )}
      </main>

      <AnimatePresence>
        {/* Create Modal */}
        {showCreateResume && (
          <Modal title="Create New" onClose={() => setShowCreateResume(false)}>
            <div className="space-y-6">
              <input
                className="w-full p-5 rounded-2xl bg-stone-100 border-2 border-transparent focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold"
                placeholder="Give it a bold title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button
                onClick={createResume}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 transition-transform active:scale-95"
              >
                CONTINUE
              </button>
            </div>
          </Modal>
        )}

        {/* Upload Modal */}
        {showUploadResume && (
          <Modal
            title="Upload Resume"
            onClose={() => setShowUploadResume(false)}
          >
            <div className="space-y-6">
              <input
                className="w-full p-5 rounded-2xl bg-stone-100 border-2 border-transparent focus:border-emerald-500 focus:bg-white transition-all outline-none font-bold"
                placeholder="Resume Title (e.g. Frontend Engineer)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="p-5 border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="w-full text-sm font-bold text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
                />
              </div>
              <button
                onClick={uploadResume}
                disabled={isLoading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 transition-transform active:scale-95 disabled:bg-stone-300"
              >
                {isLoading ? "EXTRACTING TEXT..." : "IMPORT RESUME"}
              </button>
            </div>
          </Modal>
        )}

        {/* ATS Modal */}
        {showATSModal && (
          <Modal title="ATS Audit" onClose={() => setShowATSModal(false)}>
            <div className="space-y-5">
              <textarea
                className="w-full h-44 p-5 rounded-2xl bg-stone-200 border-2 border-transparent focus:border-emerald-500 focus:bg-white transition-all outline-none font-medium resize-none"
                placeholder="Paste the Job Description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <div className="p-5 border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setAtsResumeFile(e.target.files[0])}
                  className="w-full text-sm font-bold text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
                />
              </div>
              <button
                onClick={handleCheckATS}
                disabled={isLoading}
                className="w-full bg-stone-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl transition-all hover:bg-emerald-700 disabled:bg-stone-300"
              >
                {isLoading ? "ANALYZING DATA..." : "RUN AI SCAN"}
              </button>
            </div>
          </Modal>
        )}

        {showTailorModal && (
          <Modal
            title="AI Magic Tailor"
            onClose={() => setShowTailorModal(false)}
          >
            <div className="space-y-5">
              <div className="flex items-center gap-2 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <SparklesIcon size={18} className="bg-teal-100" />
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Groq is ready to rewrite
                </p>
              </div>

              <textarea
                className="w-full h-48 p-5 rounded-2xl bg-stone-100 border-2 border-transparent focus:border-emerald-500 focus:bg-white transition-all outline-none font-medium resize-none"
                placeholder="Paste the Job Description you want to target..."
                value={targetJD}
                onChange={(e) => setTargetJD(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowTailorModal(false)}
                  className="py-4 rounded-2xl font-black text-shadow-black-400 hover:bg-black-50 transition-colors"
                >
                  CANCEL
                </button>
                {/* Inside your showTailorModal block */}
                <button
                  onClick={() => handleTailor(resumeToTailor)} // Use the state variable here
                  disabled={isTailoring}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-emerald-800 transition-all disabled:bg-stone-300"
                >
                  {isTailoring ? (
                    <LoaderCircle className="animate-spin" size={24} />
                  ) : (
                    <>
                      {" "}
                      OPTIMIZE NOW <ArrowRight size={20} />{" "}
                    </>
                  )}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Bolder UI Helpers ---
const ActionCard = ({ title, desc, icon, onClick, variant }) => {
  const styles = {
    // --- Original Bold Variants ---
    emerald:
      "bg-emerald-700 text-white shadow-emerald-700/40 hover:bg-emerald-800 border border-emerald-900/30",
    olive:
      "bg-[#556B2F] text-white shadow-[#556B2F]/40 hover:bg-[#4A5D29] border border-[#3A4A20]/40",
    stone:
      "bg-stone-100 text-stone-800 shadow-stone-900/10 hover:bg-stone-200 border border-stone-300/60",

    // --- New Subtle "Sage-Style" Variants ---
    sage: "bg-[#F1F3F2] text-[#3E4A44] shadow-[#8DA399]/40 hover:bg-[#E7EAE9] border border-[#C5CFC9]/50",
    clay: "bg-[#F9F5F2] text-[#704F44] shadow-[#BC8A7A]/30 hover:bg-[#F2EBE6] border border-[#D4C4BC]/50",
    slate:
      "bg-[#F2F4F7] text-[#37474F] shadow-[#78909C]/30 hover:bg-[#E5E9F0] border border-[#CFD8DC]/50",
    sand: "bg-[#F7F6F0] text-[#5F5B4D] shadow-[#A69F88]/30 hover:bg-[#EFECE0] border border-[#D4D0C2]/50",
    mint: "bg-[#F2F8F5] text-[#2D4A3E] shadow-[#A7C4BC]/40 hover:bg-[#E8F2ED] border border-[#C5D6CF]/50",

    // Muted Wine / Black Cherry (Sophisticated contrast for "Alerts")
    cherry:
      "bg-[#441616] text-[#fee2e2] shadow-[#441616]/40 hover:bg-[#581c1c] border border-[#2D0F0F]/50",

    // Deep Navy Slate (Clean, Analytical for ATS)
    navy: "bg-[#1e293b] text-[#e2e8f0] shadow-[#1e293b]/40 hover:bg-[#0f172a] border border-[#0f172a]/50",

    // Golden Moss (Highlight / Secondary actions)
    moss: "bg-[#5c5c3d] text-[#fefce8] shadow-[#5c5c3d]/40 hover:bg-[#6b6b47] border border-[#404028]/50",
    ochre:
      "bg-[#b45309] text-[#fffbeb] shadow-[#b45309]/40 hover:bg-[#92400e] border border-[#78350f]/50",

    // Deep Tobacco (Sophisticated, Earthy, and Strong)
    tobacco:
      "bg-[#78350f] text-[#fef3c7] shadow-[#78350f]/40 hover:bg-[#92400e] border border-[#451a03]/50",

    // Golden Olive (The bridge between your Olive theme and Yellow)
    mustard:
      "bg-[#854d0e] text-[#fefce8] shadow-[#854d0e]/40 hover:bg-[#a16207] border border-[#522808]/50",

    // Midnight Amber (Almost black, but with a warm golden glow)
    amber:
      "bg-[#451a03] text-[#fef3c7] shadow-[#451a03]/50 hover:bg-[#78350f] border border-[#1a0c01]/50",

    // Muted Sandstone (The "Bold Neutral" variant)
    sandstone:
      "bg-[#a8a29e] text-[#fafaf9] shadow-[#a8a29e]/40 hover:bg-[#78716c] border border-[#78716c]/50",

    // Harvest Gold (Brightest "Action" color)
    harvest:
      "bg-[#d97706] text-[#fffbeb] shadow-[#d97706]/40 hover:bg-[#b45309] border border-[#92400e]/50",
  };

  return (
    <button
      onClick={onClick}
      className={`p-10 rounded-[2.5rem] transition-all flex flex-col items-start gap-4 text-left group shadow-2xl active:scale-[0.98] ${styles[variant]}`}
    >
      <div className={`p-4 rounded-2xl bg-white/20 backdrop-blur-md mb-2`}>
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-black mb-1 tracking-tight">{title}</h3>
        <p className={`text-sm font-bold opacity-70`}>{desc}</p>
      </div>
    </button>
  );
};

const Modal = ({ children, title, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-900/60 backdrop-blur-sm"
  >
    <motion.div
      initial={{ scale: 0.9, y: 30 }}
      animate={{ scale: 1, y: 0 }}
      className="bg-white w-full max-w-xl p-10 rounded-[3rem] shadow-2xl relative border-t-8 border-emerald-600"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-stone-900 tracking-tighter uppercase">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="p-3 hover:bg-stone-100 rounded-full transition-colors"
        >
          <XIcon size={24} className="text-stone-400" />
        </button>
      </div>
      {children}
    </motion.div>
  </motion.div>
);

export default Dashboard;
