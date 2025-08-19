# 🏏 Cricket Platform Frontend Development Instructions

## 📋 Overview

This document provides comprehensive instructions for building the React frontend for the cricket live-score platform. The backend is complete with all features implemented.

## 🛠️ Technology Stack

### **Core Technologies**

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router v6** for routing
- **Socket.IO Client** for real-time updates
- **Axios** for API communication
- **Tailwind CSS** for styling
- **React Query (TanStack Query)** for state management
- **Zustand** for global state
- **React Hook Form** for form handling
- **React Hot Toast** for notifications

### **Additional Libraries**

- **React Icons** for icons
- **Recharts** for charts and analytics
- **React Table** for data tables
- **React Calendar** for date pickers
- **React Dropzone** for file uploads
- **React Select** for dropdowns
- **React Modal** for modals
- **React Skeleton** for loading states

## 🏗️ Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Loading.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── Pagination.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ForgotPassword.tsx
│   ├── matches/
│   │   ├── MatchCard.tsx
│   │   ├── LiveScore.tsx
│   │   ├── Scorecard.tsx
│   │   ├── Commentary.tsx
│   │   ├── BallByBall.tsx
│   │   └── MatchStats.tsx
│   ├── news/
│   │   ├── NewsCard.tsx
│   │   ├── NewsList.tsx
│   │   ├── NewsDetail.tsx
│   │   └── NewsEditor.tsx
│   ├── tournaments/
│   │   ├── TournamentCard.tsx
│   │   ├── TournamentList.tsx
│   │   ├── PointsTable.tsx
│   │   └── Bracket.tsx
│   ├── fantasy/
│   │   ├── LeagueCard.tsx
│   │   ├── TeamBuilder.tsx
│   │   ├── Leaderboard.tsx
│   │   └── ContestCard.tsx
│   ├── analytics/
│   │   ├── PlayerStats.tsx
│   │   ├── TeamStats.tsx
│   │   ├── ComparisonChart.tsx
│   │   └── RankingsTable.tsx
│   ├── community/
│   │   ├── CommentSection.tsx
│   │   ├── DiscussionCard.tsx
│   │   ├── QuizCard.tsx
│   │   └── PollCard.tsx
│   └── premium/
│       ├── PlanCard.tsx
│       ├── FeatureList.tsx
│       └── PaymentForm.tsx
├── pages/
│   ├── Home.tsx
│   ├── Matches.tsx
│   ├── News.tsx
│   ├── Tournaments.tsx
│   ├── Fantasy.tsx
│   ├── Analytics.tsx
│   ├── Community.tsx
│   ├── Premium.tsx
│   └── Admin/
│       ├── Dashboard.tsx
│       ├── UserManagement.tsx
│       ├── MatchManagement.tsx
│       └── ContentManagement.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useSocket.ts
│   ├── useMatches.ts
│   ├── useNews.ts
│   ├── useTournaments.ts
│   ├── useFantasy.ts
│   ├── useAnalytics.ts
│   └── useCommunity.ts
├── services/
│   ├── api.ts
│   ├── socket.ts
│   ├── auth.ts
│   ├── matches.ts
│   ├── news.ts
│   ├── tournaments.ts
│   ├── fantasy.ts
│   ├── analytics.ts
│   └── community.ts
├── stores/
│   ├── authStore.ts
│   ├── matchStore.ts
│   ├── userStore.ts
│   └── uiStore.ts
├── types/
│   ├── auth.ts
│   ├── matches.ts
│   ├── news.ts
│   ├── tournaments.ts
│   ├── fantasy.ts
│   ├── analytics.ts
│   └── community.ts
├── utils/
│   ├── constants.ts
│   ├── helpers.ts
│   ├── formatters.ts
│   └── validators.ts
└── styles/
    ├── index.css
    └── components.css
```

## 🚀 Setup Instructions

### **1. Create React Project**

```bash
npm create vite@latest cricket-frontend -- --template react-ts
cd cricket-frontend
```

### **2. Install Dependencies**

```bash
npm install react-router-dom @tanstack/react-query zustand axios socket.io-client
npm install react-hook-form @hookform/resolvers yup react-hot-toast
npm install tailwindcss postcss autoprefixer
npm install react-icons recharts react-table
npm install react-dropzone react-select react-modal
npm install react-skeleton react-calendar
npm install -D @types/react-router-dom
```

### **3. Configure Tailwind CSS**

```bash
npx tailwindcss init -p
```

### **4. Environment Variables**

Create `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
VITE_APP_NAME=Cricket Live Score
```

## 📱 Key Features Implementation

### **1. Authentication System**

- **Login/Register Forms** with validation
- **JWT Token Management** with automatic refresh
- **Role-based Access Control** (Admin, Scorer, Viewer)
- **Protected Routes** for different user types
- **Password Reset** functionality

### **2. Live Match Coverage**

- **Real-time Score Updates** via WebSocket
- **Ball-by-Ball Commentary** with timestamps
- **Live Scorecard** with player statistics
- **Match Timeline** with key events
- **Player Performance** tracking
- **Strike Rotation** management
- **Over-by-Over** analysis

### **3. News & Content Management**

- **News Articles** with rich text editor
- **Category Filtering** (Breaking, Analysis, Preview, Review)
- **Search Functionality** with tags
- **Featured News** carousel
- **Related Content** suggestions
- **SEO Optimization** for articles
- **Admin Content Management** interface

### **4. Tournament Management**

- **Tournament Listings** with filters
- **Series Management** (Bilateral, Multilateral)
- **Points Tables** with sorting
- **Bracket Visualization** for knockout stages
- **Match Scheduling** interface
- **Results & Statistics** tracking
- **Team Performance** analytics

### **5. Fantasy Cricket**

- **League Creation** and management
- **Team Builder** with player selection
- **Captain/Vice-Captain** selection
- **Points Calculation** in real-time
- **Leaderboards** with rankings
- **Contest Management** with entry fees
- **Prize Distribution** tracking

### **6. Advanced Analytics**

- **Player Statistics** with detailed breakdowns
- **Team Performance** metrics
- **Match Analytics** with insights
- **Comparison Tools** for players/teams
- **Rankings Tables** with filters
- **Performance Trends** visualization
- **Head-to-Head** statistics

### **7. Community Features**

- **Comment System** on matches/news
- **Discussion Forums** with categories
- **Cricket Quizzes** with scoring
- **User Polls** with voting
- **User Profiles** with activity
- **Moderation Tools** for admins
- **Report System** for inappropriate content

### **8. Premium Features**

- **Subscription Plans** (Basic, Premium, Pro, Enterprise)
- **Payment Integration** (Stripe, PayPal)
- **Feature Access Control** based on plan
- **Usage Tracking** for premium features
- **Billing Management** interface
- **Plan Comparison** charts
- **Upgrade/Downgrade** functionality

## 🔌 API Integration

### **Complete API Endpoints Reference**

#### **Authentication Endpoints**

```typescript
// services/auth.ts
export const authApi = {
  // Login
  login: (credentials: { email: string; password: string }) =>
    api.post("/auth/login", credentials),

  // Register
  register: (userData: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }) => api.post("/auth/register", userData),

  // Refresh Token
  refreshToken: () => api.post("/auth/refresh"),

  // Logout
  logout: () => api.post("/auth/logout"),

  // Forgot Password
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  // Reset Password
  resetPassword: (token: string, password: string) =>
    api.post("/auth/reset-password", { token, password }),

  // Get Current User
  getCurrentUser: () => api.get("/auth/me"),

  // Update Profile
  updateProfile: (data: any) => api.put("/auth/profile", data),

  // Change Password
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put("/auth/change-password", data),
};
```

#### **Matches Endpoints**

```typescript
// services/matches.ts
export const matchesApi = {
  // Get all matches
  getMatches: (filters?: any) => api.get("/matches", { params: filters }),

  // Get match by ID
  getMatch: (id: string) => api.get(`/matches/${id}`),

  // Create match
  createMatch: (data: any) => api.post("/matches", data),

  // Update match
  updateMatch: (id: string, data: any) => api.put(`/matches/${id}`, data),

  // Delete match
  deleteMatch: (id: string) => api.delete(`/matches/${id}`),

  // Get match state
  getMatchState: (id: string) => api.get(`/matches/${id}/state`),

  // Update match status
  updateMatchStatus: (id: string, status: any) =>
    api.put(`/matches/${id}/status`, status),

  // Get match players
  getMatchPlayers: (id: string) => api.get(`/matches/${id}/players`),

  // Add player to match
  addPlayerToMatch: (matchId: string, playerData: any) =>
    api.post(`/matches/${matchId}/players`, playerData),

  // Remove player from match
  removePlayerFromMatch: (matchId: string, playerId: string) =>
    api.delete(`/matches/${matchId}/players/${playerId}`),

  // Get playing XI
  getPlayingXI: (id: string) => api.get(`/matches/${id}/playing-xi`),

  // Update playing XI
  updatePlayingXI: (id: string, data: any) =>
    api.put(`/matches/${id}/playing-xi`, data),

  // Get match commentary
  getCommentary: (id: string) => api.get(`/matches/${id}/commentary`),

  // Add commentary
  addCommentary: (id: string, data: any) =>
    api.post(`/matches/${id}/commentary`, data),

  // Get match statistics
  getMatchStats: (id: string) => api.get(`/matches/${id}/stats`),

  // Get match timeline
  getMatchTimeline: (id: string) => api.get(`/matches/${id}/timeline`),
};
```

#### **Balls Endpoints**

```typescript
// services/balls.ts
export const ballsApi = {
  // Get balls for match
  getBalls: (matchId: string, filters?: any) =>
    api.get(`/matches/${matchId}/balls`, { params: filters }),

  // Add ball
  addBall: (matchId: string, ballData: any) =>
    api.post(`/matches/${matchId}/balls`, ballData),

  // Update ball
  updateBall: (matchId: string, ballId: string, data: any) =>
    api.put(`/matches/${matchId}/balls/${ballId}`, data),

  // Delete ball
  deleteBall: (matchId: string, ballId: string) =>
    api.delete(`/matches/${matchId}/balls/${ballId}`),

  // Undo last ball
  undoLastBall: (matchId: string) => api.post(`/matches/${matchId}/balls/undo`),

  // Get ball statistics
  getBallStats: (matchId: string) => api.get(`/matches/${matchId}/balls/stats`),
};
```

#### **Teams Endpoints**

```typescript
// services/teams.ts
export const teamsApi = {
  // Get all teams
  getTeams: (filters?: any) => api.get("/teams", { params: filters }),

  // Get team by ID
  getTeam: (id: string) => api.get(`/teams/${id}`),

  // Create team
  createTeam: (data: any) => api.post("/teams", data),

  // Update team
  updateTeam: (id: string, data: any) => api.put(`/teams/${id}`, data),

  // Delete team
  deleteTeam: (id: string) => api.delete(`/teams/${id}`),

  // Get team players
  getTeamPlayers: (id: string) => api.get(`/teams/${id}/players`),

  // Add player to team
  addPlayerToTeam: (teamId: string, playerData: any) =>
    api.post(`/teams/${teamId}/players`, playerData),

  // Remove player from team
  removePlayerFromTeam: (teamId: string, playerId: string) =>
    api.delete(`/teams/${teamId}/players/${playerId}`),

  // Get team statistics
  getTeamStats: (id: string) => api.get(`/teams/${id}/stats`),

  // Get team matches
  getTeamMatches: (id: string) => api.get(`/teams/${id}/matches`),
};
```

#### **Players Endpoints**

```typescript
// services/players.ts
export const playersApi = {
  // Get all players
  getPlayers: (filters?: any) => api.get("/players", { params: filters }),

  // Get player by ID
  getPlayer: (id: string) => api.get(`/players/${id}`),

  // Create player
  createPlayer: (data: any) => api.post("/players", data),

  // Update player
  updatePlayer: (id: string, data: any) => api.put(`/players/${id}`, data),

  // Delete player
  deletePlayer: (id: string) => api.delete(`/players/${id}`),

  // Get player statistics
  getPlayerStats: (id: string) => api.get(`/players/${id}/stats`),

  // Get player matches
  getPlayerMatches: (id: string) => api.get(`/players/${id}/matches`),

  // Upload player photo
  uploadPhoto: (id: string, file: File) => {
    const formData = new FormData();
    formData.append("photo", file);
    return api.post(`/players/${id}/photo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
```

#### **News Endpoints**

```typescript
// services/news.ts
export const newsApi = {
  // Get all news
  getNews: (filters?: any) => api.get("/news", { params: filters }),

  // Get news by ID
  getNewsById: (id: string) => api.get(`/news/${id}`),

  // Create news
  createNews: (data: any) => api.post("/news", data),

  // Update news
  updateNews: (id: string, data: any) => api.put(`/news/${id}`, data),

  // Delete news
  deleteNews: (id: string) => api.delete(`/news/${id}`),

  // Get news by category
  getNewsByCategory: (category: string) =>
    api.get(`/news/category/${category}`),

  // Search news
  searchNews: (query: string) =>
    api.get("/news/search", { params: { q: query } }),

  // Get featured news
  getFeaturedNews: () => api.get("/news/featured"),

  // Get related news
  getRelatedNews: (id: string) => api.get(`/news/${id}/related`),
};
```

#### **Tournaments Endpoints**

```typescript
// services/tournaments.ts
export const tournamentsApi = {
  // Get all tournaments
  getTournaments: (filters?: any) =>
    api.get("/tournaments", { params: filters }),

  // Get tournament by ID
  getTournament: (id: string) => api.get(`/tournaments/${id}`),

  // Create tournament
  createTournament: (data: any) => api.post("/tournaments", data),

  // Update tournament
  updateTournament: (id: string, data: any) =>
    api.put(`/tournaments/${id}`, data),

  // Delete tournament
  deleteTournament: (id: string) => api.delete(`/tournaments/${id}`),

  // Get tournament matches
  getTournamentMatches: (id: string) => api.get(`/tournaments/${id}/matches`),

  // Get tournament teams
  getTournamentTeams: (id: string) => api.get(`/tournaments/${id}/teams`),

  // Get points table
  getPointsTable: (id: string) => api.get(`/tournaments/${id}/points-table`),

  // Get tournament statistics
  getTournamentStats: (id: string) => api.get(`/tournaments/${id}/stats`),
};
```

#### **Fantasy Endpoints**

```typescript
// services/fantasy.ts
export const fantasyApi = {
  // Get user leagues
  getUserLeagues: () => api.get("/fantasy/leagues"),

  // Create league
  createLeague: (data: any) => api.post("/fantasy/leagues", data),

  // Join league
  joinLeague: (leagueId: string, data: any) =>
    api.post(`/fantasy/leagues/${leagueId}/join`, data),

  // Get league details
  getLeague: (id: string) => api.get(`/fantasy/leagues/${id}`),

  // Get league leaderboard
  getLeagueLeaderboard: (id: string) =>
    api.get(`/fantasy/leagues/${id}/leaderboard`),

  // Create team
  createTeam: (leagueId: string, data: any) =>
    api.post(`/fantasy/leagues/${leagueId}/teams`, data),

  // Update team
  updateTeam: (leagueId: string, teamId: string, data: any) =>
    api.put(`/fantasy/leagues/${leagueId}/teams/${teamId}`, data),

  // Get team
  getTeam: (leagueId: string, teamId: string) =>
    api.get(`/fantasy/leagues/${leagueId}/teams/${teamId}`),

  // Get contests
  getContests: (filters?: any) =>
    api.get("/fantasy/contests", { params: filters }),

  // Join contest
  joinContest: (contestId: string, data: any) =>
    api.post(`/fantasy/contests/${contestId}/join`, data),
};
```

#### **Analytics Endpoints**

```typescript
// services/analytics.ts
export const analyticsApi = {
  // Get player analytics
  getPlayerAnalytics: (playerId: string, filters?: any) =>
    api.get(`/analytics/players/${playerId}`, { params: filters }),

  // Get team analytics
  getTeamAnalytics: (teamId: string, filters?: any) =>
    api.get(`/analytics/teams/${teamId}`, { params: filters }),

  // Get match analytics
  getMatchAnalytics: (matchId: string) =>
    api.get(`/analytics/matches/${matchId}`),

  // Get comparison data
  getComparison: (type: string, ids: string[]) =>
    api.get("/analytics/comparison", { params: { type, ids } }),

  // Get rankings
  getRankings: (category: string, filters?: any) =>
    api.get(`/analytics/rankings/${category}`, { params: filters }),

  // Get trends
  getTrends: (filters?: any) =>
    api.get("/analytics/trends", { params: filters }),
};
```

#### **Community Endpoints**

```typescript
// services/community.ts
export const communityApi = {
  // Get comments
  getComments: (type: string, id: string) =>
    api.get(`/community/comments/${type}/${id}`),

  // Add comment
  addComment: (type: string, id: string, data: any) =>
    api.post(`/community/comments/${type}/${id}`, data),

  // Update comment
  updateComment: (commentId: string, data: any) =>
    api.put(`/community/comments/${commentId}`, data),

  // Delete comment
  deleteComment: (commentId: string) =>
    api.delete(`/community/comments/${commentId}`),

  // Get discussions
  getDiscussions: (filters?: any) =>
    api.get("/community/discussions", { params: filters }),

  // Create discussion
  createDiscussion: (data: any) => api.post("/community/discussions", data),

  // Get quizzes
  getQuizzes: (filters?: any) =>
    api.get("/community/quizzes", { params: filters }),

  // Submit quiz answer
  submitQuizAnswer: (quizId: string, data: any) =>
    api.post(`/community/quizzes/${quizId}/submit`, data),

  // Get polls
  getPolls: (filters?: any) => api.get("/community/polls", { params: filters }),

  // Vote in poll
  voteInPoll: (pollId: string, data: any) =>
    api.post(`/community/polls/${pollId}/vote`, data),
};
```

#### **Premium Endpoints**

```typescript
// services/premium.ts
export const premiumApi = {
  // Get subscription plans
  getPlans: () => api.get("/premium/plans"),

  // Get user subscription
  getUserSubscription: () => api.get("/premium/subscription"),

  // Subscribe to plan
  subscribe: (planId: string, data: any) =>
    api.post(`/premium/subscribe/${planId}`, data),

  // Cancel subscription
  cancelSubscription: () => api.post("/premium/cancel"),

  // Get billing history
  getBillingHistory: () => api.get("/premium/billing"),

  // Update payment method
  updatePaymentMethod: (data: any) => api.put("/premium/payment-method", data),
};
```

#### **Admin Endpoints**

```typescript
// services/admin.ts
export const adminApi = {
  // Get all users
  getUsers: (filters?: any) => api.get("/admin/users", { params: filters }),

  // Update user
  updateUser: (userId: string, data: any) =>
    api.put(`/admin/users/${userId}`, data),

  // Delete user
  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),

  // Get system stats
  getSystemStats: () => api.get("/admin/stats"),

  // Get audit logs
  getAuditLogs: (filters?: any) =>
    api.get("/admin/audit-logs", { params: filters }),

  // Get system health
  getSystemHealth: () => api.get("/admin/health"),
};
```

#### **AI Agents Endpoints**

```typescript
// services/agents.ts
export const agentsApi = {
  // Get match agent
  getMatchAgent: (matchId: string) => api.get(`/matches/${matchId}/agent`),

  // Start agent
  startAgent: (matchId: string) => api.post(`/matches/${matchId}/agent/start`),

  // Stop agent
  stopAgent: (matchId: string) => api.post(`/matches/${matchId}/agent/stop`),

  // Pause agent
  pauseAgent: (matchId: string) => api.post(`/matches/${matchId}/agent/pause`),

  // Resume agent
  resumeAgent: (matchId: string) =>
    api.post(`/matches/${matchId}/agent/resume`),

  // Execute command
  executeCommand: (matchId: string, command: string) =>
    api.post(`/matches/${matchId}/agent/command`, { command }),

  // Get all agents
  getAllAgents: () => api.get("/agents"),

  // Execute global command
  executeGlobalCommand: (command: string) =>
    api.post("/agents/command", { command }),
};
```

#### **Scrapers Endpoints**

```typescript
// services/scrapers.ts
export const scrapersApi = {
  // Scrape match data
  scrapeMatch: (matchId: string) =>
    api.post(`/scrapers/matches/${matchId}/scrape`),

  // Get scraping status
  getScrapingStatus: () => api.get("/scrapers/status"),

  // Get scraping metrics
  getScrapingMetrics: () => api.get("/scrapers/metrics"),

  // Get selector failures
  getSelectorFailures: (filters?: any) =>
    api.get("/selectors/failures", { params: filters }),

  // Update selector
  updateSelector: (source: string, field: string, selector: string) =>
    api.put(`/selectors/sources/${source}/${field}`, { selector }),

  // Get selector config
  getSelectorConfig: () => api.get("/selectors/config"),

  // Get system health
  getSystemHealth: () => api.get("/selectors/health"),
};
```

### **Complete WebSocket Events Reference**

#### **Client-to-Server Events**

```typescript
// services/socket.ts
class SocketService {
  // Join match room
  joinMatch(matchId: string) {
    this.socket?.emit("join_match", { matchId });
  }

  // Leave match room
  leaveMatch(matchId: string) {
    this.socket?.emit("leave_match", { matchId });
  }

  // Apply ball event
  applyBall(matchId: string, ballData: any) {
    this.socket?.emit("ball.apply", { matchId, ...ballData });
  }

  // Undo ball event
  undoBall(matchId: string) {
    this.socket?.emit("ball.undo", { matchId });
  }

  // Update player
  updatePlayer(matchId: string, playerData: any) {
    this.socket?.emit("player.update", { matchId, ...playerData });
  }

  // Admin command
  executeAdminCommand(matchId: string, command: string) {
    this.socket?.emit("admin.command", { matchId, command });
  }
}
```

#### **Server-to-Client Events**

```typescript
// services/socket.ts
class SocketService {
  // Listen for score state updates
  onScoreState(callback: (data: any) => void) {
    this.socket?.on("score.state", callback);
  }

  // Listen for score difference updates
  onScoreDiff(callback: (data: any) => void) {
    this.socket?.on("score.diff", callback);
  }

  // Listen for ball applied events
  onBallApplied(callback: (data: any) => void) {
    this.socket?.on("ball.applied", callback);
  }

  // Listen for ball undone events
  onBallUndone(callback: (data: any) => void) {
    this.socket?.on("ball.undone", callback);
  }

  // Listen for odds updates
  onOddsUpdate(callback: (data: any) => void) {
    this.socket?.on("odds.update", callback);
  }

  // Listen for review needed alerts
  onReviewNeeded(callback: (data: any) => void) {
    this.socket?.on("alert.reviewNeeded", callback);
  }

  // Listen for match status updates
  onMatchStatusUpdate(callback: (data: any) => void) {
    this.socket?.on("match.status", callback);
  }

  // Listen for player updates
  onPlayerUpdate(callback: (data: any) => void) {
    this.socket?.on("player.update", callback);
  }

  // Listen for commentary updates
  onCommentaryUpdate(callback: (data: any) => void) {
    this.socket?.on("commentary.update", callback);
  }

  // Listen for system alerts
  onSystemAlert(callback: (data: any) => void) {
    this.socket?.on("system.alert", callback);
  }
}
```

### **Usage Examples**

#### **Live Match Component**

```typescript
// components/matches/LiveMatch.tsx
import { useEffect, useState } from "react";
import { socketService } from "../../services/socket";
import { matchesApi } from "../../services/matches";

export const LiveMatch = ({ matchId }: { matchId: string }) => {
  const [matchData, setMatchData] = useState(null);
  const [liveScore, setLiveScore] = useState(null);

  useEffect(() => {
    // Join match room
    socketService.joinMatch(matchId);

    // Load initial match data
    matchesApi.getMatch(matchId).then(setMatchData);

    // Listen for live updates
    socketService.onScoreState((data) => {
      setLiveScore(data);
    });

    socketService.onBallApplied((data) => {
      // Update ball-by-ball commentary
      console.log("New ball:", data);
    });

    return () => {
      socketService.leaveMatch(matchId);
    };
  }, [matchId]);

  return <div>{/* Live match UI */}</div>;
};
```

#### **Admin Dashboard Component**

```typescript
// components/admin/Dashboard.tsx
import { useQuery, useMutation } from "@tanstack/react-query";
import { adminApi } from "../../services/admin";
import { agentsApi } from "../../services/agents";

export const AdminDashboard = () => {
  const { data: systemStats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: adminApi.getSystemStats,
  });

  const { data: agents } = useQuery({
    queryKey: ["agents"],
    queryFn: agentsApi.getAllAgents,
  });

  const executeCommand = useMutation({
    mutationFn: (command: string) => agentsApi.executeGlobalCommand(command),
  });

  return <div>{/* Admin dashboard UI */}</div>;
};
```

### **Base API Configuration**

```typescript
// services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Request interceptor for auth
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
      // Handle token refresh or logout
    }
    return Promise.reject(error);
  }
);
```

### **WebSocket Integration**

```typescript
// services/socket.ts
import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    this.socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });
  }

  joinMatch(matchId: string) {
    this.socket?.emit("join_match", { matchId });
  }

  leaveMatch(matchId: string) {
    this.socket?.emit("leave_match", { matchId });
  }

  onScoreUpdate(callback: (data: any) => void) {
    this.socket?.on("score.state", callback);
  }

  onBallUpdate(callback: (data: any) => void) {
    this.socket?.on("ball.applied", callback);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
```

## 🎨 UI/UX Guidelines

### **Design System**

- **Color Palette**: Cricket-themed colors (green, white, gold)
- **Typography**: Clean, readable fonts (Inter, Roboto)
- **Icons**: Consistent icon set (React Icons)
- **Spacing**: 8px grid system
- **Components**: Reusable component library

### **Responsive Design**

- **Mobile First** approach
- **Breakpoints**: 320px, 768px, 1024px, 1440px
- **Touch-friendly** interactions
- **Progressive Web App** features

### **Loading States**

- **Skeleton Loaders** for content
- **Spinners** for actions
- **Progressive Loading** for images
- **Optimistic Updates** for better UX

### **Error Handling**

- **Error Boundaries** for component errors
- **Toast Notifications** for user feedback
- **Fallback UI** for failed requests
- **Retry Mechanisms** for network issues

## 🔐 Security Considerations

### **Authentication**

- **Token Storage** in secure HTTP-only cookies
- **Token Refresh** before expiration
- **Logout** on all devices
- **Session Management** with proper cleanup

### **Data Protection**

- **Input Validation** on client and server
- **XSS Prevention** with proper escaping
- **CSRF Protection** with tokens
- **Rate Limiting** for API calls

### **Privacy**

- **GDPR Compliance** for user data
- **Cookie Consent** management
- **Data Encryption** in transit
- **Secure Payment** processing

## 📊 Performance Optimization

### **Code Splitting**

- **Route-based** code splitting
- **Component-level** lazy loading
- **Dynamic imports** for heavy components
- **Bundle Analysis** with webpack-bundle-analyzer

### **Caching Strategy**

- **React Query** for API caching
- **Service Worker** for offline support
- **Image Optimization** with lazy loading
- **CDN Integration** for static assets

### **Monitoring**

- **Error Tracking** with Sentry
- **Performance Monitoring** with Lighthouse
- **User Analytics** with Google Analytics
- **Real User Monitoring** (RUM)

## 🧪 Testing Strategy

### **Unit Testing**

- **Jest** for test runner
- **React Testing Library** for component tests
- **Mock Service Worker** for API mocking
- **Coverage Reports** with thresholds

### **Integration Testing**

- **Cypress** for E2E testing
- **API Testing** with Supertest
- **WebSocket Testing** with Socket.IO testing
- **Cross-browser** testing

### **Performance Testing**

- **Lighthouse CI** for performance budgets
- **Bundle Size** monitoring
- **Load Testing** for WebSocket connections
- **Memory Leak** detection

## 🚀 Deployment

### **Build Process**

```bash
npm run build
npm run preview
```

### **Environment Configuration**

- **Development**: Local development server
- **Staging**: Pre-production testing
- **Production**: Live environment

### **CI/CD Pipeline**

- **GitHub Actions** for automation
- **Docker** containerization
- **Cloud Deployment** (Vercel, Netlify, AWS)
- **Database Migrations** automation

## 📈 Analytics & Monitoring

### **User Analytics**

- **Page Views** tracking
- **User Behavior** analysis
- **Feature Usage** metrics
- **Conversion Funnel** analysis

### **Performance Metrics**

- **Core Web Vitals** monitoring
- **API Response Times** tracking
- **Error Rates** monitoring
- **User Experience** metrics

## 🔄 State Management

### **Global State (Zustand)**

```typescript
// stores/authStore.ts
import { create } from "zustand";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  login: async (credentials) => {
    // Login logic
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
```

### **Server State (React Query)**

```typescript
// hooks/useMatches.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { matchesApi } from "../services/matches";

export const useMatches = (filters?: MatchFilters) => {
  return useQuery({
    queryKey: ["matches", filters],
    queryFn: () => matchesApi.getMatches(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: matchesApi.createMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });
};
```

## 🎯 Key Implementation Priorities

### **Phase 1: Core Features**

1. **Authentication System**
2. **Basic Match Display**
3. **Live Score Updates**
4. **News Section**

### **Phase 2: Advanced Features**

1. **Tournament Management**
2. **Fantasy Cricket**
3. **Analytics Dashboard**
4. **Community Features**

### **Phase 3: Premium Features**

1. **Subscription System**
2. **Payment Integration**
3. **Advanced Analytics**
4. **Admin Panel**

## 📞 Support & Resources

### **Documentation**

- **API Documentation**: Swagger UI at `/api/docs`
- **Component Library**: Storybook for UI components
- **Code Standards**: ESLint + Prettier configuration
- **Git Guidelines**: Conventional commits

### **Development Tools**

- **VS Code Extensions**: Recommended extensions list
- **Debugging**: React DevTools, Redux DevTools
- **Performance**: React Profiler, Lighthouse
- **Testing**: Jest, Cypress, Testing Library

---

**🎉 This comprehensive frontend implementation will create a world-class cricket platform that rivals the best in the industry! 🏏✨**
