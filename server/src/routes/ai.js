import express from "express";
import prisma from "../prisma.js";
import { generateWithGemini } from "../utils/gemini.js"; // ✅ use helper

const router = express.Router();

router.get("/insights", async (req, res) => {
  try {
    console.log("INSIGHTS API HIT");

    const salesData = await prisma.salesRecord.findMany();

    const prompt = `
You are a business analytics expert.
Analyze the following sales dataset and provide 3 key insights:
${JSON.stringify(salesData)}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // 🔥 ADD THIS
    console.log("GEMINI RESPONSE:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return res.status(500).json({
        error: "Gemini API error",
        details: data,
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No insights generated";

    res.json({ insights: text });

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ error: "AI insight generation failed" });
  }
});

export default router;