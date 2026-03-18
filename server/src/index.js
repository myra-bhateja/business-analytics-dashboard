import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // load .env first

console.log("Server starting...");

// ---------------------------
// MongoDB connection
// ---------------------------
const connectMongo = async () => {
  try {
    // Use your Atlas URI from .env
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.error(
      "Tips: \n1. Make sure your hotspot IP is whitelisted in Atlas.\n2. If using SRV, your network must allow DNS lookups.\n3. You can try using a direct connection string from Atlas instead of +srv."
    );
    process.exit(1); // Stop server if MongoDB fails
  }
};

// Connect MongoDB before routes
connectMongo();

// ---------------------------
// Initialize Express & Prisma
// ---------------------------
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ---------------------------
// Import routes
// ---------------------------
import companyRoutes from "./routes/company.routes.js";
import salesRoutes from "./routes/sales.routes.js";
import authRoutes from "./routes/auth.routes.js";
import analyticsRoutes from "./routes/analytics.js";
// import dashboardRoutes from "./routes/dashboard.routes.js";
import uploadRoutes from "./routes/upload.js";
import aiRoutes from "./routes/ai.js";
import chatRoutes from "./routes/chat.js";

// ---------------------------
// Routes
// ---------------------------
app.use("/api/companies", companyRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/analytics", analyticsRoutes);
// app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", chatRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API running");
});

// ---------------------------
// Prisma test routes
// ---------------------------
app.get("/check-data", async (req, res) => {
  try {
    const data = await prisma.SalesRecord.findMany();
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/check-company", async (req, res) => {
  try {
    const data = await prisma.Company.findMany();
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ---------------------------
// Start server
// ---------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);