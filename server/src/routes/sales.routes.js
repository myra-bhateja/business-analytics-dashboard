import express from "express"
import prisma from "../prisma.js"

const router = express.Router()

// ✅ Get all sales
router.get('/', async (req, res) => {
  try {
    const sales = await prisma.salesRecord.findMany()
    res.json(sales)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ✅ Create sale
router.post('/', async (req, res) => {
  try {
    const { region, product, amount, quantity, saleDate } = req.body

    const sale = await prisma.salesRecord.create({
      data: {
        region,
        product,
        amount,
        quantity,
        saleDate: new Date(saleDate)
      }
    })

    res.json(sale)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
//POST
router.post("/", async (req, res) => {
  try {
    const sale = await prisma.salesRecord.create({
      data: req.body,
    });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router