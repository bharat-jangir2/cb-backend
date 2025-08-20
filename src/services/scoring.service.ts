import api from './api';

export interface BallUpdate {
  matchId: string;
  bowlerId: string;
  strikerId: string;
  nonStrikerId: string;
  runs: number;
  extras?: {
    type: 'wide' | 'no-ball' | 'leg-bye' | 'bye' | 'penalty';
    runs: number;
  };
  wicket?: {
    type: 'bowled' | 'caught' | 'lbw' | 'run-out' | 'stumped' | 'hit-wicket' | 'obstructing' | 'timed-out' | 'retired';
    dismissedPlayerId: string;
    caughtBy?: string;
    stumpedBy?: string;
    runOutBy?: string;
  };
  commentary?: string;
}

export interface ScoreUpdate {
  matchId: string;
  teamId: string;
  score: number;
  wickets: number;
  overs: number;
  extras: {
    wides: number;
    noBalls: number;
    legByes: number;
    byes: number;
    penalty: number;
  };
}

export interface PlayerStats {
  id: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  overs?: number;
  maidens?: number;
  wickets?: number;
  economy?: number;
}

export class ScoringService {
  // Update ball-by-ball scoring
  static async updateBall(ballData: BallUpdate) {
    try {
      const response = await api.post(`/matches/${ballData.matchId}/balls`, ballData);
      return response.data;
    } catch (error) {
      console.error('Error updating ball:', error);
      throw error;
    }
  }

  // Update match score
  static async updateScore(scoreData: ScoreUpdate) {
    try {
      const response = await api.put(`/matches/${scoreData.matchId}/score`, scoreData);
      return response.data;
    } catch (error) {
      console.error('Error updating score:', error);
      throw error;
    }
  }

  // Get match details
  static async getMatchDetails(matchId: string) {
    try {
      const response = await api.get(`/matches/${matchId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching match details:', error);
      throw error;
    }
  }

  // Get player statistics for the match
  static async getPlayerStats(matchId: string) {
    try {
      const response = await api.get(`/matches/${matchId}/player-stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching player stats:', error);
      throw error;
    }
  }

  // Update player statistics
  static async updatePlayerStats(matchId: string, playerId: string, stats: Partial<PlayerStats>) {
    try {
      const response = await api.put(`/matches/${matchId}/players/${playerId}/stats`, stats);
      return response.data;
    } catch (error) {
      console.error('Error updating player stats:', error);
      throw error;
    }
  }

  // Get match commentary
  static async getCommentary(matchId: string) {
    try {
      const response = await api.get(`/matches/${matchId}/commentary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching commentary:', error);
      throw error;
    }
  }

  // Add commentary
  static async addCommentary(matchId: string, commentary: string) {
    try {
      const response = await api.post(`/matches/${matchId}/commentary`, { commentary });
      return response.data;
    } catch (error) {
      console.error('Error adding commentary:', error);
      throw error;
    }
  }

  // Update match status
  static async updateMatchStatus(matchId: string, status: string) {
    try {
      const response = await api.put(`/matches/${matchId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating match status:', error);
      throw error;
    }
  }

  // Get team squads
  static async getTeamSquads(matchId: string) {
    try {
      const response = await api.get(`/matches/${matchId}/squads`);
      return response.data;
    } catch (error) {
      console.error('Error fetching team squads:', error);
      throw error;
    }
  }

  // Update toss information
  static async updateToss(matchId: string, tossData: { winner: string; choice: string }) {
    try {
      const response = await api.put(`/matches/${matchId}/toss`, tossData);
      return response.data;
    } catch (error) {
      console.error('Error updating toss:', error);
      throw error;
    }
  }

  // Get power play status
  static async getPowerPlayStatus(matchId: string) {
    try {
      const response = await api.get(`/matches/${matchId}/power-play`);
      return response.data;
    } catch (error) {
      console.error('Error fetching power play status:', error);
      throw error;
    }
  }

  // Update power play status
  static async updatePowerPlayStatus(matchId: string, isActive: boolean) {
    try {
      const response = await api.put(`/matches/${matchId}/power-play`, { isActive });
      return response.data;
    } catch (error) {
      console.error('Error updating power play status:', error);
      throw error;
    }
  }

  // Get DLS information
  static async getDLSInfo(matchId: string) {
    try {
      const response = await api.get(`/matches/${matchId}/dls`);
      return response.data;
    } catch (error) {
      console.error('Error fetching DLS info:', error);
      throw error;
    }
  }

  // Update DLS information
  static async updateDLSInfo(matchId: string, dlsData: any) {
    try {
      const response = await api.put(`/matches/${matchId}/dls`, dlsData);
      return response.data;
    } catch (error) {
      console.error('Error updating DLS info:', error);
      throw error;
    }
  }

  // Get betting odds
  static async getBettingOdds(matchId: string) {
    try {
      const response = await api.get(`/matches/${matchId}/odds`);
      return response.data;
    } catch (error) {
      console.error('Error fetching betting odds:', error);
      throw error;
    }
  }

  // Update betting odds
  static async updateBettingOdds(matchId: string, oddsData: any) {
    try {
      const response = await api.put(`/matches/${matchId}/odds`, oddsData);
      return response.data;
    } catch (error) {
      console.error('Error updating betting odds:', error);
      throw error;
    }
  }
}

export default ScoringService;
