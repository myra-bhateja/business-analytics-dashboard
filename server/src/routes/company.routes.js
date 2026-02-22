import express from 'express'
import prisma from '../prisma.js'

const router = express.Router()



// ✅ Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await prisma.company.findMany()
    res.json(companies)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ✅ Create company
router.post('/', async (req, res) => {
  try {
    const { name, industry, revenue } = req.body

    const company = await prisma.company.create({
      data: { name, industry, revenue }
    })

    res.json(company)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router