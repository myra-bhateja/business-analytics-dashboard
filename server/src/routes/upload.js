import express from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import SalesRecord from "../models/SalesRecord.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        const records = results.map((row) => ({
          region: row.region,
          product: row.product,
          amount: parseFloat(row.amount),
          quantity: parseInt(row.quantity),
          saleDate: new Date(row.saleDate),
        }));

        await SalesRecord.insertMany(records); // ✅ bulk insert — much faster than looping
        fs.unlinkSync(req.file.path);          // ✅ clean up temp file
        res.json({ message: "Upload successful", count: records.length });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
});

export default router;