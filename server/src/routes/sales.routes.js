import express from "express";
import SalesRecord from "../models/SalesRecord.js";

const router = express.Router();

// GET all sales
router.get("/", async (req, res) => {
  try {
    const sales = await SalesRecord.find();
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create sale
router.post("/", async (req, res) => {
  try {
    const { region, product, amount, quantity, saleDate } = req.body;
    const sale = await SalesRecord.create({
      region, product, amount, quantity, saleDate: new Date(saleDate),
    });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update sale
router.put("/:id", async (req, res) => {
  try {
    const { region, product, amount, quantity, saleDate } = req.body;
    const sale = await SalesRecord.findByIdAndUpdate(
      req.params.id,
      { region, product, amount, quantity, saleDate: new Date(saleDate) },
      { new: true }
    );
    if (!sale) return res.status(404).json({ error: "Sale not found" });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE sale
router.delete("/:id", async (req, res) => {
  try {
    await SalesRecord.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;