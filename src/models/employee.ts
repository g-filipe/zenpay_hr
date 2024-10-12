import mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface IEmployee {
  name: string;
  cpf: string;
  department: string;
  workShift: string;
  workSchedule: string;
  holidayWorkDays: { [key: string]: number[] };
  weekendWorkDays: { [key: string]: number[] };
  unjustifiedAbsences: { [key: string]: number[] };
}

const schema = new Schema<IEmployee>({
  name: { type: String, required: true },
  cpf: { type: String, required: true },
  department: { type: String, required: true },
  workShift: { type: String, required: true },
  workSchedule: { type: String, required: true },
  holidayWorkDays: {
    type: Map,
    of: [Number],
  },
  weekendWorkDays: {
    type: Map,
    of: [Number],
  },
  unjustifiedAbsences: {
    type: Map,
    of: [Number],
  },
});

export const Employee = mongoose.model("Employee", schema);
