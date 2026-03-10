import express from "express";
import prisma from "../prisma.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const totalSales = await prisma.salesRecord.aggregate({
      _sum: { amount: true }
    });

    const totalOrders = await prisma.salesRecord.count();

    const salesByRegion = await prisma.salesRecord.groupBy({
      by: ["region"],
      _sum: { amount: true }
    });

    const topProducts = await prisma.salesRecord.groupBy({
      by: ["product"],
      _sum: { quantity: true },
      orderBy: {
        _sum: { quantity: "desc" }
      },
      take: 5
    });

    res.json({
      totalSales: totalSales._sum.amount || 0,
      totalOrders,
      salesByRegion,
      topProducts
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;