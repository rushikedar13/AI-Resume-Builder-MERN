import imageKit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";

/**
 * Helper to get User ID from either middleware style
 */
const getUserId = (req) => req.userId || req.user?._id;

// POST: /api/resumes/create
export const createResume = async (req, res) => {
  try {
    const userId = getUserId(req);

    // Spread req.body to catch all nested resume fields
    const newResume = new Resume({
      ...req.body,
      userId,
    });

    const savedResume = await newResume.save();

    return res.status(201).json({
      success: true,
      message: "Resume Created",
      resume: savedResume,
    });
  } catch (error) {
    console.error("❌ Create Error:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE: /api/resumes/delete/:resumeId
export const deleteResume = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { resumeId } = req.params;

    const deleted = await Resume.findOneAndDelete({ userId, _id: resumeId });
    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Resume not found or unauthorized" });
    }

    res.status(200).json({ message: "Resume deleted" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// GET: /api/resumes/get/:resumeId
export const getResumeById = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { resumeId } = req.params;

    if (!resumeId || !resumeId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid Resume ID" });
    }

    const getResume = await Resume.findOne({ userId, _id: resumeId }).lean();

    if (!getResume) {
      return res.status(404).json({ message: "Resume Not Found" });
    }

    // Clean up sensitive/redundant fields for the frontend
    const { __v, ...rest } = getResume;

    res.status(200).json({ resume: rest });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT: /api/resumes/update
export const updateResume = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    // Handle incoming data whether it's stringified (FormData) or Object
    let resumeDataCopy;
    if (typeof resumeData === "string") {
      resumeDataCopy = JSON.parse(resumeData);
    } else {
      resumeDataCopy = structuredClone(resumeData);
    }

    // Handle Image Upload to ImageKit
    if (image) {
      const imageBufferData = fs.createReadStream(image.path);

      const response = await imageKit.files.upload({
        file: imageBufferData,
        fileName: `resume_${userId}.png`,
        folder: "user-resumes",
        transformation: {
          pre: `w-300,h-300,fo-face,z-0.75${removeBackground === "yes" ? ",e-bgremove" : ""}`,
        },
      });

      // Ensure personal_info exists before assigning image
      if (!resumeDataCopy.personal_info) resumeDataCopy.personal_info = {};
      resumeDataCopy.personal_info.image = response.url;

      // Clean up local temp file from multer
      if (fs.existsSync(image.path)) fs.unlinkSync(image.path);
    }

    const updatedResume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      { $set: resumeDataCopy },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "Changes Saved",
      resume: updatedResume,
    });
  } catch (error) {
    console.error("❌ Update Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// POST: /api/resumes/create-tailor
export const createTailorResume = async (req, res) => {
  try {
    const userId = getUserId(req);

    // Standardize data extraction
    const data = req.body.tailoredData || req.body;

    const newResume = new Resume({
      ...data,
      userId,
      title: data.title || "Tailored Resume",
    });

    const savedResume = await newResume.save();

    return res.status(201).json({
      success: true,
      resume: savedResume,
    });
  } catch (error) {
    console.error("❌ Tailor Save Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create tailored resume",
      error: error.message,
    });
  }
};
