import mongoose from "mongoose";

const salesRecordSchema = new mongoose.Schema({
  region: { type: String, required: true },
  product: { type: String, required: true },
  amount: { type: Number, required: true },
  quantity: { type: Number, required: true },
  saleDate: { type: Date, required: true },
}, { timestamps: true });

const SalesRecord = mongoose.model("SalesRecord", salesRecordSchema);
export default SalesRecord;
