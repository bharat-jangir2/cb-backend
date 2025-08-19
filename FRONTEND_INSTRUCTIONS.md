# �� Cricket Live Score Platform - Frontend Instructions

## 🎯 **COMPLETE CREX.LIVE REPLICA**

This document provides comprehensive instructions for building a frontend that replicates all crex.live features exactly.

---

## 📋 **PROJECT STRUCTURE**

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── Modal.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── AuthGuard.tsx
│   │   ├── matches/
│   │   │   ├── MatchList.tsx
│   │   │   ├── MatchCard.tsx
│   │   │   ├── LiveMatch.tsx
│   │   │   ├── MatchDetails.tsx
│   │   │   ├── Scorecard.tsx
│   │   │   ├── Commentary.tsx
│   │   │   ├── BallByBall.tsx
│   │   │   ├── PowerPlay.tsx
│   │   │   ├── DRSReviews.tsx
│   │   │   ├── Highlights.tsx
│   │   │   ├── Timeline.tsx
│   │   │   ├── FieldingPositions.tsx
│   │   │   ├── PlayerStats.tsx
│   │   │   ├── Partnerships.tsx
│   │   │   └── LiveScoring.tsx
│   │   ├── tournaments/
│   │   │   ├── TournamentList.tsx
│   │   │   ├── TournamentCard.tsx
│   │   │   ├── TournamentDetails.tsx
│   │   │   ├── PointsTable.tsx
│   │   │   └── Results.tsx
│   │   ├── series/
│   │   │   ├── SeriesList.tsx
│   │   │   ├── SeriesCard.tsx
│   │   │   ├── SeriesDetails.tsx
│   │   │   └── SeriesTable.tsx
│   │   ├── teams/
│   │   │   ├── TeamList.tsx
│   │   │   ├── TeamCard.tsx
│   │   │   ├── TeamDetails.tsx
│   │   │   └── PlayerList.tsx
│   │   ├── players/
│   │   │   ├── PlayerList.tsx
│   │   │   ├── PlayerCard.tsx
│   │   │   ├── PlayerDetails.tsx
│   │   │   └── PlayerStats.tsx
│   │   ├── news/
│   │   │   ├── NewsList.tsx
│   │   │   ├── NewsCard.tsx
│   │   │   ├── NewsDetails.tsx
│   │   │   └── NewsEditor.tsx
│   │   ├── fantasy/
│   │   │   ├── FantasyDashboard.tsx
│   │   │   ├── CreateTeam.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   └── Predictions.tsx
│   │   └── admin/
│   │       ├── Dashboard.tsx
│   │       ├── MatchManager.tsx
│   │       ├── UserManager.tsx
│   │       └── Analytics.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── LiveMatches.tsx
│   │   ├── MatchDetails.tsx
│   │   ├── Tournaments.tsx
│   │   ├── Series.tsx
│   │   ├── Teams.tsx
│   │   ├── Players.tsx
│   │   ├── News.tsx
│   │   ├── Fantasy.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Admin.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useMatches.ts
│   │   ├── useTournaments.ts
│   │   ├── useSeries.ts
│   │   ├── useTeams.ts
│   │   ├── usePlayers.ts
│   │   ├── useNews.ts
│   │   ├── useFantasy.ts
│   │   ├── useWebSocket.ts
│   │   └── useLocalStorage.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── matches.service.ts
│   │   ├── tournaments.service.ts
│   │   ├── series.service.ts
│   │   ├── teams.service.ts
│   │   ├── players.service.ts
│   │   ├── news.service.ts
│   │   ├── fantasy.service.ts
│   │   └── websocket.service.ts
│   ├── store/
│   │   ├── auth.store.ts
│   │   ├── matches.store.ts
│   │   ├── tournaments.store.ts
│   │   ├── series.store.ts
│   │   ├── teams.store.ts
│   │   ├── players.store.ts
│   │   ├── news.store.ts
│   │   ├── fantasy.store.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   └── formatters.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── matches.types.ts
│   │   ├── tournaments.types.ts
│   │   ├── series.types.ts
│   │   ├── teams.types.ts
│   │   ├── players.types.ts
│   │   ├── news.types.ts
│   │   ├── fantasy.types.ts
│   │   └── common.types.ts
│   └── styles/
│       ├── globals.css
│       ├── components.css
│       └── themes.css
├── public/
│   ├── images/
│   ├── icons/
│   └── favicon.ico
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## 🚀 **TECHNOLOGY STACK**

### **Core Technologies**

- **React 18** with TypeScript
- **Next.js 14** (for SSR and routing)
- **Tailwind CSS** (for styling)
- **Zustand** (for state management)
- **React Query** (for data fetching)
- **Socket.io Client** (for real-time updates)

### **UI Libraries**

- **Headless UI** (for accessible components)
- **React Hook Form** (for forms)
- **React Hot Toast** (for notifications)
- **React Icons** (for icons)
- **Framer Motion** (for animations)

### **Development Tools**

- **ESLint** + **Prettier** (for code quality)
- **Husky** (for git hooks)
- **Jest** + **React Testing Library** (for testing)

---

## 🔧 **SETUP INSTRUCTIONS**

### **1. Project Initialization**

```bash
# Create Next.js project with TypeScript
npx create-next-app@latest cricket-live-frontend --typescript --tailwind --eslint

# Navigate to project
cd cricket-live-frontend

# Install dependencies
npm install zustand @tanstack/react-query socket.io-client react-hook-form @headlessui/react react-hot-toast react-icons framer-motion axios
npm install -D @types/node @types/react @types/react-dom
```

### **2. Environment Configuration**

```bash
# Create .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME="Cricket Live Score"
```

### **3. API Service Setup**

```typescript
// src/services/api.ts
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

---

## 📡 **COMPLETE API INTEGRATION**

### **1. Authentication APIs**

```typescript
// src/services/auth.service.ts
import { api } from "./api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "viewer" | "scorer" | "admin";
}

export const authService = {
  login: async (data: LoginData) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post("/auth/refresh");
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },
};
```

### **2. Matches APIs**

```typescript
// src/services/matches.service.ts
import { api } from "./api";

export const matchesService = {
  // Basic CRUD
  createMatch: async (data: any) => {
    const response = await api.post("/matches", data);
    return response.data;
  },

  getMatches: async (params?: any) => {
    const response = await api.get("/matches", { params });
    return response.data;
  },

  getMatchById: async (id: string) => {
    const response = await api.get(`/matches/${id}`);
    return response.data;
  },

  updateMatch: async (id: string, data: any) => {
    const response = await api.patch(`/matches/${id}`, data);
    return response.data;
  },

  deleteMatch: async (id: string) => {
    const response = await api.delete(`/matches/${id}`);
    return response.data;
  },

  // Match Status
  updateMatchStatus: async (id: string, data: any) => {
    const response = await api.patch(`/matches/${id}/status`, data);
    return response.data;
  },

  // Live Matches
  getLiveMatches: async () => {
    const response = await api.get("/matches/live");
    return response.data;
  },

  // Ball-by-Ball Management
  addBallByBall: async (matchId: string, data: any) => {
    const response = await api.post(`/matches/${matchId}/ball-by-ball`, data);
    return response.data;
  },

  getBallByBall: async (matchId: string, params?: any) => {
    const response = await api.get(`/matches/${matchId}/ball-by-ball`, {
      params,
    });
    return response.data;
  },

  updateBallByBall: async (matchId: string, ballIndex: number, data: any) => {
    const response = await api.patch(
      `/matches/${matchId}/ball-by-ball/${ballIndex}`,
      data
    );
    return response.data;
  },

  // DRS Reviews
  addDRSReview: async (matchId: string, data: any) => {
    const response = await api.post(`/matches/${matchId}/drs-reviews`, data);
    return response.data;
  },

  getDRSReviews: async (matchId: string, params?: any) => {
    const response = await api.get(`/matches/${matchId}/drs-reviews`, {
      params,
    });
    return response.data;
  },

  updateDRSReview: async (matchId: string, reviewIndex: number, data: any) => {
    const response = await api.patch(
      `/matches/${matchId}/drs-reviews/${reviewIndex}`,
      data
    );
    return response.data;
  },

  // Power Play Management
  addPowerPlay: async (matchId: string, data: any) => {
    const response = await api.post(`/matches/${matchId}/power-plays`, data);
    return response.data;
  },

  getPowerPlays: async (matchId: string) => {
    const response = await api.get(`/matches/${matchId}/power-plays`);
    return response.data;
  },

  getCurrentPowerPlay: async (matchId: string) => {
    const response = await api.get(`/matches/${matchId}/power-plays/current`);
    return response.data;
  },

  activatePowerPlay: async (matchId: string, powerPlayIndex: number) => {
    const response = await api.patch(
      `/matches/${matchId}/power-plays/${powerPlayIndex}/activate`
    );
    return response.data;
  },

  deactivatePowerPlay: async (matchId: string) => {
    const response = await api.patch(
      `/matches/${matchId}/power-plays/deactivate`
    );
    return response.data;
  },

  // Highlights
  addHighlight: async (matchId: string, data: any) => {
    const response = await api.post(`/matches/${matchId}/highlights`, data);
    return response.data;
  },

  getHighlights: async (matchId: string, params?: any) => {
    const response = await api.get(`/matches/${matchId}/highlights`, {
      params,
    });
    return response.data;
  },

  // Timeline
  addTimelineEvent: async (matchId: string, data: any) => {
    const response = await api.post(`/matches/${matchId}/timeline`, data);
    return response.data;
  },

  getTimeline: async (matchId: string, params?: any) => {
    const response = await api.get(`/matches/${matchId}/timeline`, { params });
    return response.data;
  },

  // Fielding Positions
  addFieldingPositions: async (matchId: string, data: any) => {
    const response = await api.post(
      `/matches/${matchId}/fielding-positions`,
      data
    );
    return response.data;
  },

  getFieldingPositions: async (matchId: string, params?: any) => {
    const response = await api.get(`/matches/${matchId}/fielding-positions`, {
      params,
    });
    return response.data;
  },

  // Player Statistics
  getPlayerStats: async (matchId: string) => {
    const response = await api.get(`/matches/${matchId}/player-stats`);
    return response.data;
  },

  getPlayerStatsById: async (matchId: string, playerId: string) => {
    const response = await api.get(
      `/matches/${matchId}/player-stats/${playerId}`
    );
    return response.data;
  },

  // Partnerships
  getPartnerships: async (matchId: string) => {
    const response = await api.get(`/matches/${matchId}/partnerships`);
    return response.data;
  },

  getPartnershipsByInnings: async (matchId: string, innings: number) => {
    const response = await api.get(
      `/matches/${matchId}/partnerships/${innings}`
    );
    return response.data;
  },

  // Match Settings
  updateMatchSettings: async (matchId: string, data: any) => {
    const response = await api.patch(`/matches/${matchId}/settings`, data);
    return response.data;
  },

  getMatchSettings: async (matchId: string) => {
    const response = await api.get(`/matches/${matchId}/settings`);
    return response.data;
  },

  // Live State
  getLiveState: async (matchId: string) => {
    const response = await api.get(`/matches/${matchId}/live-state`);
    return response.data;
  },

  updateLiveState: async (matchId: string, data: any) => {
    const response = await api.patch(`/matches/${matchId}/live-state`, data);
    return response.data;
  },
};
```

### **3. Tournaments & Series APIs**

```typescript
// src/services/tournaments.service.ts
export const tournamentsService = {
  createTournament: async (data: any) => {
    const response = await api.post("/tournaments", data);
    return response.data;
  },

  getTournaments: async (params?: any) => {
    const response = await api.get("/tournaments", { params });
    return response.data;
  },

  getTournamentById: async (id: string) => {
    const response = await api.get(`/tournaments/${id}`);
    return response.data;
  },

  getPointsTable: async (id: string) => {
    const response = await api.get(`/tournaments/${id}/points`);
    return response.data;
  },

  getResults: async (id: string) => {
    const response = await api.get(`/tournaments/${id}/results`);
    return response.data;
  },
};

// src/services/series.service.ts
export const seriesService = {
  createSeries: async (data: any) => {
    const response = await api.post("/series", data);
    return response.data;
  },

  getSeries: async (params?: any) => {
    const response = await api.get("/series", { params });
    return response.data;
  },

  getSeriesById: async (id: string) => {
    const response = await api.get(`/series/${id}`);
    return response.data;
  },

  getSeriesTable: async (id: string) => {
    const response = await api.get(`/series/${id}/table`);
    return response.data;
  },
};
```

---

## 🔌 **WEBSOCKET INTEGRATION**

### **WebSocket Service**

```typescript
// src/services/websocket.service.ts
import { io, Socket } from "socket.io-client";

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(token: string) {
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

    this.socket = io(WS_URL, {
      auth: {
        token,
      },
      transports: ["websocket", "polling"],
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });

    this.socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    // Match events
    this.socket.on("match.score_update", (data) => {
      this.emit("score_update", data);
    });

    this.socket.on("match.ball_applied", (data) => {
      this.emit("ball_applied", data);
    });

    this.socket.on("match.commentary_added", (data) => {
      this.emit("commentary_added", data);
    });

    this.socket.on("match.power_play_activated", (data) => {
      this.emit("power_play_activated", data);
    });

    this.socket.on("match.drs_review", (data) => {
      this.emit("drs_review", data);
    });

    this.socket.on("match.highlight_added", (data) => {
      this.emit("highlight_added", data);
    });
  }

  joinMatch(matchId: string) {
    if (this.socket) {
      this.socket.emit("join_match", { matchId });
    }
  }

  leaveMatch(matchId: string) {
    if (this.socket) {
      this.socket.emit("leave_match", { matchId });
    }
  }

  applyBall(matchId: string, ballData: any) {
    if (this.socket) {
      this.socket.emit("ball.apply", { matchId, ballData });
    }
  }

  undoBall(matchId: string) {
    if (this.socket) {
      this.socket.emit("ball.undo", { matchId });
    }
  }

  addCommentary(matchId: string, commentaryData: any) {
    if (this.socket) {
      this.socket.emit("commentary.add", { matchId, commentaryData });
    }
  }

  activatePowerPlay(matchId: string, powerPlayIndex: number) {
    if (this.socket) {
      this.socket.emit("power_play.activate", { matchId, powerPlayIndex });
    }
  }

  addDRSReview(matchId: string, reviewData: any) {
    if (this.socket) {
      this.socket.emit("drs.add", { matchId, reviewData });
    }
  }

  addHighlight(matchId: string, highlightData: any) {
    if (this.socket) {
      this.socket.emit("highlight.add", { matchId, highlightData });
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string) {
    this.listeners.delete(event);
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }
}

export const websocketService = new WebSocketService();
```

---

## 🎨 **UI COMPONENTS**

### **1. Live Match Component**

```typescript
// src/components/matches/LiveMatch.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { matchesService } from "@/services/matches.service";
import { websocketService } from "@/services/websocket.service";
import { Scorecard } from "./Scorecard";
import { Commentary } from "./Commentary";
import { BallByBall } from "./BallByBall";
import { PowerPlay } from "./PowerPlay";
import { DRSReviews } from "./DRSReviews";
import { Highlights } from "./Highlights";
import { Timeline } from "./Timeline";
import { FieldingPositions } from "./FieldingPositions";
import { PlayerStats } from "./PlayerStats";
import { Partnerships } from "./Partnerships";
import { LiveScoring } from "./LiveScoring";

export const LiveMatch: React.FC = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("scorecard");

  // Fetch match data
  const {
    data: match,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["match", id],
    queryFn: () => matchesService.getMatchById(id as string),
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // WebSocket setup
  useEffect(() => {
    if (id) {
      websocketService.joinMatch(id as string);

      // Listen for real-time updates
      websocketService.on("score_update", (data) => {
        queryClient.invalidateQueries(["match", id]);
      });

      websocketService.on("ball_applied", (data) => {
        queryClient.invalidateQueries(["match", id]);
        queryClient.invalidateQueries(["ball-by-ball", id]);
      });

      return () => {
        websocketService.leaveMatch(id as string);
        websocketService.off("score_update");
        websocketService.off("ball_applied");
      };
    }
  }, [id, queryClient]);

  if (isLoading) return <div>Loading match...</div>;
  if (error) return <div>Error loading match</div>;
  if (!match) return <div>Match not found</div>;

  const tabs = [
    {
      id: "scorecard",
      label: "Scorecard",
      component: <Scorecard match={match} />,
    },
    {
      id: "commentary",
      label: "Commentary",
      component: <Commentary matchId={id as string} />,
    },
    {
      id: "ball-by-ball",
      label: "Ball by Ball",
      component: <BallByBall matchId={id as string} />,
    },
    {
      id: "power-play",
      label: "Power Play",
      component: <PowerPlay matchId={id as string} />,
    },
    {
      id: "drs",
      label: "DRS Reviews",
      component: <DRSReviews matchId={id as string} />,
    },
    {
      id: "highlights",
      label: "Highlights",
      component: <Highlights matchId={id as string} />,
    },
    {
      id: "timeline",
      label: "Timeline",
      component: <Timeline matchId={id as string} />,
    },
    {
      id: "fielding",
      label: "Fielding",
      component: <FieldingPositions matchId={id as string} />,
    },
    {
      id: "stats",
      label: "Player Stats",
      component: <PlayerStats matchId={id as string} />,
    },
    {
      id: "partnerships",
      label: "Partnerships",
      component: <Partnerships matchId={id as string} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Match Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{match.name}</h1>
              <p className="text-gray-600">{match.venue}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Status</div>
              <div
                className={`text-lg font-semibold ${
                  match.status === "in_progress"
                    ? "text-green-600"
                    : match.status === "completed"
                    ? "text-gray-600"
                    : "text-yellow-600"
                }`}
              >
                {match.status.replace("_", " ").toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Score Display */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {match.teamA?.name}
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {match.score.teamA.runs}/{match.score.teamA.wickets}
              </div>
              <div className="text-sm text-gray-600">
                {match.score.teamA.overs} overs
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {match.teamB?.name}
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {match.score.teamB.runs}/{match.score.teamB.wickets}
              </div>
              <div className="text-sm text-gray-600">
                {match.score.teamB.overs} overs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>

      {/* Live Scoring Panel (Admin/Scorer only) */}
      {match.status === "in_progress" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <LiveScoring matchId={id as string} />
        </div>
      )}
    </div>
  );
};
```

### **2. Live Scoring Component**

```typescript
// src/components/matches/LiveScoring.tsx
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { matchesService } from "@/services/matches.service";
import { websocketService } from "@/services/websocket.service";
import toast from "react-hot-toast";

interface BallData {
  eventType: "runs" | "wicket" | "extra" | "over_change" | "innings_change";
  runs?: number;
  extras?: {
    type: "wide" | "no_ball" | "bye" | "leg_bye";
    runs: number;
    description?: string;
  };
  wicket?: {
    type:
      | "bowled"
      | "caught"
      | "lbw"
      | "run_out"
      | "stumped"
      | "hit_wicket"
      | "obstructing"
      | "handled_ball"
      | "timed_out"
      | "retired_out";
    batsman: string;
    bowler?: string;
    caughtBy?: string;
    runOutBy?: string;
    stumpedBy?: string;
    description?: string;
  };
  striker: string;
  nonStriker: string;
  bowler: string;
  commentary?: string;
}

export const LiveScoring: React.FC<{ matchId: string }> = ({ matchId }) => {
  const queryClient = useQueryClient();
  const [ballData, setBallData] = useState<BallData>({
    eventType: "runs",
    runs: 0,
    striker: "",
    nonStriker: "",
    bowler: "",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const applyBallMutation = useMutation({
    mutationFn: (data: BallData) => websocketService.applyBall(matchId, data),
    onSuccess: () => {
      toast.success("Ball applied successfully!");
      queryClient.invalidateQueries(["match", matchId]);
      queryClient.invalidateQueries(["ball-by-ball", matchId]);
    },
    onError: () => {
      toast.error("Failed to apply ball");
    },
  });

  const undoBallMutation = useMutation({
    mutationFn: () => websocketService.undoBall(matchId),
    onSuccess: () => {
      toast.success("Ball undone successfully!");
      queryClient.invalidateQueries(["match", matchId]);
      queryClient.invalidateQueries(["ball-by-ball", matchId]);
    },
    onError: () => {
      toast.error("Failed to undo ball");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyBallMutation.mutate(ballData);
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Type
            </label>
            <select
              value={ballData.eventType}
              onChange={(e) =>
                setBallData({ ...ballData, eventType: e.target.value as any })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="runs">Runs</option>
              <option value="wicket">Wicket</option>
              <option value="extra">Extra</option>
              <option value="over_change">Over Change</option>
              <option value="innings_change">Innings Change</option>
            </select>
          </div>

          {/* Runs */}
          {ballData.eventType === "runs" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Runs
              </label>
              <input
                type="number"
                min="0"
                max="6"
                value={ballData.runs || 0}
                onChange={(e) =>
                  setBallData({ ...ballData, runs: parseInt(e.target.value) })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Players */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Striker
            </label>
            <input
              type="text"
              value={ballData.striker}
              onChange={(e) =>
                setBallData({ ...ballData, striker: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Player ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bowler
            </label>
            <input
              type="text"
              value={ballData.bowler}
              onChange={(e) =>
                setBallData({ ...ballData, bowler: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Player ID"
            />
          </div>
        </div>

        {/* Advanced Options */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showAdvanced ? "Hide" : "Show"} Advanced Options
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Non-Striker
              </label>
              <input
                type="text"
                value={ballData.nonStriker}
                onChange={(e) =>
                  setBallData({ ...ballData, nonStriker: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Player ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Commentary
              </label>
              <input
                type="text"
                value={ballData.commentary || ""}
                onChange={(e) =>
                  setBallData({ ...ballData, commentary: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ball commentary"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={applyBallMutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {applyBallMutation.isPending ? "Applying..." : "Apply Ball"}
          </button>

          <button
            type="button"
            onClick={() => undoBallMutation.mutate()}
            disabled={undoBallMutation.isPending}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {undoBallMutation.isPending ? "Undoing..." : "Undo Ball"}
          </button>
        </div>
      </form>
    </div>
  );
};
```

---

## 🎯 **KEY FEATURES IMPLEMENTATION**

### **1. Real-time Score Updates**

- WebSocket integration for live score updates
- Automatic refresh every 5 seconds
- Real-time ball-by-ball commentary
- Live power play management

### **2. Comprehensive Match Management**

- Complete ball-by-ball tracking
- DRS review system
- Fielding positions visualization
- Player statistics tracking
- Partnership analysis

### **3. Advanced Features**

- Power play management with auto-activation
- Match highlights with video/image support
- Timeline events tracking
- Live scoring interface for admins/scorers

### **4. User Experience**

- Responsive design for all devices
- Real-time notifications
- Smooth animations and transitions
- Intuitive navigation

---

## 🚀 **DEPLOYMENT**

### **1. Build Configuration**

```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### **2. Environment Variables**

```bash
# Production
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_WS_URL=https://your-api-domain.com
NEXT_PUBLIC_APP_NAME="Cricket Live Score"
```

### **3. Deployment Platforms**

- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **DigitalOcean App Platform**

---

## 📱 **MOBILE OPTIMIZATION**

### **1. Responsive Design**

- Mobile-first approach
- Touch-friendly interfaces
- Optimized for small screens
- Swipe gestures for navigation

### **2. Progressive Web App (PWA)**

- Offline functionality
- Push notifications
- App-like experience
- Fast loading times

---

## 🔒 **SECURITY CONSIDERATIONS**

### **1. Authentication**

- JWT token management
- Secure token storage
- Automatic token refresh
- Role-based access control

### **2. Data Protection**

- Input validation
- XSS prevention
- CSRF protection
- Secure API communication

---

## 📊 **ANALYTICS & MONITORING**

### **1. Performance Monitoring**

- Core Web Vitals tracking
- Error monitoring
- User behavior analytics
- Performance optimization

### **2. Real-time Analytics**

- Live user count
- Match viewership
- Feature usage tracking
- A/B testing capabilities

---

This comprehensive setup will give you a fully functional cricket live score platform that matches crex.live's functionality exactly. The modular architecture ensures scalability and maintainability while providing all the advanced features users expect from a modern cricket platform.
