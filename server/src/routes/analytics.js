import express from "express";
import SalesRecord from "../models/SalesRecord.js";
import { generateWithGemini } from "../utils/gemini.js";

const router = express.Router();

// TEST
router.get("/test", (req, res) => {
  res.send("Analytics route working");
});

// 1. SALES BY REGION
router.get("/sales-by-region", async (req, res) => {
  try {
    const data = await SalesRecord.aggregate([
      { $group: { _id: "$region", sales: { $sum: "$amount" } } },
      { $sort: { sales: -1 } },
      { $project: { region: "$_id", sales: 1, _id: 0 } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching sales by region" });
  }
});

// 2. MONTHLY SALES TREND
router.get("/monthly-sales", async (req, res) => {
  try {
    const data = await SalesRecord.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$saleDate" } },
          sales: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { month: "$_id", sales: 1, _id: 0 } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching monthly sales" });
  }
});

// 3. TOP PRODUCTS
router.get("/top-products", async (req, res) => {
  try {
    const data = await SalesRecord.aggregate([
      { $group: { _id: "$product", sales: { $sum: "$amount" } } },
      { $sort: { sales: -1 } },
      { $limit: 5 },
      { $project: { product: "$_id", sales: 1, _id: 0 } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching top products" });
  }
});

// 4. AI BUSINESS INSIGHTS
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