import { Schema, model } from 'mongoose';
// https://mongoosejs.com/docs/typescript.html#inferschematype

interface IUserStats {
  totalPoints: number;
  matches: number;
  wins: number;
  losses: number;
  ties: number;
}

interface IUser {
  username: string;
  email: string;
  passwordHash: string;
  stats: IUserStats;
}

const statsSchema = new Schema<IUserStats>(
  {
    totalPoints: { type: Number, default: 0 },
    matches: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    ties: { type: Number, default: 0 },
  },
  { _id: false },
);

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    stats: { type: statsSchema, default: () => ({}) },
  },
  {
    collection: 'users',
  },
);

export const User = model<IUser>('User', userSchema);
