export interface LeaderboardEntry {
  username: string;
  score: number;
}

export const mockLeaderboard: LeaderboardEntry[] = [
  { username: "ProPlayer", score: 5000 },
  { username: "ArcadeKing", score: 4500 },
  // Add more mock entries
];

// Simulate matchmaking: Returns a mock opponent score
export const simulateMatch = (
  playerScore: number,
  elo: number
): { win: boolean; opponentScore: number } => {
  const opponentScore = Math.floor(
    Math.random() * (playerScore * 1.5) + elo / 2
  );
  return { win: playerScore > opponentScore, opponentScore };
};
