import express from "express";
import prisma from "../prisma.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/chat", async (req, res) => {
  try {
    const userQuestion = req.body.question;
    const salesData = await prisma.salesRecord.findMany();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are a business analytics assistant.

Here is the sales dataset:
${JSON.stringify(salesData)}

Answer the user's question clearly.

Question: ${userQuestion}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ answer: text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI chat failed" });
  }
});

export default router;