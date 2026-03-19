import express from "express";
import SalesRecord from "../models/SalesRecord.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [totalSalesAgg, totalOrders, salesByRegion, topProducts] = await Promise.all([
      SalesRecord.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      SalesRecord.countDocuments(),
      SalesRecord.aggregate([
        { $group: { _id: "$region", total: { $sum: "$amount" } } },
        { $project: { region: "$_id", total: 1, _id: 0 } },
      ]),
      SalesRecord.aggregate([
        { $group: { _id: "$product", totalQuantity: { $sum: "$quantity" } } },
        { $sort: { totalQuantity: -1 } },
        { $limit: 5 },
        { $project: { product: "$_id", totalQuantity: 1, _id: 0 } },
      ]),
    ]);

    res.json({
      totalSales: totalSalesAgg[0]?.total || 0,
      totalOrders,
      salesByRegion,
      topProducts,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;