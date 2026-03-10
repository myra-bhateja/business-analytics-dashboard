import express from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import prisma from "../prisma.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {

      for (const row of results) {
        await prisma.salesRecord.create({
          data: {
            region: row.region,
            product: row.product,
            amount: parseFloat(row.amount),
            quantity: parseInt(row.quantity),
            saleDate: new Date(row.saleDate)
          }
        });
      }

      res.json({ message: "Upload successful" });
    });
});

export default router;