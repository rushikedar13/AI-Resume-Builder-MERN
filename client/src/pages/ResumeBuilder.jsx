import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  FolderIcon,
  GraduationCap,
  Sparkles,
  User,
  Save,
  LoaderCircle,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import { useRef } from "react";

// Component Imports
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/Home/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorWheel from "../components/Home/ColorWheel";
import ProfessionalSummary from "../components/ProfessionalSummary";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";

import api from "../configs/api";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [isSaving, setIsSaving] = useState(false);
  const componentRef = useRef();

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const [showTailorModal, setShowTailorModal] = useState(false);
  const [targetJD, setTargetJD] = useState("");
  const [isTailoring, setIsTailoring] = useState(false);
  // const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  }); // Add 'selectedResume' as a parameter

  const handleTailor = async (selectedResume) => {
    if (!targetJD.trim()) return toast.error("Please paste a Job Description!");

    setIsTailoring(true);
    try {
      // 1. Get tailored data from Groq/AI
      const { data: aiResponse } = await api.post("/api/ai/tailor", {
        resumeData: selectedResume, // Use the argument here
        jobDescription: targetJD,
      });

      if (aiResponse.success) {
        // 2. Prepare payload for a NEW resume
        const newResumeData = {
          ...aiResponse.tailoredResume,
          title: `${selectedResume.title} (Tailored)`,
        }; // Remove ID so the backend creates a fresh entry
        delete newResumeData._id; // 3. Save as a new document

        const { data: saveResponse } = await api.post(
          "/api/resumes/create",
          newResumeData,
        );

        if (saveResponse.success) {
          toast.success("New tailored version created!");
          navigate(`/builder/${saveResponse.resume._id}`);
        }
      }
    } catch (error) {
      console.error("Tailor Error:", error);
      toast.error("AI Tailoring failed.");
    } finally {
      setIsTailoring(false);
    }
  };

  useEffect(() => {
    const fetchResumeData = async () => {
      setLoading(true); // Start loading state
      try {
        // ResumeBuilder.jsx line 108 (approx)
        const response = await api.get(
          `http://localhost:5000/api/resumes/get/${resumeId}`,
        ); // Ensure you are setting the data correctly based on your API response structure
        setResumeData(response.data.resume || response.data);
      } catch (err) {
        console.error("Error fetching resume:", err);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (resumeId) {
      fetchResumeData();
    }
  }, [resumeId]);

  const sections = [
    { id: "personal", name: "Bio", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "History", icon: Briefcase },
    { id: "education", name: "Study", icon: GraduationCap },
    { id: "project", name: "Work", icon: FolderIcon },
    { id: "skill", name: "Stack", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  const loadExistingResume = useCallback(async () => {
    try {
      const { data } = await api.get(`/api/resumes/get/${resumeId}`);
      if (data.resume) {
        setResumeData(data.resume);
        document.title = data.resume.title || "Resume Builder";
      } else {
        navigate(`/view/${resumeId}`);
      }
    } catch (error) {
      navigate(`/view/${resumeId}`);
    }
  }, [resumeId, navigate]);

  useEffect(() => {
    if (token && resumeId) loadExistingResume();
  }, [loadExistingResume, token, resumeId]);

  const saveChanges = async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      let updatedResumeData = structuredClone(resumeData);
      if (updatedResumeData.personal_info?.image instanceof Object) {
        delete updatedResumeData.personal_info.image;
      }

      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(updatedResumeData));
      if (removeBackground) formData.append("removeBackground", "yes");
      if (resumeData.personal_info?.image instanceof File) {
        formData.append("image", resumeData.personal_info.image);
      }

      const { data } = await api.put("/api/resumes/update", formData);
      setResumeData(data.resume);
      toast.success("Sync Complete");
    } catch (error) {
      toast.error("Sync Failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcf9] selection:bg-emerald-100">
      {/* Navigation Header */}
      <div className="max-w-[1440px] mx-auto px-8 py-8 flex justify-between items-center no-print">
        <Link
          to="/app"
          className="flex items-center gap-2 p-3 bg-white border-2 border-stone-900 rounded-xl font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          <ArrowLeftIcon size={16} /> Dashboard
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
              Editor Mode
            </p>
            <p className="text-sm font-black text-stone-900">
              {resumeData?.title || "Draft Resume"}
            </p>
          </div>
          <button
            onClick={window.print}
            className="flex items-center gap-2 p-3 bg-stone-900 text-white border-2 border-stone-900 rounded-xl font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(85,107,47,0.4)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 pb-20">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel - Control Center (Sticky) */}
          <div className="lg:col-span-5 no-print lg:sticky lg:top-8">
            <div className="bg-white border-[3px] border-stone-900 rounded-[2.5rem] p-8 shadow-[12px_12px_0px_0px_rgba(85,107,47,0.15)] relative overflow-hidden">
              {/* Theme Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-stone-100">
                <motion.div
                  className="h-full bg-emerald-600"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((activeSectionIndex + 1) * 100) / sections.length}%`,
                  }}
                />
              </div>

              {/* Toolbar */}
              <div className="flex justify-between items-center mb-10 mt-2">
                <div className="flex items-center gap-3">
                  <TemplateSelector
                    selectedTemplate={resumeData?.template}
                    onChange={(t) =>
                      setResumeData((p) => ({ ...p, template: t }))
                    }
                  />
                  <div className="w-[2px] h-6 bg-stone-100" />
                  <ColorWheel
                    selectedColor={resumeData?.accent_color}
                    onChange={(c) =>
                      setResumeData((p) => ({ ...p, accent_color: c }))
                    }
                  />
                </div>

                {/* Boxy Navigation Buttons */}
                <div className="flex gap-3">
                  <NavBtn
                    icon={<ChevronLeft size={18} />}
                    disabled={activeSectionIndex === 0}
                    onClick={() => setActiveSectionIndex((p) => p - 1)}
                  />
                  <NavBtn
                    icon={<ChevronRight size={18} />}
                    disabled={activeSectionIndex === sections.length - 1}
                    onClick={() => setActiveSectionIndex((p) => p + 1)}
                  />
                </div>
              </div>

              {/* Active Section Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-stone-900 text-white rounded-lg">
                    {React.createElement(activeSection.icon, { size: 18 })}
                  </div>
                  <h2 className="text-2xl font-black text-stone-900 uppercase tracking-tighter">
                    {activeSection.name}
                  </h2>
                </div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                  Component {activeSectionIndex + 1} of {sections.length}
                </p>
              </div>

              {/* Dynamic Form Content */}
              <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    {/* ... (Form components remain the same) */}
                    {activeSection.id === "personal" && (
                      <PersonalInfoForm
                        data={resumeData?.personal_info}
                        onChange={(d) =>
                          setResumeData((p) => ({ ...p, personal_info: d }))
                        }
                        removeBackground={removeBackground}
                        setRemoveBackground={setRemoveBackground}
                      />
                    )}
                    {activeSection.id === "summary" && (
                      <ProfessionalSummary
                        data={resumeData?.professional_summary}
                        onChange={(d) =>
                          setResumeData((p) => ({
                            ...p,
                            professional_summary: d,
                          }))
                        }
                        setResumeData={setResumeData}
                        resumeData={resumeData}
                      />
                    )}
                    {activeSection.id === "experience" && (
  <ExperienceForm
    data={resumeData?.experience}
    onChange={(d) =>
      setResumeData((p) => ({ ...p, experience: d }))
    }
  />
)}
                    {activeSection.id === "education" && (
                      <EducationForm
                        data={resumeData?.education}
                        onChange={(d) =>
                          setResumeData((p) => ({ ...p, education: d }))
                        }
                      />
                    )}

                    {activeSection.id === "project" && (
                      <ProjectForm
                        data={resumeData?.projects}
                        onChange={(d) =>
                          setResumeData((p) => ({ ...p, projects: d }))
                        }
                      />
                    )}

                    {activeSection.id === "skill" && (
                      <SkillsForm
                        data={resumeData?.skills}
                        onChange={(d) =>
                          setResumeData((p) => ({ ...p, skills: d }))
                        }
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                onClick={() =>
                  toast.promise(saveChanges(), {
                    loading: "Syncing Data...",
                    success: "Database Updated",
                    error: "Network Error",
                  })
                }
                disabled={isSaving}
                className="w-full bg-emerald-700 text-white py-4 rounded-2xl font-black text-lg mt-8 shadow-[0px_6px_0px_0px_rgba(5,150,105,0.3)] hover:translate-y-[2px] hover:shadow-[0px_3px_0px_0px_rgba(5,150,105,0.3)] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
              >
                <Save size={20} />
                {isSaving ? "Processing..." : "Commit Changes"}
              </button>
            </div>
          </div>

          {/* Right Panel - Live Preview (Fixed Viewport Height) */}
          <div className="lg:col-span-7 h-[calc(100vh-160px)] lg:sticky lg:top-8">
            <div className="bg-stone-900 border-[3px] border-stone-900 rounded-[2.5rem] p-4 shadow-[12px_12px_0px_0px_rgba(28,25,23,0.1)] h-full overflow-hidden flex flex-col print:p-0 print:border-none print:bg-transparent print:shadow-none">
              <div className="bg-white rounded-[1.8rem] h-full overflow-y-auto print:overflow-visible shadow-inner print:rounded-none print:shadow-none print:border-none custom-scrollbar">
                <div
                  ref={componentRef}
                  className="print-container bg-white min-h-full"
                >
                  <ResumePreview
                    data={resumeData}
                    template={resumeData?.template}
                    accentColor={resumeData?.accent_color}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    /**
     * Updated NavBtn:
     * - Fixed width/height for a perfect box shape
     * - Deeper shadow for tactile feel
     * - Smaller padding
     */
  );
};

const NavBtn = ({ icon, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-11 h-11 flex items-center justify-center bg-white border-2 border-stone-900 rounded-lg shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:opacity-30 disabled:hover:translate-x-0 disabled:shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] transition-all"
  >
    {icon}
  </button>
);

export default ResumeBuilder;
