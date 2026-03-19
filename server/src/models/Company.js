import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: { type: String },
  revenue: { type: Number },
}, { timestamps: true });

const Company = mongoose.model("Company", companySchema);
export default Company;
