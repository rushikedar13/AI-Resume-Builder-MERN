import groq from "../configs/gemini.js";
import Resume from "../models/Resume.js";

/**
 * 1. Enhance Professional Summary
 */
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent)
      return res.status(400).json({ message: "Missing required fields" });

    const result = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional resume writer. Refine the text into 1-2 powerful sentences. Return ONLY the improved text.",
        },
        { role: "user", content: userContent },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const aiText = result.choices[0]?.message?.content || "";
    return res.status(200).json({ aiContent: aiText.trim() });
  } catch (error) {
    console.error("❌ Enhance Summary Error:", error.message);
    return res.status(500).json({ message: "AI Enhancement failed" });
  }
};

/**
 * 2. Enhance Job Description
 */
export const enhanceJobDesc = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent)
      return res.status(400).json({ message: "Missing content" });

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume editor. Rewrite job descriptions to be action-oriented and professional. Return ONLY the improved text.",
        },
        { role: "user", content: userContent },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const aiText = completion.choices[0]?.message?.content || "";
    return res.status(200).json({ aiContent: aiText.trim() });
  } catch (error) {
    console.error("❌ Enhance JD Error:", error.message);
    return res.status(500).json({ message: "AI Enhancement failed" });
  }
};

/**
 * 3. Upload and Parse Resume (CLEANED & FIXED)
 */
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText)
      return res.status(400).json({ message: "No resume text provided" });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional data extractor. Extract EVERY detail from the text into JSON. Do not omit experience or skills.",
        },
        {
          role: "user",
          content: `Extract data from: "${resumeText}"
          Return ONLY a JSON object using these EXACT keys to match my database schema:
          {
            "personal_info": { "full_name": "", "email": "", "phone": "", "linkedin": "", "location": "", "profession": "", "website": "" },
            "professional_summary": "",
            "skills": [],
            "experience": [{ "company": "", "position": "", "description": "", "start_date": "", "end_date": "" }],
            "education": [{ "institution": "", "degree": "", "field": "", "graduation_date": "" }]
          }`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const parsedData = JSON.parse(chatCompletion.choices[0].message.content);

    // Save with the Correct Spread Logic
    const newResume = await Resume.create({
      userId,
      title: title || "Imported Resume",
      ...parsedData,
    });

    return res.status(201).json({
      message: "Success",
      resumeId: newResume._id,
      resume: newResume,
    });
  } catch (error) {
    console.error("❌ Extraction Error:", error.message);
    return res.status(500).json({ message: "Failed to parse resume" });
  }
};

/**
 * 4. Check ATS Score
 */
export const checkATSScore = async (req, res) => {
  try {
    const { jobDescription, cvText } = req.body;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert Applicant Tracking System (ATS). Provide a realistic match percentage (0-100) and analysis. Return strictly JSON.`,
        },
        {
          role: "user",
          content: `JOB DESCRIPTION: ${jobDescription}\nRESUME TEXT: ${cvText}\nReturn JSON: { "score": number, "strengths": [], "weaknesses": [], "missingKeywords": [], "suggestions": [] }`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const parsedAnalysis = JSON.parse(completion.choices[0].message.content);
    if (parsedAnalysis.score > 0 && parsedAnalysis.score <= 1) {
      parsedAnalysis.score = Math.round(parsedAnalysis.score * 100);
    }

    return res.status(200).json({ analysis: parsedAnalysis });
  } catch (error) {
    console.error("❌ ATS Error:", error.message);
    return res.status(500).json({ message: "AI Analysis failed" });
  }
};

/**
 * 5. Tailor Resume
 */
export const tailorResume = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Rewrite the resume JSON to align with the JD. Use the EXACT schema keys provided.`,
        },
        {
          role: "user",
          content: `JD: ${jobDescription}\nResume JSON: ${JSON.stringify(resumeData)}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const tailoredContent = JSON.parse(completion.choices[0].message.content);
    res.status(200).json({ success: true, tailoredContent });
  } catch (error) {
    console.error("GROQ API ERROR:", error.message);
    res.status(500).json({ error: "Tailoring failed" });
  }
};
