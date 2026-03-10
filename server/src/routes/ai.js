import express from "express";
import prisma from "../prisma.js";
import OpenAI from "openai";

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.get("/insights", async (req, res) => {

  const sales = await prisma.salesRecord.findMany();

  const prompt = `
  Analyze this sales data and give 3 business insights:
  ${JSON.stringify(sales)}
  `;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  res.json({
    insights: response.choices[0].message.content
  });

});

export default router;