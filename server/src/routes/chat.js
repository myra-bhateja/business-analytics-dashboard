import express from "express";
import SalesRecord from "../models/SalesRecord.js";
import { generateWithGemini } from "../utils/gemini.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  console.log("Chat route hit!", req.body);

  const { question } = req.body;

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "A valid 'question' field is required." });
  }

  try {
    const [totalCount, topProducts, recentSales, revenueAgg] = await Promise.all([
      SalesRecord.countDocuments(),
      SalesRecord.aggregate([
        { $group: { _id: "$product", totalRevenue: { $sum: "$amount" } } },
        { $sort: { totalRevenue: -1 } },
        { $limit: 5 },
        { $project: { product: "$_id", totalRevenue: 1, _id: 0 } },
      ]),
      SalesRecord.find().sort({ saleDate: -1 }).limit(20).lean(),
      SalesRecord.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
      ]),
    ]);

    const summary = {
      totalRecords: totalCount,
      totalRevenue: revenueAgg[0]?.totalRevenue || 0,
      top5ProductsByRevenue: topProducts,
      last20Sales: recentSales,
    };

    const prompt = `
You are a business analytics assistant. Answer clearly and concisely.

Here is a summary of the sales data (${totalCount} total records):
${JSON.stringify(summary, null, 2)}

Question: ${question}
`;

    console.log("Prompt length (chars):", prompt.length);

    const text = await generateWithGemini(prompt);

    if (!text) {
      return res.status(500).json({ error: "AI returned an empty response. Try a more specific question." });
    }

    res.json({ answer: text });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    res.status(500).json({ error: "AI chat failed" });
  }
});

export default router;