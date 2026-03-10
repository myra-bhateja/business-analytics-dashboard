import express from "express";
import prisma from "../prisma.js";
import OpenAI from "openai";

const router = express.Router();

/* -----------------------------
   1. SALES BY REGION
--------------------------------*/

router.get("/test", (req,res)=>{
 res.send("Analytics route working")
})

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

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.get("/insights", async (req, res) => {

  try {

    const salesData = await prisma.salesRecord.findMany();

    const prompt = `
You are a business analytics expert.

Analyze the following sales dataset and provide 3 key insights:

${JSON.stringify(salesData)}
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({
      insights: response.choices[0].message.content
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "AI insight generation failed" });

  }

});

export default router;