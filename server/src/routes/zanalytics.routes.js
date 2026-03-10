import express from "express";
import prisma from "../prisma.js";

const router = express.Router();

/* Total sales */
router.get("/total-sales", async (req, res) => {
  try {
    const result = await prisma.salesRecord.aggregate({
      _sum: { amount: true }
    });

    res.json({
      totalSales: result._sum.amount || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Sales by region */
router.get("/sales-by-region", async (req, res) => {
  try {
    const result = await prisma.salesRecord.groupBy({
      by: ["region"],
      _sum: {
        amount: true,
        quantity: true
      }
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Top selling products */
router.get("/top-products", async (req, res) => {
  try {
    const result = await prisma.salesRecord.groupBy({
      by: ["product"],
      _sum: {
        quantity: true,
        amount: true
      },
      orderBy: {
        _sum: {
          quantity: "desc"
        }
      }
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;