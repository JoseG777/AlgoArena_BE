import type { RoomCode } from './roomsStore';

type MemberScore = { userId: string; username: string; score: number };

const scoresByRoom: Record<RoomCode, Record<string, MemberScore>> = Object.create(null);

export function upsertScore(room: RoomCode, userId: string, username: string, score: number) {
  if (!scoresByRoom[room]) scoresByRoom[room] = {};
  scoresByRoom[room][userId] = { userId, username, score };
}

export function initMember(room: RoomCode, userId: string, username: string) {
  if (!scoresByRoom[room]) scoresByRoom[room] = {};
  if (!scoresByRoom[room][userId]) scoresByRoom[room][userId] = { userId, username, score: 0 };
}

export function removeMember(room: RoomCode, userId: string) {
  if (!scoresByRoom[room]) return;
  delete scoresByRoom[room][userId];
}

export function getRoomScores(room: RoomCode): MemberScore[] {
  return Object.values(scoresByRoom[room] || {});
}

export function clearRoomScores(room: RoomCode) {
  delete scoresByRoom[room];
}

//