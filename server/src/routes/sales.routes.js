import express from "express"
import prisma from "../prisma.js"
const router = express.Router()

// GET all sales
router.get('/', async (req, res) => {
  try {
    const sales = await prisma.salesRecord.findMany()
    res.json(sales)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST create sale
router.post('/', async (req, res) => {
  try {
    const { region, product, amount, quantity, saleDate } = req.body
    const sale = await prisma.salesRecord.create({
      data: { region, product, amount, quantity, saleDate: new Date(saleDate) }
    })
    res.json(sale)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update sale
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { region, product, amount, quantity, saleDate } = req.body
    const sale = await prisma.salesRecord.update({
      where: { id },
      data: { region, product, amount, quantity, saleDate: new Date(saleDate) }
    })
    res.json(sale)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE sale
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    await prisma.salesRecord.delete({ where: { id } })
    res.json({ message: 'Deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router