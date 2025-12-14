import { Schema, model } from 'mongoose';

type Lang = 'typescript' | 'python' | 'java';
type Difficulty = 'easy' | 'medium' | 'hard';

interface IProblem {
  problemId: string;
  problemDescription: string;
  title: string;
  difficulty: Difficulty;

  startingCode: Record<Lang, string>;
  testHarness: Record<Lang, string>;
}

const LangBlockSchema = new Schema<Record<Lang, string>>(
  {
    typescript: { type: String, required: true },
    python: { type: String, required: true },
    java: { type: String, required: true },
  },
  { _id: false },
);

const ProblemSchema = new Schema<IProblem>(
  {
    problemId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
      index: true,
    },
    startingCode: { type: LangBlockSchema, required: true },
    testHarness: { type: LangBlockSchema, required: true },
    problemDescription: { type: String, required: true },
  },
  {
    collection: 'problems',
  },
);

export const Problem = model<IProblem>('Problem', ProblemSchema);
