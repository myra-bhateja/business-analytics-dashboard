import express from "express";
import prisma from "../prisma.js";
//import { GoogleGenerativeAI } from "@google/generative-ai";

import { generateWithGemini } from "../utils/gemini.js";

const router = express.Router();





/* -----------------------------
   1. SALES BY REGION
--------------------------------*/

router.get("/test", (req, res) => {
  res.send("Analytics route working");
});

router.get("/sales-by-region", async (req, res) => {
  try {
    const data = await prisma.$queryRaw`
      SELECT region, SUM(amount) as sales
      FROM "SalesRecord"
      GROUP BY region
      ORDER BY sales DESC;
    `;
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching sales by region" });
  }
});

/* -----------------------------
   2. MONTHLY SALES TREND
--------------------------------*/

router.get("/monthly-sales", async (req, res) => {
  try {
    const data = await prisma.$queryRaw`
      SELECT DATE_TRUNC('month',"saleDate") as month,
      SUM(amount) as sales
      FROM "SalesRecord"
      GROUP BY month
      ORDER BY month;
    `;
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching monthly sales" });
  }
});

/* -----------------------------
   3. TOP PRODUCTS
--------------------------------*/

router.get("/top-products", async (req, res) => {
  try {
    const data = await prisma.$queryRaw`
      SELECT product, SUM(amount) as sales
      FROM "SalesRecord"
      GROUP BY product
      ORDER BY sales DESC
      LIMIT 5;
    `;
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching top products" });
  }
});

/* -----------------------------
   4. AI BUSINESS INSIGHTS
--------------------------------*/

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