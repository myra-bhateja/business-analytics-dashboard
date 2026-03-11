import express from "express"
import cors from "cors"

console.log("Server starting...")

import companyRoutes from './routes/company.routes.js'
import salesRoutes from './routes/sales.routes.js'

import analyticsRoutes from "./routes/analytics.js";
//import dashboardRoutes from "./routes/dashboard.routes.js";

import uploadRoutes from "./routes/upload.js";

import aiRoutes from "./routes/ai.js";
import chatRoutes from "./routes/chat.js";

connectMongo()

import connectMongo from './mongo.js'
import authRoutes from './routes/auth.routes.js'



const app = express()

app.use(cors())
app.use(express.json())


// ROUTES
app.use('/api/companies', companyRoutes)
app.use('/api/sales', salesRoutes)
app.use('/api/auth', authRoutes)

app.use("/api/analytics", analyticsRoutes)
//app.use("/api/dashboard", dashboardRoutes)
app.use("/api/upload", uploadRoutes)

// AI routes
app.use("/api/ai", aiRoutes)
app.use("/api/ai", chatRoutes)

app.get("/", (req, res) => {
  res.send("API running")
})


app.listen(5000, () => {
  console.log("Server running on port 5000")
})