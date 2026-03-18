import express from "express";
import prisma from "../prisma.js";
import { generateWithGemini } from "../utils/gemini.js"; // ✅ use helper

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const userQuestion = req.body.question;
    const salesData = await prisma.salesRecord.findMany();

    const prompt = `
You are a business analytics assistant.

Here is the sales dataset:
${JSON.stringify(salesData)}

Answer the user's question clearly and concisely.

Question: ${userQuestion}
`;

    // ✅ Call Gemini (2.5 + fallback handled inside)
    const text = await generateWithGemini(prompt);

    res.json({ answer: text });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    res.status(500).json({ error: "AI chat failed" });
  }
});

export default router;