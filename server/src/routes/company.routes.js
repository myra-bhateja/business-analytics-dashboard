import express from "express";
import Company from "../models/Company.js";

const router = express.Router();

// GET all companies
router.get("/", async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create company
router.post("/", async (req, res) => {
  try {
    const { name, industry, revenue } = req.body;
    const company = await Company.create({ name, industry, revenue });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET company by ID
router.get("/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ error: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update company
router.put("/:id", async (req, res) => {
  try {
    const { name, industry, revenue } = req.body;
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { name, industry, revenue },
      { new: true }
    );
    if (!company) return res.status(404).json({ error: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE company
router.delete("/:id", async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;