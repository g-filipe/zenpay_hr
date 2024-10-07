import mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  cpf: { type: String, required: true },
  department: { type: String, required: true },
  workShift: { type: String, required: true },
  workSchedule: { type: String, required: true },
});

export const Employee = mongoose.model("Employee", schema);
