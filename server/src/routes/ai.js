import express from "express";
import SalesRecord from "../models/SalesRecord.js";
import { generateWithGemini } from "../utils/gemini.js";

const router = express.Router();

router.get("/insights", async (req, res) => {
  try {
    console.log("INSIGHTS API HIT");

    const salesData = await SalesRecord.find().limit(100).lean();

    const prompt = `
You are a business analytics expert.
Analyze the following sales dataset and provide 3 key insights:
${JSON.stringify(salesData)}
`;

    const text = await generateWithGemini(prompt);
    res.json({ insights: text || "No insights generated" });

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ error: "AI insight generation failed" });
  }
});

export default router;