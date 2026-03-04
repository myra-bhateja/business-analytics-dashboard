import express from 'express'
import cors from 'cors'

import companyRoutes from './routes/company.routes.js'
import salesRoutes from './routes/sales.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

// ✅ ROUTES MUST BE BEFORE listen
app.use('/api/companies', companyRoutes)
app.use('/api/sales', salesRoutes)

app.get('/', (req, res) => {
  res.send('API running')
})

app.get('/test', (req, res) => {
  res.send('TEST OK')
})

app.listen(5000, () => {
  console.log('Server running on port 5000')
})