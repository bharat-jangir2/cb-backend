# 🎯 **FRONTEND MIGRATION GUIDE**

## Updating Frontend & Admin Panel for Modular Architecture

## 📋 **Overview**

This guide will help you migrate your frontend applications to work with the new modular backend architecture. We'll cover React/Next.js frontend, admin panel, mobile apps, and real-time features.

---

## 🏗️ **Architecture Changes**

### **Before: Monolithic Match Data**

```javascript
// Old way - everything in one API call
const match = await api.get(`/matches/${matchId}`);
// match.score, match.ballByBall, match.powerPlays, etc.
```

### **After: Modular Data Fetching**

```javascript
// New way - targeted API calls
const match = await api.get(`/matches/${matchId}`); // Basic info
const innings = await api.get(`/matches/${matchId}/innings`); // Innings data
const balls = await api.get(`/matches/${matchId}/balls`); // Ball-by-ball
const events = await api.get(`/matches/${matchId}/events`); // Timeline
```

---

## 🔧 **1. API SERVICE UPDATES**

### **Update Your API Service Layer**

```typescript
// src/services/api/matches.service.ts
import axios from "axios";

export class MatchesAPIService {
  private baseURL = process.env.NEXT_PUBLIC_API_URL;

  // Basic Match Operations
  async getMatch(matchId: string) {
    const response = await axios.get(`${this.baseURL}/matches/${matchId}`);
    return response.data;
  }

  async getMatches(params = {}) {
    const response = await axios.get(`${this.baseURL}/matches`, { params });
    return response.data;
  }

  async getLiveMatches() {
    const response = await axios.get(`${this.baseURL}/matches/live`);
    return response.data;
  }

  // Innings Data
  async getInnings(matchId: string, inningsNumber?: number) {
    const url = inningsNumber
      ? `${this.baseURL}/matches/${matchId}/innings/${inningsNumber}`
      : `${this.baseURL}/matches/${matchId}/innings`;
    const response = await axios.get(url);
    return response.data;
  }

  async updateInnings(matchId: string, inningsNumber: number, data: any) {
    const response = await axios.patch(
      `${this.baseURL}/matches/${matchId}/innings/${inningsNumber}`,
      data
    );
    return response.data;
  }

  // Ball-by-Ball Data
  async getBalls(matchId: string, filters = {}) {
    const response = await axios.get(
      `${this.baseURL}/matches/${matchId}/balls`,
      {
        params: filters,
      }
    );
    return response.data;
  }

  async addBall(matchId: string, ballData: any) {
    const response = await axios.post(
      `${this.baseURL}/matches/${matchId}/balls`,
      ballData
    );
    return response.data;
  }

  async getLatestBalls(matchId: string, limit = 10) {
    const response = await axios.get(
      `${this.baseURL}/matches/${matchId}/balls/latest`,
      {
        params: { limit },
      }
    );
    return response.data;
  }

  // Player Statistics
  async getPlayerStats(matchId: string, playerId?: string) {
    const url = playerId
      ? `${this.baseURL}/matches/${matchId}/player-stats/${playerId}`
      : `${this.baseURL}/matches/${matchId}/player-stats`;
    const response = await axios.get(url);
    return response.data;
  }

  // Partnerships
  async getPartnerships(matchId: string, innings?: number) {
    const url = innings
      ? `${this.baseURL}/matches/${matchId}/partnerships/${innings}`
      : `${this.baseURL}/matches/${matchId}/partnerships`;
    const response = await axios.get(url);
    return response.data;
  }

  async getBestPartnerships(limit = 10) {
    const response = await axios.get(`${this.baseURL}/partnerships/best`, {
      params: { limit },
    });
    return response.data;
  }

  // Events & Timeline
  async getEvents(matchId: string, filters = {}) {
    const response = await axios.get(
      `${this.baseURL}/matches/${matchId}/events`,
      {
        params: filters,
      }
    );
    return response.data;
  }

  async getHighlights(matchId: string, filters = {}) {
    const response = await axios.get(
      `${this.baseURL}/matches/${matchId}/highlights`,
      {
        params: filters,
      }
    );
    return response.data;
  }

  async addEvent(matchId: string, eventData: any) {
    const response = await axios.post(
      `${this.baseURL}/matches/${matchId}/events`,
      eventData
    );
    return response.data;
  }

  // DRS Reviews
  async getDRSReviews(matchId: string, filters = {}) {
    const response = await axios.get(
      `${this.baseURL}/matches/${matchId}/drs-reviews`,
      {
        params: filters,
      }
    );
    return response.data;
  }

  async addDRSReview(matchId: string, reviewData: any) {
    const response = await axios.post(
      `${this.baseURL}/matches/${matchId}/drs-reviews`,
      reviewData
    );
    return response.data;
  }

  // Match Settings
  async getMatchSettings(matchId: string) {
    const response = await axios.get(
      `${this.baseURL}/matches/${matchId}/settings`
    );
    return response.data;
  }

  async updateMatchSettings(matchId: string, settings: any) {
    const response = await axios.patch(
      `${this.baseURL}/matches/${matchId}/settings`,
      settings
    );
    return response.data;
  }

  // Live State
  async getLiveState(matchId: string) {
    const response = await axios.get(
      `${this.baseURL}/matches/${matchId}/live-state`
    );
    return response.data;
  }

  async updateLiveState(matchId: string, liveState: any) {
    const response = await axios.patch(
      `${this.baseURL}/matches/${matchId}/live-state`,
      liveState
    );
    return response.data;
  }
}

export const matchesAPI = new MatchesAPIService();
```

---

## 🎨 **2. REACT HOOKS FOR DATA MANAGEMENT**

### **Custom Hooks for Modular Data**

```typescript
// src/hooks/useMatch.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { matchesAPI } from "@/services/api/matches.service";

export const useMatch = (matchId: string) => {
  return useQuery({
    queryKey: ["match", matchId],
    queryFn: () => matchesAPI.getMatch(matchId),
    staleTime: 30000, // 30 seconds
  });
};

export const useMatchWithData = (matchId: string) => {
  const queryClient = useQueryClient();

  const match = useQuery({
    queryKey: ["match", matchId],
    queryFn: () => matchesAPI.getMatch(matchId),
  });

  const innings = useQuery({
    queryKey: ["innings", matchId],
    queryFn: () => matchesAPI.getInnings(matchId),
    enabled: !!matchId,
  });

  const recentBalls = useQuery({
    queryKey: ["balls", matchId, "recent"],
    queryFn: () => matchesAPI.getLatestBalls(matchId, 10),
    enabled: !!matchId,
    refetchInterval: 5000, // Refresh every 5 seconds for live matches
  });

  const playerStats = useQuery({
    queryKey: ["player-stats", matchId],
    queryFn: () => matchesAPI.getPlayerStats(matchId),
    enabled: !!matchId,
  });

  const partnerships = useQuery({
    queryKey: ["partnerships", matchId],
    queryFn: () => matchesAPI.getPartnerships(matchId),
    enabled: !!matchId,
  });

  const events = useQuery({
    queryKey: ["events", matchId],
    queryFn: () => matchesAPI.getEvents(matchId),
    enabled: !!matchId,
  });

  return {
    match: match.data,
    innings: innings.data,
    recentBalls: recentBalls.data,
    playerStats: playerStats.data,
    partnerships: partnerships.data,
    events: events.data,
    isLoading: match.isLoading || innings.isLoading,
    error: match.error || innings.error,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      queryClient.invalidateQueries({ queryKey: ["innings", matchId] });
      queryClient.invalidateQueries({ queryKey: ["balls", matchId] });
    },
  };
};

// src/hooks/useInnings.ts
export const useInnings = (matchId: string, inningsNumber?: number) => {
  return useQuery({
    queryKey: ["innings", matchId, inningsNumber],
    queryFn: () => matchesAPI.getInnings(matchId, inningsNumber),
    enabled: !!matchId,
  });
};

export const useUpdateInnings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ matchId, inningsNumber, data }: any) =>
      matchesAPI.updateInnings(matchId, inningsNumber, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["innings", variables.matchId],
      });
      queryClient.invalidateQueries({ queryKey: ["match", variables.matchId] });
    },
  });
};

// src/hooks/useBalls.ts
export const useBalls = (matchId: string, filters = {}) => {
  return useQuery({
    queryKey: ["balls", matchId, filters],
    queryFn: () => matchesAPI.getBalls(matchId, filters),
    enabled: !!matchId,
    refetchInterval: (data) => {
      // Refetch every 2 seconds for live matches
      return data?.some((ball: any) => ball.isLive) ? 2000 : false;
    },
  });
};

export const useAddBall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ matchId, ballData }: any) =>
      matchesAPI.addBall(matchId, ballData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["balls", variables.matchId] });
      queryClient.invalidateQueries({
        queryKey: ["innings", variables.matchId],
      });
      queryClient.invalidateQueries({ queryKey: ["match", variables.matchId] });
    },
  });
};

// src/hooks/usePlayerStats.ts
export const usePlayerStats = (matchId: string, playerId?: string) => {
  return useQuery({
    queryKey: ["player-stats", matchId, playerId],
    queryFn: () => matchesAPI.getPlayerStats(matchId, playerId),
    enabled: !!matchId,
  });
};

// src/hooks/usePartnerships.ts
export const usePartnerships = (matchId: string, innings?: number) => {
  return useQuery({
    queryKey: ["partnerships", matchId, innings],
    queryFn: () => matchesAPI.getPartnerships(matchId, innings),
    enabled: !!matchId,
  });
};

export const useBestPartnerships = (limit = 10) => {
  return useQuery({
    queryKey: ["partnerships", "best", limit],
    queryFn: () => matchesAPI.getBestPartnerships(limit),
    staleTime: 300000, // 5 minutes
  });
};

// src/hooks/useEvents.ts
export const useEvents = (matchId: string, filters = {}) => {
  return useQuery({
    queryKey: ["events", matchId, filters],
    queryFn: () => matchesAPI.getEvents(matchId, filters),
    enabled: !!matchId,
  });
};

export const useHighlights = (matchId: string, filters = {}) => {
  return useQuery({
    queryKey: ["highlights", matchId, filters],
    queryFn: () => matchesAPI.getHighlights(matchId, filters),
    enabled: !!matchId,
  });
};
```

---

## 🔄 **3. WEBSOCKET INTEGRATION**

### **Real-time Updates with Socket.IO**

```typescript
// src/services/websocket.service.ts
import { io, Socket } from "socket.io-client";
import { matchesAPI } from "./api/matches.service";

class WebSocketService {
  private socket: Socket | null = null;
  private matchId: string | null = null;

  connect(token: string) {
    this.socket = io(process.env.NEXT_PUBLIC_WS_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });

    // Match events
    this.socket.on("ball.added", (data) => {
      this.handleBallUpdate(data);
    });

    this.socket.on("innings.updated", (data) => {
      this.handleInningsUpdate(data);
    });

    this.socket.on("match.updated", (data) => {
      this.handleMatchUpdate(data);
    });

    this.socket.on("event.added", (data) => {
      this.handleEventUpdate(data);
    });

    this.socket.on("highlight.added", (data) => {
      this.handleHighlightUpdate(data);
    });
  }

  joinMatch(matchId: string) {
    if (this.socket && matchId) {
      this.matchId = matchId;
      this.socket.emit("join_match", { matchId });
    }
  }

  leaveMatch() {
    if (this.socket && this.matchId) {
      this.socket.emit("leave_match", { matchId: this.matchId });
      this.matchId = null;
    }
  }

  // Real-time update handlers
  private handleBallUpdate(data: any) {
    // Trigger React Query cache updates
    window.dispatchEvent(new CustomEvent("ball-update", { detail: data }));
  }

  private handleInningsUpdate(data: any) {
    window.dispatchEvent(new CustomEvent("innings-update", { detail: data }));
  }

  private handleMatchUpdate(data: any) {
    window.dispatchEvent(new CustomEvent("match-update", { detail: data }));
  }

  private handleEventUpdate(data: any) {
    window.dispatchEvent(new CustomEvent("event-update", { detail: data }));
  }

  private handleHighlightUpdate(data: any) {
    window.dispatchEvent(new CustomEvent("highlight-update", { detail: data }));
  }

  // Admin/Scorer actions
  addBall(matchId: string, ballData: any) {
    if (this.socket) {
      this.socket.emit("ball.add", { matchId, ballData });
    }
  }

  updateMatch(matchId: string, updateData: any) {
    if (this.socket) {
      this.socket.emit("match.update", { matchId, updateData });
    }
  }

  addEvent(matchId: string, eventData: any) {
    if (this.socket) {
      this.socket.emit("event.add", { matchId, eventData });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const websocketService = new WebSocketService();

// React hook for WebSocket
export const useWebSocket = (matchId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (matchId) {
      websocketService.joinMatch(matchId);

      const handleBallUpdate = (event: any) => {
        queryClient.invalidateQueries({ queryKey: ["balls", matchId] });
        queryClient.invalidateQueries({ queryKey: ["innings", matchId] });
      };

      const handleInningsUpdate = (event: any) => {
        queryClient.invalidateQueries({ queryKey: ["innings", matchId] });
        queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      };

      const handleMatchUpdate = (event: any) => {
        queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      };

      const handleEventUpdate = (event: any) => {
        queryClient.invalidateQueries({ queryKey: ["events", matchId] });
      };

      window.addEventListener("ball-update", handleBallUpdate);
      window.addEventListener("innings-update", handleInningsUpdate);
      window.addEventListener("match-update", handleMatchUpdate);
      window.addEventListener("event-update", handleEventUpdate);

      return () => {
        websocketService.leaveMatch();
        window.removeEventListener("ball-update", handleBallUpdate);
        window.removeEventListener("innings-update", handleInningsUpdate);
        window.removeEventListener("match-update", handleMatchUpdate);
        window.removeEventListener("event-update", handleEventUpdate);
      };
    }
  }, [matchId, queryClient]);
};
```

---

## 🎨 **4. UPDATED REACT COMPONENTS**

### **Live Match Dashboard Component**

```typescript
// src/components/matches/LiveMatchDashboard.tsx
import React from "react";
import { useMatchWithData, useWebSocket } from "@/hooks";
import { Scorecard } from "./Scorecard";
import { BallByBall } from "./BallByBall";
import { PlayerStats } from "./PlayerStats";
import { Partnerships } from "./Partnerships";
import { Timeline } from "./Timeline";

interface LiveMatchDashboardProps {
  matchId: string;
}

export const LiveMatchDashboard: React.FC<LiveMatchDashboardProps> = ({
  matchId,
}) => {
  const {
    match,
    innings,
    recentBalls,
    playerStats,
    partnerships,
    events,
    isLoading,
    error,
  } = useMatchWithData(matchId);

  // Enable real-time updates
  useWebSocket(matchId);

  if (isLoading) {
    return <div className="animate-pulse">Loading match data...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">Error loading match: {error.message}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Match Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {match?.name}
              </h1>
              <p className="text-gray-600">{match?.venue}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Status</div>
              <div
                className={`text-lg font-semibold ${
                  match?.status === "in_progress"
                    ? "text-green-600"
                    : match?.status === "completed"
                    ? "text-gray-600"
                    : "text-yellow-600"
                }`}
              >
                {match?.status?.replace("_", " ").toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Scorecard */}
      <Scorecard match={match} innings={innings} />

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Ball by Ball */}
          <div className="lg:col-span-2">
            <BallByBall matchId={matchId} balls={recentBalls} />
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            <PlayerStats matchId={matchId} stats={playerStats} />
            <Partnerships matchId={matchId} partnerships={partnerships} />
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-8">
          <Timeline matchId={matchId} events={events} />
        </div>
      </div>
    </div>
  );
};
```

### **Scorecard Component**

```typescript
// src/components/matches/Scorecard.tsx
import React from "react";
import { useInnings } from "@/hooks";

interface ScorecardProps {
  match: any;
  innings: any[];
}

export const Scorecard: React.FC<ScorecardProps> = ({ match, innings }) => {
  const currentInnings = innings?.find(
    (inning) => inning.inningsNumber === match?.currentInnings
  );

  return (
    <div className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {innings?.map((inning) => (
            <div key={inning.inningsNumber} className="text-center">
              <div className="text-lg font-semibold text-gray-900 mb-2">
                {inning.battingTeam?.name || `Team ${inning.inningsNumber}`}
              </div>

              <div className="text-4xl font-bold text-blue-600 mb-2">
                {inning.runs}/{inning.wickets}
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <div>Overs: {inning.overs}</div>
                <div>Run Rate: {inning.runRate?.toFixed(2)}</div>
                {inning.requiredRunRate > 0 && (
                  <div>Required RR: {inning.requiredRunRate?.toFixed(2)}</div>
                )}
              </div>

              {/* Power Play Info */}
              {inning.currentPowerPlay?.isActive && (
                <div className="mt-3 p-2 bg-yellow-100 rounded-md">
                  <div className="text-xs font-medium text-yellow-800">
                    Power Play Active
                  </div>
                  <div className="text-xs text-yellow-600">
                    Over {inning.currentPowerPlay.startOver}-
                    {inning.currentPowerPlay.endOver}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Current Players */}
        {currentInnings && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-500">Striker</div>
                <div className="font-medium">
                  {currentInnings.currentPlayers?.striker?.name || "Not Set"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Non-Striker</div>
                <div className="font-medium">
                  {currentInnings.currentPlayers?.nonStriker?.name || "Not Set"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Bowler</div>
                <div className="font-medium">
                  {currentInnings.currentPlayers?.bowler?.name || "Not Set"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

### **Ball by Ball Component**

```typescript
// src/components/matches/BallByBall.tsx
import React from "react";
import { useBalls } from "@/hooks";

interface BallByBallProps {
  matchId: string;
  balls?: any[];
}

export const BallByBall: React.FC<BallByBallProps> = ({
  matchId,
  balls: initialBalls,
}) => {
  const { data: balls = initialBalls || [] } = useBalls(matchId, { limit: 20 });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ball by Ball</h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {balls.map((ball: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <div className="flex items-center space-x-3">
              <div className="text-sm font-medium text-gray-600">
                {ball.over}.{ball.ball}
              </div>

              <div className="flex items-center space-x-2">
                {ball.eventType === "wicket" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    WICKET
                  </span>
                )}

                {ball.runs === 4 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    4
                  </span>
                )}

                {ball.runs === 6 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    6
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {ball.runs} run{ball.runs !== 1 ? "s" : ""}
              </div>
              {ball.commentary && (
                <div className="text-xs text-gray-600 mt-1">
                  {ball.commentary}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 🛠️ **5. ADMIN PANEL UPDATES**

### **Admin Dashboard Component**

```typescript
// src/components/admin/AdminDashboard.tsx
import React, { useState } from "react";
import { useMatches } from "@/hooks";
import { LiveScoringPanel } from "./LiveScoringPanel";
import { MatchManagement } from "./MatchManagement";
import { PlayerStatsManagement } from "./PlayerStatsManagement";

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("live-scoring");
  const { data: matches } = useMatches({ status: "in_progress" });

  const tabs = [
    { id: "live-scoring", label: "Live Scoring", component: LiveScoringPanel },
    {
      id: "match-management",
      label: "Match Management",
      component: MatchManagement,
    },
    {
      id: "player-stats",
      label: "Player Stats",
      component: PlayerStatsManagement,
    },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>

            {/* Live Matches Indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">
                {matches?.length || 0} live matches
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};
```

### **Live Scoring Panel**

```typescript
// src/components/admin/LiveScoringPanel.tsx
import React, { useState } from "react";
import { useAddBall, useUpdateInnings } from "@/hooks";
import { websocketService } from "@/services/websocket.service";

interface LiveScoringPanelProps {
  matchId?: string;
}

export const LiveScoringPanel: React.FC<LiveScoringPanelProps> = ({
  matchId,
}) => {
  const [selectedMatch, setSelectedMatch] = useState(matchId);
  const [ballData, setBallData] = useState({
    eventType: "runs",
    runs: 0,
    striker: "",
    nonStriker: "",
    bowler: "",
    commentary: "",
  });

  const addBallMutation = useAddBall();
  const updateInningsMutation = useUpdateInnings();

  const handleAddBall = async () => {
    if (!selectedMatch) return;

    try {
      // Add ball via WebSocket for real-time updates
      websocketService.addBall(selectedMatch, ballData);

      // Reset form
      setBallData({
        eventType: "runs",
        runs: 0,
        striker: "",
        nonStriker: "",
        bowler: "",
        commentary: "",
      });
    } catch (error) {
      console.error("Error adding ball:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Live Scoring</h2>

      {/* Match Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Match
        </label>
        <select
          value={selectedMatch}
          onChange={(e) => setSelectedMatch(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a match...</option>
          {/* Add match options here */}
        </select>
      </div>

      {selectedMatch && (
        <div className="space-y-6">
          {/* Ball Input Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <select
                value={ballData.eventType}
                onChange={(e) =>
                  setBallData({ ...ballData, eventType: e.target.value })
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="runs">Runs</option>
                <option value="wicket">Wicket</option>
                <option value="extra">Extra</option>
                <option value="over_change">Over Change</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Runs
              </label>
              <input
                type="number"
                min="0"
                max="6"
                value={ballData.runs}
                onChange={(e) =>
                  setBallData({ ...ballData, runs: parseInt(e.target.value) })
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commentary
              </label>
              <input
                type="text"
                value={ballData.commentary}
                onChange={(e) =>
                  setBallData({ ...ballData, commentary: e.target.value })
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ball commentary..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleAddBall}
              disabled={addBallMutation.isPending}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {addBallMutation.isPending ? "Adding..." : "Add Ball"}
            </button>

            <button
              onClick={() => setBallData({ ...ballData, eventType: "wicket" })}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
            >
              Wicket
            </button>

            <button
              onClick={() => setBallData({ ...ballData, runs: 4 })}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Four
            </button>

            <button
              onClick={() => setBallData({ ...ballData, runs: 6 })}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              Six
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 📱 **6. MOBILE APP UPDATES**

### **React Native Components**

```typescript
// src/components/mobile/LiveMatchScreen.tsx
import React from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useMatchWithData, useWebSocket } from "@/hooks";

interface LiveMatchScreenProps {
  matchId: string;
}

export const LiveMatchScreen: React.FC<LiveMatchScreenProps> = ({
  matchId,
}) => {
  const { match, innings, recentBalls, isLoading, refetch } =
    useMatchWithData(matchId);

  useWebSocket(matchId);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
    >
      {/* Match Header */}
      <View style={{ backgroundColor: "white", padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{match?.name}</Text>
        <Text style={{ color: "#666", marginTop: 4 }}>{match?.venue}</Text>
      </View>

      {/* Scorecard */}
      <View
        style={{
          backgroundColor: "white",
          margin: 16,
          padding: 16,
          borderRadius: 8,
        }}
      >
        {innings?.map((inning: any) => (
          <View key={inning.inningsNumber} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              {inning.battingTeam?.name || `Team ${inning.inningsNumber}`}
            </Text>
            <Text
              style={{ fontSize: 24, fontWeight: "bold", color: "#3b82f6" }}
            >
              {inning.runs}/{inning.wickets}
            </Text>
            <Text style={{ color: "#666", fontSize: 14 }}>
              Overs: {inning.overs} | RR: {inning.runRate?.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Recent Balls */}
      <View
        style={{
          backgroundColor: "white",
          margin: 16,
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>
          Ball by Ball
        </Text>
        {recentBalls?.slice(0, 10).map((ball: any, index: number) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: "#f0f0f0",
            }}
          >
            <View>
              <Text style={{ fontSize: 14, fontWeight: "500" }}>
                {ball.over}.{ball.ball}
              </Text>
              {ball.commentary && (
                <Text style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                  {ball.commentary}
                </Text>
              )}
            </View>
            <Text style={{ fontSize: 14, fontWeight: "600" }}>
              {ball.runs} run{ball.runs !== 1 ? "s" : ""}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
```

---

## 📊 **7. ANALYTICS DASHBOARD**

### **Analytics Components**

```typescript
// src/components/analytics/AnalyticsDashboard.tsx
import React from "react";
import { useBestPartnerships, usePlayerStats } from "@/hooks";
import { PartnershipChart } from "./PartnershipChart";
import { PlayerPerformanceChart } from "./PlayerPerformanceChart";

export const AnalyticsDashboard: React.FC = () => {
  const { data: bestPartnerships } = useBestPartnerships(20);
  const { data: topScorers } = usePlayerStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Analytics Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Best Partnerships */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Best Partnerships
            </h2>
            <PartnershipChart partnerships={bestPartnerships} />
          </div>

          {/* Player Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Top Performers
            </h2>
            <PlayerPerformanceChart players={topScorers} />
          </div>

          {/* Match Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Match Statistics
            </h2>
            {/* Add charts and stats here */}
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## 🚀 **8. MIGRATION CHECKLIST**

### **Frontend Migration Steps**

- [ ] **1. Update API Services**

  - [ ] Replace monolithic API calls with modular endpoints
  - [ ] Add new service methods for each collection
  - [ ] Update error handling for new response formats

- [ ] **2. Update React Hooks**

  - [ ] Create hooks for each data type (matches, innings, balls, etc.)
  - [ ] Add React Query for caching and synchronization
  - [ ] Implement optimistic updates

- [ ] **3. Refactor Components**

  - [ ] Update match components to use modular data
  - [ ] Add real-time WebSocket integration
  - [ ] Implement efficient re-rendering strategies

- [ ] **4. Admin Panel Updates**

  - [ ] Update live scoring interface
  - [ ] Add modular data management
  - [ ] Implement real-time admin features

- [ ] **5. Mobile App Updates**

  - [ ] Update React Native components
  - [ ] Add offline support for modular data
  - [ ] Implement push notifications for events

- [ ] **6. Testing**
  - [ ] Unit tests for new hooks and services
  - [ ] Integration tests for API calls
  - [ ] E2E tests for user workflows

### **Performance Optimizations**

- [ ] **Caching Strategy**

  - [ ] Implement proper cache invalidation
  - [ ] Add background data updates
  - [ ] Use cache-first strategies for static data

- [ ] **Real-time Updates**

  - [ ] Optimize WebSocket connection management
  - [ ] Implement selective data updates
  - [ ] Add connection retry logic

- [ ] **Bundle Optimization**
  - [ ] Code splitting for different sections
  - [ ] Lazy loading for analytics components
  - [ ] Optimize asset loading

---

## 🎯 **Expected Benefits**

### **Performance Improvements**

- **3-5x Faster Page Loads**: Modular data loading
- **Real-time Updates**: Sub-second ball-by-ball updates
- **Reduced Bandwidth**: Only fetch needed data
- **Better Caching**: Granular cache management

### **User Experience**

- **Instant Navigation**: Cached data for quick transitions
- **Live Updates**: Real-time match progress
- **Offline Support**: Cached data availability
- **Responsive Design**: Optimized for all devices

### **Developer Experience**

- **Modular Code**: Easier to maintain and extend
- **Type Safety**: Better TypeScript integration
- **Testing**: Isolated component testing
- **Debugging**: Clear data flow and error handling

---

This migration will transform your frontend into a high-performance, real-time cricket platform that fully leverages the new modular backend architecture!
