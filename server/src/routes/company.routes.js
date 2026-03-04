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

// ✅ Get company by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    const company = await prisma.company.findUnique({
      where: { id }
    })

    if (!company) {
      return res.status(404).json({ error: 'Company not found' })
    }

    res.json(company)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ✅ Update company
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { name, industry, revenue } = req.body

    const company = await prisma.company.update({
      where: { id },
      data: { name, industry, revenue }
    })

    res.json(company)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ✅ Delete company
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    await prisma.company.delete({
      where: { id }
    })

    res.json({ message: 'Company deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})



export default router