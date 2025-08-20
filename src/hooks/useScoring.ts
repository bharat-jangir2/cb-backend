import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import ScoringService, { BallUpdate, ScoreUpdate, PlayerStats } from '../services/scoring.service';

interface UseScoringProps {
  matchId: string;
}

interface ScoringState {
  match: any;
  bowlers: PlayerStats[];
  batsmen: PlayerStats[];
  currentBowler: string | null;
  striker: string | null;
  nonStriker: string | null;
  commentary: string;
  powerPlay: boolean;
  dls: boolean;
  loading: boolean;
  error: string | null;
}

export const useScoring = ({ matchId }: UseScoringProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [state, setState] = useState<ScoringState>({
    match: null,
    bowlers: [],
    batsmen: [],
    currentBowler: null,
    striker: null,
    nonStriker: null,
    commentary: '',
    powerPlay: false,
    dls: false,
    loading: true,
    error: null
  });

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to scoring socket');
      newSocket.emit('join-match', { matchId });
    });

    newSocket.on('ball-updated', (data) => {
      console.log('Ball updated:', data);
      // Update local state based on ball update
    });

    newSocket.on('score-updated', (data) => {
      console.log('Score updated:', data);
      // Update local state based on score update
    });

    newSocket.on('player-stats-updated', (data) => {
      console.log('Player stats updated:', data);
      // Update local state based on player stats update
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from scoring socket');
    });

    return () => {
      newSocket.disconnect();
    };
  }, [matchId]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        // Load match details
        const matchData = await ScoringService.getMatchDetails(matchId);
        
        // Load player stats
        const playerStats = await ScoringService.getPlayerStats(matchId);
        
        // Load power play status
        const powerPlayStatus = await ScoringService.getPowerPlayStatus(matchId);
        
        // Load DLS info
        const dlsInfo = await ScoringService.getDLSInfo(matchId);

        setState(prev => ({
          ...prev,
          match: matchData,
          bowlers: playerStats.bowlers || [],
          batsmen: playerStats.batsmen || [],
          powerPlay: powerPlayStatus.isActive || false,
          dls: dlsInfo.isActive || false,
          loading: false
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to load match data',
          loading: false
        }));
      }
    };

    if (matchId) {
      loadInitialData();
    }
  }, [matchId]);

  // Update ball
  const updateBall = useCallback(async (ballData: Omit<BallUpdate, 'matchId'>) => {
    try {
      const fullBallData = { ...ballData, matchId };
      const result = await ScoringService.updateBall(fullBallData);
      
      // Emit socket event
      socket?.emit('ball-updated', result);
      
      return result;
    } catch (error) {
      console.error('Error updating ball:', error);
      throw error;
    }
  }, [matchId, socket]);

  // Update score
  const updateScore = useCallback(async (scoreData: Omit<ScoreUpdate, 'matchId'>) => {
    try {
      const fullScoreData = { ...scoreData, matchId };
      const result = await ScoringService.updateScore(fullScoreData);
      
      // Emit socket event
      socket?.emit('score-updated', result);
      
      return result;
    } catch (error) {
      console.error('Error updating score:', error);
      throw error;
    }
  }, [matchId, socket]);

  // Update player stats
  const updatePlayerStats = useCallback(async (playerId: string, stats: Partial<PlayerStats>) => {
    try {
      const result = await ScoringService.updatePlayerStats(matchId, playerId, stats);
      
      // Emit socket event
      socket?.emit('player-stats-updated', result);
      
      return result;
    } catch (error) {
      console.error('Error updating player stats:', error);
      throw error;
    }
  }, [matchId, socket]);

  // Add commentary
  const addCommentary = useCallback(async (commentary: string) => {
    try {
      const result = await ScoringService.addCommentary(matchId, commentary);
      setState(prev => ({ ...prev, commentary }));
      return result;
    } catch (error) {
      console.error('Error adding commentary:', error);
      throw error;
    }
  }, [matchId]);

  // Update power play status
  const updatePowerPlay = useCallback(async (isActive: boolean) => {
    try {
      const result = await ScoringService.updatePowerPlayStatus(matchId, isActive);
      setState(prev => ({ ...prev, powerPlay: isActive }));
      return result;
    } catch (error) {
      console.error('Error updating power play status:', error);
      throw error;
    }
  }, [matchId]);

  // Update DLS status
  const updateDLS = useCallback(async (dlsData: any) => {
    try {
      const result = await ScoringService.updateDLSInfo(matchId, dlsData);
      setState(prev => ({ ...prev, dls: dlsData.isActive }));
      return result;
    } catch (error) {
      console.error('Error updating DLS info:', error);
      throw error;
    }
  }, [matchId]);

  // Update toss
  const updateToss = useCallback(async (tossData: { winner: string; choice: string }) => {
    try {
      const result = await ScoringService.updateToss(matchId, tossData);
      setState(prev => ({ 
        ...prev, 
        match: { ...prev.match, toss: tossData }
      }));
      return result;
    } catch (error) {
      console.error('Error updating toss:', error);
      throw error;
    }
  }, [matchId]);

  // Set current bowler
  const setCurrentBowler = useCallback((bowlerId: string) => {
    setState(prev => ({ ...prev, currentBowler: bowlerId }));
  }, []);

  // Set striker
  const setStriker = useCallback((batsmanId: string) => {
    setState(prev => ({ ...prev, striker: batsmanId }));
  }, []);

  // Set non-striker
  const setNonStriker = useCallback((batsmanId: string) => {
    setState(prev => ({ ...prev, nonStriker: batsmanId }));
  }, []);

  // Get current bowler stats
  const getCurrentBowlerStats = useCallback(() => {
    return state.bowlers.find(bowler => bowler.id === state.currentBowler);
  }, [state.bowlers, state.currentBowler]);

  // Get striker stats
  const getStrikerStats = useCallback(() => {
    return state.batsmen.find(batsman => batsman.id === state.striker);
  }, [state.batsmen, state.striker]);

  // Get non-striker stats
  const getNonStrikerStats = useCallback(() => {
    return state.batsmen.find(batsman => batsman.id === state.nonStriker);
  }, [state.batsmen, state.nonStriker]);

  return {
    // State
    ...state,
    
    // Actions
    updateBall,
    updateScore,
    updatePlayerStats,
    addCommentary,
    updatePowerPlay,
    updateDLS,
    updateToss,
    setCurrentBowler,
    setStriker,
    setNonStriker,
    
    // Computed values
    getCurrentBowlerStats,
    getStrikerStats,
    getNonStrikerStats,
    
    // Socket
    socket
  };
};
