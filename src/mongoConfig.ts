import mongoose from "mongoose";

export async function mongoConfig() {
  await mongoose.connect("mongodb://127.0.0.1:27020/zenpay_hr");
  console.log("Connected successfully!");
}
