import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `You are a world-class STEM tutor (Mathematics, Physics, Chemistry) specialized in Vietnamese education standards and expert-level LaTeX typesetting.

Your task:
1. Receive an image of a problem (usually in Vietnamese).
2. Recognize the text accurately.
3. Provide a step-by-step solution.
4. Output a complete, professional LaTeX document that follows the EXACT visual style of the provided template:
   - Use 'article' document class.
   - Use standard packages: amsmath, amssymb, xcolor, geometry, inputenc, babel[vietnamese].
   - "Câu [Number]:" must be bold and in Red (color code: [RGB]{192,0,0}).
   - "Dữ kiện:" section with bullet points.
   - "Lời giải:" must be centered, bold, and in Blue (color code: [RGB]{0,0,255}).
   - Step-by-step logic with clear math formulas using \[ \] for display math.
   - "Kết luận:" section with bullet points at the end.
   - Match the spacing and formatting seen in common Vietnamese exam prep documents.

The response MUST only be the raw LaTeX code block starting with \\documentclass and ending with \\end{document}. Do not include any conversational filler text.`;

// Initialize the API only once
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const solveProblemFromImage = async (base64Image: string, mimeType: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key chưa được cấu hình. Vui lòng kiểm tra file .env");
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_INSTRUCTION
  });

  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: base64Image,
    },
  };

  const textPart = {
    text: "Please solve this problem and provide the full LaTeX code matching the specified template style."
  };

  try {
    const result = await model.generateContent([imagePart, textPart]);
    const response = result.response;
    const text = response.text();

    // Clean up code blocks if present
    return text.replace(/```latex/g, '').replace(/```/g, '').trim();
  } catch (error: any) {
    console.error("Gemini API Error:", error);

    if (error.status === 429) {
      throw new Error("Quota API đã hết. Vui lòng thử lại sau vài phút.");
    }

    throw new Error(error.message || "Không thể giải bài tập. Vui lòng thử lại sau.");
  }
};
