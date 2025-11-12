import type { RoomCode } from './roomsStore';

export type MemberScore = { userId: string; username: string; score: number; finished: boolean };

const scoresByRoom: Record<RoomCode, Record<string, MemberScore>> = Object.create(null);

export function upsertScore(room: RoomCode, userId: string, username: string, score: number) {
  if (!scoresByRoom[room]) scoresByRoom[room] = {};
  const prev = scoresByRoom[room][userId];
  scoresByRoom[room][userId] = {
    userId,
    username,
    score,
    finished: prev?.finished ?? false,
  };
}

export function initMember(room: RoomCode, userId: string, username: string) {
  if (!scoresByRoom[room]) scoresByRoom[room] = {};
  if (!scoresByRoom[room][userId]) {
    scoresByRoom[room][userId] = { userId, username, score: 0, finished: false };
  }
}

export function markFinished(room: RoomCode, userId: string, username: string) {
  if (!scoresByRoom[room]) scoresByRoom[room] = {};
  const prev = scoresByRoom[room][userId];
  if (prev) {
    prev.finished = true;
    if (!prev.username) prev.username = username;
  } else {
    scoresByRoom[room][userId] = { userId, username, score: 0, finished: true };
  }
}

export function removeMember(room: RoomCode, userId: string) {
  if (!scoresByRoom[room]) return;
  delete scoresByRoom[room][userId];
}

export function getRoomScores(room: RoomCode): MemberScore[] {
  return Object.values(scoresByRoom[room] || {});
}

export function allFinished(room: RoomCode): boolean {
  const arr = Object.values(scoresByRoom[room] || {});
  return arr.length > 0 && arr.every(m => m.finished);
}

export function clearRoomScores(room: RoomCode) {
  delete scoresByRoom[room];
}
