export const GameStorage = {
  // Player data
  async getPlayer() {
    if (typeof window === 'undefined') return null;
    try {
      const result = localStorage.getItem("player");
      return result ? JSON.parse(result) : null;
    } catch {
      return null;
    }
  },

  async savePlayer(data: any) {
    if (typeof window === 'undefined') return;
    localStorage.setItem("player", JSON.stringify(data));
  },

  // Match history
  async getMatchHistory() {
    if (typeof window === 'undefined') return [];
    try {
      const result = localStorage.getItem("match-history");
      return result ? JSON.parse(result) : [];
    } catch {
      return [];
    }
  },

  async addMatch(match: any) {
    const history = await this.getMatchHistory();
    history.unshift(match);
    if (typeof window !== 'undefined') {
        localStorage.setItem("match-history", JSON.stringify(history.slice(0, 50)));
    }
  },

  // Leaderboard (shared)
  async getLeaderboard() {
    if (typeof window === 'undefined') return [];
    try {
      const result = localStorage.getItem("leaderboard");
      return result ? JSON.parse(result) : [];
    } catch {
      return [];
    }
  },

  async updateLeaderboard(player: any) {
    const board = await this.getLeaderboard();
    const existing = board.findIndex((p: any) => p.id === player.id);
    if (existing >= 0) {
      board[existing] = player;
    } else {
      board.push(player);
    }
    board.sort((a: any, b: any) => b.elo - a.elo);
    if (typeof window !== 'undefined') {
        localStorage.setItem("leaderboard", JSON.stringify(board.slice(0, 100)));
    }
  },
};
