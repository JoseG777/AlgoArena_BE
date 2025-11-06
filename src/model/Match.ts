import { Schema, model } from 'mongoose';
//
type Player = {
  userId: string;
  username: string;
  score: number;
};

interface IMatch {
  code: string;
  problemId: string;
  durationSec: number;
  startedAt: Date;
  endedAt: Date;
  players: Player[];
  winnerUserId: string | null;
  isTie: boolean;
}

const PlayerSchema = new Schema<Player>(
  {
    userId: { type: String, required: true, index: true },
    username: { type: String, required: true },
    score: { type: Number, required: true },
  },
  { _id: false },
);

const MatchSchema = new Schema<IMatch>(
  {
    code: { type: String, required: true, unique: true },
    problemId: { type: String, required: true, index: true },
    durationSec: { type: Number, required: true },
    startedAt: { type: Date, required: true, index: true },
    endedAt: { type: Date, required: true, index: true },
    players: { type: [PlayerSchema], required: true },
    winnerUserId: { type: String, default: null, index: true },
    isTie: { type: Boolean, default: false, index: true },
  },
  {
    collection: 'matches',
  },
);

MatchSchema.index({ 'players.userId': 1, endedAt: -1 });

export const Match = model<IMatch>('Match', MatchSchema);
