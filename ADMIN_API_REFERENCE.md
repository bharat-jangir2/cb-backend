# 🏏 Cricket Live Score - Admin Dashboard API Reference

## 📋 **Base URL**

```
http://localhost:5000/api
```

## 🔐 **Authentication**

All admin endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 🎯 **1. AUTHENTICATION ENDPOINTS**

### **User Registration & Login**

```typescript
// Register new user
POST /auth/register
Body: {
  username: string,
  email: string,
  password: string,
  role?: UserRole (default: VIEWER)
}

// Login user
POST /auth/login
Body: {
  username: string,
  password: string
}

// Refresh token
POST /auth/refresh
Body: {
  refreshToken: string
}

// Logout
POST /auth/logout
Headers: Authorization: Bearer <token>
```

### **User Availability Checks**

```typescript
// Check username availability
GET /users/check-username/:username

// Check email availability
GET /users/check-email/:email
```

---

## 👥 **2. USER MANAGEMENT ENDPOINTS**

### **User CRUD Operations**

```typescript
// Get all users (Admin/Scorer only)
GET /users?page=1&limit=10

// Get user by ID (Admin/Scorer only)
GET /users/:id

// Create user (Admin only)
POST /users
Body: {
  username: string,
  email: string,
  password: string,
  role: UserRole
}

// Update user (Admin only)
PATCH /users/:id
Body: {
  username?: string,
  email?: string,
  role?: UserRole,
  isActive?: boolean
}

// Delete user (Admin only)
DELETE /users/:id

// Get current user profile
GET /users/profile/me
```

---

## 🏏 **3. MATCH MANAGEMENT ENDPOINTS**

### **Match CRUD Operations**

```typescript
// Create new match (Admin/Scorer only)
POST /matches
Body: {
  team1Id: string,
  team2Id: string,
  tournamentId?: string,
  seriesId?: string,
  venue: string,
  startTime: Date,
  format: string,
  description?: string
}

// Get all matches
GET /matches?page=1&limit=10

// Get live matches
GET /matches/live

// Get matches by status
GET /matches/status/:status

// Get match by ID
GET /matches/:id

// Update match (Admin/Scorer only)
PATCH /matches/:id
Body: {
  team1Id?: string,
  team2Id?: string,
  venue?: string,
  startTime?: Date,
  format?: string,
  description?: string
}

// Update match status (Admin/Scorer only)
PATCH /matches/:id/status
Body: {
  status: MatchStatus
}

// Delete match (Admin only)
DELETE /matches/:id
```

### **Match State & Details**

```typescript
// Get current match state
GET /matches/:id/state

// Get match squad
GET /matches/:id/squad

// Update match squad (Admin/Scorer only)
PATCH /matches/:id/squad
Body: {
  team1Squad: string[],
  team2Squad: string[]
}

// Get playing XI
GET /matches/:id/playing-xi

// Update playing XI (Admin/Scorer only)
PATCH /matches/:id/playing-xi
Body: {
  team1PlayingXI: string[],
  team2PlayingXI: string[]
}
```

### **Toss Management**

```typescript
// Get toss information
GET /matches/:id/toss

// Update toss information (Admin/Scorer only)
PATCH /matches/:id/toss
Body: {
  winner: string,
  decision: string,
  electedTo: string
}
```

### **Strike Rotation**

```typescript
// Get current strike rotation
GET /matches/:id/strike-rotation

// Update strike rotation (Admin/Scorer only)
PATCH /matches/:id/strike-rotation
Body: {
  striker: string,
  nonStriker: string,
  bowler: string
}
```

### **Commentary Management**

```typescript
// Get match commentary
GET /matches/:id/commentary?over=1&innings=1

// Add match commentary (Admin/Scorer only)
POST /matches/:id/commentary
Body: {
  over: number,
  ball: number,
  innings: number,
  commentary: string,
  type: string
}
```

### **Notifications**

```typescript
// Get match notifications
GET /matches/:id/notifications?type=break

// Add match notification (Admin/Scorer only)
POST /matches/:id/notifications
Body: {
  type: string,
  message: string,
  priority: string
}
```

### **WebSocket Stats**

```typescript
// Get WebSocket connection stats
GET /matches/:id/websocket-stats

// Update WebSocket stats (Admin/Scorer only)
PATCH /matches/:id/websocket-stats
Body: {
  totalConnections?: number,
  activeConnections?: number
}
```

---

## 🏃‍♂️ **4. BALL-BY-BALL SCORING ENDPOINTS**

### **Ball Management**

```typescript
// Apply ball (Admin/Scorer only)
POST /balls
Body: {
  matchId: string,
  over: number,
  ball: number,
  innings: number,
  runs: number,
  extras?: number,
  extraType?: string,
  wicket?: boolean,
  wicketType?: string,
  dismissedPlayer?: string,
  newBatsman?: string,
  commentary?: string
}

// Get balls for match
GET /balls/match/:matchId?over=1&innings=1

// Get ball by ID
GET /balls/:id

// Update ball (Admin/Scorer only)
PATCH /balls/:id
Body: {
  runs?: number,
  extras?: number,
  extraType?: string,
  wicket?: boolean,
  wicketType?: string,
  dismissedPlayer?: string,
  newBatsman?: string,
  commentary?: string
}

// Delete ball (Admin/Scorer only)
DELETE /balls/:id

// Undo last ball (Admin/Scorer only)
POST /balls/undo/:matchId
```

---

## 🏆 **5. TEAM MANAGEMENT ENDPOINTS**

### **Team CRUD Operations**

```typescript
// Create new team (Admin/Scorer only)
POST /teams
Body: {
  name: string,
  shortName: string,
  country: string,
  logo?: string,
  description?: string
}

// Get all teams
GET /teams?page=1&limit=10

// Get team by ID
GET /teams/:id

// Update team (Admin/Scorer only)
PATCH /teams/:id
Body: {
  name?: string,
  shortName?: string,
  country?: string,
  logo?: string,
  description?: string
}

// Delete team (Admin only)
DELETE /teams/:id
```

---

## 👤 **6. PLAYER MANAGEMENT ENDPOINTS**

### **Player CRUD Operations**

```typescript
// Create new player (Admin/Scorer only)
POST /players
Body: {
  name: string,
  teamId: string,
  role: PlayerRole,
  battingStyle?: string,
  bowlingStyle?: string,
  dateOfBirth?: Date,
  nationality?: string,
  photo?: string
}

// Get all players
GET /players?page=1&limit=10&teamId=123&role=batsman

// Get player by ID
GET /players/:id

// Update player (Admin/Scorer only)
PATCH /players/:id
Body: {
  name?: string,
  teamId?: string,
  role?: PlayerRole,
  battingStyle?: string,
  bowlingStyle?: string,
  dateOfBirth?: Date,
  nationality?: string,
  photo?: string
}

// Delete player (Admin only)
DELETE /players/:id
```

---

## 🏆 **7. TOURNAMENT & SERIES ENDPOINTS**

### **Tournament Management**

```typescript
// Create tournament (Admin only)
POST /tournaments
Body: {
  name: string,
  format: string,
  startDate: Date,
  endDate: Date,
  description?: string,
  prizePool?: number
}

// Get all tournaments
GET /tournaments?page=1&limit=10&status=active&format=T20

// Get tournament by ID
GET /tournaments/:id

// Get tournament points table
GET /tournaments/:id/points

// Get tournament results
GET /tournaments/:id/results

// Update tournament (Admin only)
PATCH /tournaments/:id
Body: {
  name?: string,
  format?: string,
  startDate?: Date,
  endDate?: Date,
  description?: string,
  prizePool?: number
}

// Delete tournament (Admin only)
DELETE /tournaments/:id
```

### **Series Management**

```typescript
// Create series (Admin only)
POST /series
Body: {
  name: string,
  type: string,
  team1Id: string,
  team2Id: string,
  startDate: Date,
  endDate: Date,
  description?: string
}

// Get all series
GET /series?page=1&limit=10&status=active&type=bilateral

// Get series by ID
GET /series/:id

// Get series table
GET /series/:id/table

// Update series (Admin only)
PATCH /series/:id
Body: {
  name?: string,
  type?: string,
  team1Id?: string,
  team2Id?: string,
  startDate?: Date,
  endDate?: Date,
  description?: string
}

// Delete series (Admin only)
DELETE /series/:id
```

---

## 🎲 **8. ODDS MANAGEMENT ENDPOINTS**

### **Odds Operations**

```typescript
// Create odds (Admin/Scorer only)
POST /odds
Body: {
  matchId: string,
  type: string,
  odds: {
    team1: number,
    team2: number,
    draw?: number
  },
  bookmaker: string
}

// Get odds for match
GET /odds/match/:matchId

// Get odds by ID
GET /odds/:id

// Update odds (Admin/Scorer only)
PATCH /odds/:id
Body: {
  odds: {
    team1?: number,
    team2?: number,
    draw?: number
  },
  bookmaker?: string
}

// Delete odds (Admin only)
DELETE /odds/:id
```

---

## 🤖 **9. AI AGENTS ENDPOINTS**

### **Match-Specific Agents**

```typescript
// Get match agent status
GET /matches/:matchId/agent

// Start agent (Admin/Scorer only)
POST /matches/:matchId/agent/start

// Stop agent (Admin/Scorer only)
POST /matches/:matchId/agent/stop

// Pause agent (Admin/Scorer only)
POST /matches/:matchId/agent/pause

// Resume agent (Admin/Scorer only)
POST /matches/:matchId/agent/resume

// Execute command (Admin/Scorer only)
POST /matches/:matchId/agent/command
Body: {
  command: string,
  userId?: string
}

// Execute automation (Admin/Scorer only)
POST /matches/:matchId/agent/automate
```

### **Global Agent Management**

```typescript
// Get all agents
GET /agents

// Execute global command (Admin/Scorer only)
POST /agents/command
Body: {
  command: string,
  userId?: string
}

// Execute automation for all matches (Admin only)
POST /agents/automate-all
```

---

## 📰 **10. NEWS MANAGEMENT ENDPOINTS**

### **News Operations**

```typescript
// Create news (Admin only)
POST /news
Body: {
  title: string,
  content: string,
  category: string,
  author: string,
  tags?: string[],
  isPublished?: boolean,
  isFeatured?: boolean,
  imageUrl?: string
}

// Get all news (public)
GET /news?page=1&limit=10&category=breaking&search=worldcup

// Get all news (including unpublished) - Admin only
GET /news/admin/all?page=1&limit=10&isPublished=false

// Get news by ID
GET /news/:id

// Update news (Admin only)
PATCH /news/:id
Body: {
  title?: string,
  content?: string,
  category?: string,
  author?: string,
  tags?: string[],
  isPublished?: boolean,
  isFeatured?: boolean,
  imageUrl?: string
}

// Delete news (Admin only)
DELETE /news/:id
```

---

## 🎮 **11. FANTASY CRICKET ENDPOINTS**

### **Fantasy Leagues**

```typescript
// Create fantasy league
POST /fantasy/leagues
Body: {
  name: string,
  matchId: string,
  entryFee: number,
  prizePool: number,
  maxParticipants: number,
  type: string
}

// Get all leagues
GET /fantasy/leagues?page=1&limit=10

// Get league by ID
GET /fantasy/leagues/:id

// Join league
POST /fantasy/leagues/:id/join
Body: {
  teamName: string,
  players: string[]
}

// Get league leaderboard
GET /fantasy/leagues/:id/leaderboard
```

### **Fantasy Teams**

```typescript
// Create fantasy team
POST /fantasy/teams
Body: {
  leagueId: string,
  name: string,
  players: string[]
}

// Get user teams
GET /fantasy/teams?leagueId=123

// Update fantasy team
PATCH /fantasy/teams/:id
Body: {
  name?: string,
  players?: string[]
}
```

---

## 💎 **12. PREMIUM FEATURES ENDPOINTS**

### **Subscriptions**

```typescript
// Create subscription
POST /premium/subscriptions
Body: {
  planId: string,
  paymentMethod: string
}

// Get user subscription
GET /premium/subscriptions

// Get subscription by ID
GET /premium/subscriptions/:id

// Update subscription
PATCH /premium/subscriptions/:id
Body: {
  status?: string,
  planId?: string
}

// Cancel subscription
POST /premium/subscriptions/:id/cancel

// Renew subscription
POST /premium/subscriptions/:id/renew
```

### **Premium Features**

```typescript
// Get all premium features
GET /premium/features

// Get feature by ID
GET /premium/features/:id

// Create premium feature (Admin only)
POST /premium/features
Body: {
  name: string,
  description: string,
  price: number,
  type: string
}

// Update premium feature (Admin only)
PATCH /premium/features/:id
Body: {
  name?: string,
  description?: string,
  price?: number,
  type?: string
}
```

### **Payments**

```typescript
// Create payment
POST /premium/payments
Body: {
  subscriptionId: string,
  amount: number,
  method: string
}

// Get all payments
GET /premium/payments

// Get payment by ID
GET /premium/payments/:id

// Process refund (Admin only)
POST /premium/payments/:id/refund
```

### **Premium Status**

```typescript
// Get premium status
GET /premium/status

// Get premium usage
GET /premium/usage

// Get premium plans
GET /premium/plans

// Get plans by type
GET /premium/plans/:type
```

---

## 🗣️ **13. COMMUNITY ENDPOINTS**

### **Comments**

```typescript
// Get comments
GET /community/comments/:type/:id

// Add comment
POST /community/comments/:type/:id
Body: {
  content: string,
  parentId?: string
}

// Update comment
PATCH /community/comments/:id
Body: {
  content: string
}

// Delete comment
DELETE /community/comments/:id

// Like comment
POST /community/comments/:id/like

// Report comment
POST /community/comments/:id/report
Body: {
  reason: string
}
```

### **Discussions**

```typescript
// Get discussions
GET /community/discussions?page=1&limit=10

// Create discussion
POST /community/discussions
Body: {
  title: string,
  content: string,
  tags?: string[]
}

// Get discussion by ID
GET /community/discussions/:id

// Update discussion
PATCH /community/discussions/:id
Body: {
  title?: string,
  content?: string,
  tags?: string[]
}

// Delete discussion
DELETE /community/discussions/:id
```

### **Quizzes**

```typescript
// Get quizzes
GET /community/quizzes?page=1&limit=10

// Create quiz (Admin only)
POST /community/quizzes
Body: {
  title: string,
  questions: Array<{
    question: string,
    options: string[],
    correctAnswer: number
  }>
}

// Get quiz by ID
GET /community/quizzes/:id

// Submit quiz answer
POST /community/quizzes/:id/submit
Body: {
  answers: number[]
}

// Get quiz results
GET /community/quizzes/:id/results
```

### **Polls**

```typescript
// Get polls
GET /community/polls?page=1&limit=10

// Create poll (Admin only)
POST /community/polls
Body: {
  question: string,
  options: string[],
  endDate: Date
}

// Get poll by ID
GET /community/polls/:id

// Vote in poll
POST /community/polls/:id/vote
Body: {
  optionIndex: number
}

// Get poll results
GET /community/polls/:id/results
```

---

## 📊 **14. ANALYTICS ENDPOINTS**

### **Match Analytics**

```typescript
// Get match statistics
GET /analytics/matches/:matchId/stats

// Get player statistics
GET /analytics/players/:playerId/stats

// Get team statistics
GET /analytics/teams/:teamId/stats

// Get tournament statistics
GET /analytics/tournaments/:tournamentId/stats
```

---

## 🕷️ **15. SCRAPERS ENDPOINTS**

### **Scraper Management**

```typescript
// Scrape match data
POST /scrapers/scrape/:matchId

// Get scraper status
GET /scrapers/status

// Get scraper metrics
GET /scrapers/metrics

// Get available sources
GET /scrapers/sources

// Get source failover history
GET /scrapers/sources/failover-history

// Disable source
POST /scrapers/sources/:sourceName/disable

// Enable source
POST /scrapers/sources/:sourceName/enable

// Reset source
POST /scrapers/sources/:sourceName/reset

// Test source
POST /scrapers/test/:sourceName/:matchId

// Rotate scrapers
POST /scrapers/rotate

// Get scraper health
GET /scrapers/health
```

### **Selector Management**

```typescript
// Get selector config
GET /selectors/config

// Get sources
GET /selectors/sources

// Get source selectors
GET /selectors/sources/:source

// Get field selectors
GET /selectors/sources/:source/:field

// Update field selectors
PUT /selectors/sources/:source/:field
Body: {
  selector: string
}

// Get selector failures
GET /selectors/failures

// Clear selector failures
DELETE /selectors/failures

// Get auto-detection status
GET /selectors/auto-detection/status

// Get global fallbacks
GET /selectors/global-fallbacks

// Reload selectors
POST /selectors/reload

// Get selector health
GET /selectors/health
```

---

## 🔧 **16. FRONTEND INTEGRATION EXAMPLES**

### **TypeScript API Service Example**

```typescript
// services/api.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

### **Admin Dashboard Service Example**

```typescript
// services/admin.ts
import api from "./api";

export const adminApi = {
  // Match Management
  getMatches: (filters?: any) => api.get("/matches", { params: filters }),
  createMatch: (data: any) => api.post("/matches", data),
  updateMatch: (id: string, data: any) => api.patch(`/matches/${id}`, data),
  deleteMatch: (id: string) => api.delete(`/matches/${id}`),

  // Team Management
  getTeams: (filters?: any) => api.get("/teams", { params: filters }),
  createTeam: (data: any) => api.post("/teams", data),
  updateTeam: (id: string, data: any) => api.patch(`/teams/${id}`, data),
  deleteTeam: (id: string) => api.delete(`/teams/${id}`),

  // Player Management
  getPlayers: (filters?: any) => api.get("/players", { params: filters }),
  createPlayer: (data: any) => api.post("/players", data),
  updatePlayer: (id: string, data: any) => api.patch(`/players/${id}`, data),
  deletePlayer: (id: string) => api.delete(`/players/${id}`),

  // Tournament Management
  getTournaments: (filters?: any) =>
    api.get("/tournaments", { params: filters }),
  createTournament: (data: any) => api.post("/tournaments", data),
  updateTournament: (id: string, data: any) =>
    api.patch(`/tournaments/${id}`, data),
  deleteTournament: (id: string) => api.delete(`/tournaments/${id}`),

  // User Management
  getUsers: (filters?: any) => api.get("/users", { params: filters }),
  createUser: (data: any) => api.post("/users", data),
  updateUser: (id: string, data: any) => api.patch(`/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),

  // News Management
  getNews: (filters?: any) => api.get("/news/admin/all", { params: filters }),
  createNews: (data: any) => api.post("/news", data),
  updateNews: (id: string, data: any) => api.patch(`/news/${id}`, data),
  deleteNews: (id: string) => api.delete(`/news/${id}`),

  // Analytics
  getMatchStats: (matchId: string) =>
    api.get(`/analytics/matches/${matchId}/stats`),
  getPlayerStats: (playerId: string) =>
    api.get(`/analytics/players/${playerId}/stats`),
  getTeamStats: (teamId: string) => api.get(`/analytics/teams/${teamId}/stats`),

  // System Health
  getSystemHealth: () => api.get("/scrapers/health"),
  getScraperStatus: () => api.get("/scrapers/status"),
};
```

---

## 📝 **17. ERROR CODES & RESPONSES**

### **Common HTTP Status Codes**

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (Duplicate entry)
- `500` - Internal Server Error

### **Error Response Format**

```json
{
  "message": "Error description",
  "error": "Error type",
  "statusCode": 400
}
```

---

## 🚀 **18. QUICK START GUIDE**

### **1. Authentication**

```typescript
// Login to get token
const loginResponse = await api.post("/auth/login", {
  username: "admin",
  password: "password",
});

const token = loginResponse.data.accessToken;
localStorage.setItem("accessToken", token);
```

### **2. Create Match**

```typescript
// Create a new match
const matchData = {
  team1Id: "team1_id",
  team2Id: "team2_id",
  venue: "Wankhede Stadium",
  startTime: new Date(),
  format: "T20",
};

const match = await adminApi.createMatch(matchData);
```

### **3. Manage Teams**

```typescript
// Create team
const teamData = {
  name: "Mumbai Indians",
  shortName: "MI",
  country: "India",
};

const team = await adminApi.createTeam(teamData);
```

### **4. Add Players**

```typescript
// Create player
const playerData = {
  name: "Rohit Sharma",
  teamId: "team_id",
  role: "batsman",
  battingStyle: "Right-handed",
  nationality: "India",
};

const player = await adminApi.createPlayer(playerData);
```

---

## 📚 **19. SWAGGER DOCUMENTATION**

Access the complete interactive API documentation at:

```
http://localhost:5000/api/docs
```

This provides:

- Interactive API testing
- Request/response examples
- Authentication setup
- Schema definitions
- Error codes

---

## 🔧 **20. ENVIRONMENT VARIABLES**

```bash
# .env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cricket_live_score
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
```

---

This comprehensive API reference covers all the endpoints you need for your admin dashboard. Use the Swagger documentation at `/api/docs` for interactive testing and detailed schema information.
