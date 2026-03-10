import express from "express";
import prisma from "../prisma.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get("/insights", async (req, res) => {
  try {
    const sales = await prisma.salesRecord.findMany();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
Analyze this sales data and give 3 business insights:
${JSON.stringify(sales)}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ insights: text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI insight generation failed" });
  }
});

export default router;