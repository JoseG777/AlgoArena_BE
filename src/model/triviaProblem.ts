import mongoose, { Schema, Document } from "mongoose";

export interface ITriviaProblem extends Document {
  question: string;
  category: string;
  type: string;
  difficulty: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const triviaProblemSchema = new Schema<ITriviaProblem>({
  question: { type: String, required: true },
  category: { type: String, default: "Computer Science" },
  type: { type: String, default: "multiple" },
  difficulty: { type: String, default: "medium" },
  correct_answer: { type: String, required: true },
  incorrect_answers: { type: [String], required: true },
});

export default mongoose.model<ITriviaProblem>("TriviaProblem", triviaProblemSchema);
