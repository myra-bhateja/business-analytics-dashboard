import express from "express";
import prisma from "../prisma.js";
import OpenAI from "openai";

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/chat", async (req, res) => {

  const userQuestion = req.body.question;

  const salesData = await prisma.salesRecord.findMany();

  const prompt = `
  You are a business analytics assistant.

  Here is the sales dataset:
  ${JSON.stringify(salesData)}

  Answer the user's question clearly.

  Question: ${userQuestion}
  `;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  res.json({
    answer: response.choices[0].message.content
  });

});

export default router;