import express from "express";
import prisma from "../prisma.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

console.log("GEMINI KEY AT START:", process.env.GEMINI_API_KEY);



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
    console.log("GEMINI KEY:", process.env.GEMINI_API_KEY);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const salesData = await prisma.salesRecord.findMany();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    const prompt = `
You are a business analytics expert.
Analyze the following sales dataset and provide 3 key insights:
${JSON.stringify(salesData)}
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