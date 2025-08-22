# 🔌 **WebSocket Events - Complete Documentation**

## 📡 **Overview**

The cricket scoring system uses **Socket.IO** for real-time communication with two main namespaces:

- `/matches` - Main match events and scoring
- `/scorecard` - Scorecard-specific events

---

## 🔐 **Authentication & Authorization**

### **Connection Requirements**

- **Public Events**: No authentication required (viewing only)
- **Admin Events**: JWT token required with ADMIN/SCORER role
- **User Events**: JWT token required with appropriate permissions

### **Role-Based Access**

- **ADMIN**: Full access to all events
- **SCORER**: Match management and scoring events
- **VIEWER**: Read-only access to public events

---

## 🏏 **MATCH NAMESPACE (`/matches`)**

### **🔴 ADMIN/SCORER EVENTS (Write Access)**

#### **1. Match Management Events**

```typescript
// Join/Leave Match Rooms
socket.emit("join_match", { matchId: "string" });
socket.emit("leave_match", { matchId: "string" });

// Ball Scoring Events
socket.emit("ball.apply", {
  matchId: "string",
  ballData: {
    over: number,
    ball: number,
    innings: number,
    runs: number,
    extras: number,
    extraType: string,
    wicket: boolean,
    wicketType: string,
    dismissedPlayer: string,
    newBatsman: string,
    commentary: string,
  },
});

socket.emit("ball.undo", { matchId: "string" });

// Player Management
socket.emit("player.update", {
  matchId: "string",
  playerId: "string",
  updates: {
    // Player stat updates
  },
});
```

#### **2. Match Control Events**

```typescript
// Strike Rotation Management
socket.emit("strike.rotation.update", {
  matchId: "string",
  strikeRotation: {
    striker: "string",
    nonStriker: "string",
    bowler: "string"
  }
});

// Commentary Management
socket.emit("commentary.add", {
  matchId: "string",
  commentary: {
    over: number,
    ball: number,
    innings: number,
    commentary: string,
    type: string
  }
});

// Toss Management
socket.emit("toss.update", {
  matchId: "string",
  tossInfo: {
    winner: "string",
    decision: "string",
    electedTo: "string"
  }
});

// Squad Management
socket.emit("squad.update", {
  matchId: "string",
  squad: {
    team1Squad: string[],
    team2Squad: string[]
  }
});

// Playing XI Management
socket.emit("playing.xi.update", {
  matchId: "string",
  playingXI: {
    team1PlayingXI: string[],
    team2PlayingXI: string[]
  }
});

// Notification Management
socket.emit("notification.add", {
  matchId: "string",
  notification: {
    type: string,
    message: string,
    priority: string
  }
});
```

#### **3. System Management Events**

```typescript
// WebSocket Statistics
socket.emit("websocket.stats.get", { matchId: "string" });
```

### **🟢 USER EVENTS (Read Access)**

#### **1. Match Viewing Events**

```typescript
// Join/Leave Match Rooms (Read-only)
socket.emit("join_match", { matchId: "string" });
socket.emit("leave_match", { matchId: "string" });

// Get WebSocket Statistics
socket.emit("websocket.stats.get", { matchId: "string" });
```

---

## 📊 **SCORECARD NAMESPACE (`/scorecard`)**

### **🔴 ADMIN/SCORER EVENTS (Write Access)**

#### **1. Scorecard Management Events**

```typescript
// Join/Leave Scorecard Rooms
socket.emit("join-scorecard", { matchId: "string" });
socket.emit("leave-scorecard", { matchId: "string" });

// Get Scorecard Data
socket.emit("get-scorecard", { matchId: "string" });
socket.emit("get-live-scorecard", { matchId: "string" });
```

### **🟢 USER EVENTS (Read Access)**

#### **1. Scorecard Viewing Events**

```typescript
// Join/Leave Scorecard Rooms (Read-only)
socket.emit("join-scorecard", { matchId: "string" });
socket.emit("leave-scorecard", { matchId: "string" });

// Get Scorecard Data
socket.emit("get-scorecard", { matchId: "string" });
socket.emit("get-live-scorecard", { matchId: "string" });
```

---

## 📨 **SERVER EMITTED EVENTS (All Users)**

### **🏏 MATCH NAMESPACE EVENTS**

#### **1. Match State Events**

```typescript
// Initial match state when joining
socket.on("score.state", (data) => {
  // data: { matchId, state, odds }
});

// Score updates
socket.on("score.diff", (data) => {
  // data: { matchId, score, timestamp }
});

// Ball events
socket.on("ball.applied", (data) => {
  // data: { matchId, ball, state }
});

socket.on("ball.undone", (data) => {
  // data: { matchId, ball, state }
});

// Player updates
socket.on("player.updated", (data) => {
  // data: { matchId, playerId, updates }
});

// Odds updates
socket.on("odds.update", (data) => {
  // data: { matchId, odds, timestamp }
});

// Alerts and notifications
socket.on("alert.reviewNeeded", (data) => {
  // data: { matchId, alert, timestamp }
});
```

#### **2. Match Control Events**

```typescript
// Strike rotation updates
socket.on("strike.rotation.updated", (data) => {
  // data: { matchId, strikeRotation, timestamp }
});

// Commentary updates
socket.on("commentary.added", (data) => {
  // data: { matchId, commentary, timestamp }
});

// Toss updates
socket.on("toss.updated", (data) => {
  // data: { matchId, tossInfo, timestamp }
});

// Squad updates
socket.on("squad.updated", (data) => {
  // data: { matchId, squad, timestamp }
});

// Playing XI updates
socket.on("playing.xi.updated", (data) => {
  // data: { matchId, playingXI, timestamp }
});

// Notification updates
socket.on("notification.added", (data) => {
  // data: { matchId, notification, timestamp }
});
```

#### **3. System Events**

```typescript
// WebSocket statistics
socket.on("websocket.stats", (data) => {
  // data: { matchId, stats, timestamp }
});

// Error events
socket.on("error", (data) => {
  // data: { message: "Error description" }
});
```

### **📊 SCORECARD NAMESPACE EVENTS**

#### **1. Scorecard Data Events**

```typescript
// Scorecard updates
socket.on("scorecard-updated", (data) => {
  // data: Complete scorecard object
});

// Live scorecard updates
socket.on("live-scorecard-updated", (data) => {
  // data: Live scorecard object
});

// Scorecard data response
socket.on("scorecard-data", (data) => {
  // data: Scorecard object
});

// Live scorecard data response
socket.on("live-scorecard-data", (data) => {
  // data: Live scorecard object
});

// Innings updates
socket.on("innings-updated", (data) => {
  // data: { matchId, inningsNumber, data }
});

// Player updates
socket.on("player-updated", (data) => {
  // data: { matchId, playerId, data }
});

// Error events
socket.on("scorecard-error", (data) => {
  // data: { message: "Error description" }
});
```

---

## 🔧 **CONNECTION & ROOM MANAGEMENT**

### **Connection Setup**

```typescript
// Connect to match namespace
const matchSocket = io("http://localhost:5000/matches", {
  auth: { token: "jwt-token" },
  transports: ["websocket", "polling"],
});

// Connect to scorecard namespace
const scorecardSocket = io("http://localhost:5000/scorecard", {
  auth: { token: "jwt-token" },
  transports: ["websocket", "polling"],
});
```

### **Room Management**

```typescript
// Join match room
matchSocket.emit("join_match", { matchId: "match-id" });

// Join scorecard room
scorecardSocket.emit("join-scorecard", { matchId: "match-id" });

// Leave rooms
matchSocket.emit("leave_match", { matchId: "match-id" });
scorecardSocket.emit("leave-scorecard", { matchId: "match-id" });
```

---

## 📋 **EVENT SUMMARY BY ACCESS LEVEL**

### **🔴 ADMIN/SCORER ONLY EVENTS**

1. `ball.apply` - Apply ball events
2. `ball.undo` - Undo ball events
3. `player.update` - Update player stats
4. `strike.rotation.update` - Update strike rotation
5. `commentary.add` - Add commentary
6. `toss.update` - Update toss information
7. `squad.update` - Update squad
8. `playing.xi.update` - Update playing XI
9. `notification.add` - Add notifications

### **🟢 ALL USERS EVENTS**

1. `join_match` - Join match room
2. `leave_match` - Leave match room
3. `join-scorecard` - Join scorecard room
4. `leave-scorecard` - Leave scorecard room
5. `get-scorecard` - Get scorecard data
6. `get-live-scorecard` - Get live scorecard
7. `websocket.stats.get` - Get WebSocket statistics

### **📨 SERVER BROADCAST EVENTS (All Users)**

1. `score.state` - Match state updates
2. `score.diff` - Score changes
3. `ball.applied` - Ball applied confirmation
4. `ball.undone` - Ball undone confirmation
5. `player.updated` - Player updates
6. `odds.update` - Odds updates
7. `alert.reviewNeeded` - Review alerts
8. `strike.rotation.updated` - Strike rotation updates
9. `commentary.added` - Commentary updates
10. `toss.updated` - Toss updates
11. `squad.updated` - Squad updates
12. `playing.xi.updated` - Playing XI updates
13. `notification.added` - Notification updates
14. `websocket.stats` - WebSocket statistics
15. `scorecard-updated` - Scorecard updates
16. `live-scorecard-updated` - Live scorecard updates
17. `scorecard-data` - Scorecard data response
18. `live-scorecard-data` - Live scorecard data response
19. `innings-updated` - Innings updates
20. `player-updated` - Player updates
21. `error` - Error messages
22. `scorecard-error` - Scorecard error messages

---

## 🚀 **USAGE EXAMPLES**

### **Frontend Implementation**

```typescript
class CricketWebSocket {
  private matchSocket: Socket;
  private scorecardSocket: Socket;

  constructor(token: string) {
    this.matchSocket = io("http://localhost:5000/matches", {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    this.scorecardSocket = io("http://localhost:5000/scorecard", {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Match events
    this.matchSocket.on("score.state", this.handleMatchState);
    this.matchSocket.on("ball.applied", this.handleBallApplied);
    this.matchSocket.on("odds.update", this.handleOddsUpdate);

    // Scorecard events
    this.scorecardSocket.on("scorecard-updated", this.handleScorecardUpdate);
    this.scorecardSocket.on(
      "live-scorecard-updated",
      this.handleLiveScorecardUpdate
    );
  }

  // Admin methods
  applyBall(matchId: string, ballData: any) {
    this.matchSocket.emit("ball.apply", { matchId, ballData });
  }

  updateStrikeRotation(matchId: string, strikeRotation: any) {
    this.matchSocket.emit("strike.rotation.update", {
      matchId,
      strikeRotation,
    });
  }

  // User methods
  joinMatch(matchId: string) {
    this.matchSocket.emit("join_match", { matchId });
  }

  joinScorecard(matchId: string) {
    this.scorecardSocket.emit("join-scorecard", { matchId });
  }
}
```

---

## 🔒 **SECURITY CONSIDERATIONS**

1. **Authentication Required**: All admin events require valid JWT token
2. **Role-Based Access**: Events are restricted based on user roles
3. **Input Validation**: All event data is validated server-side
4. **Rate Limiting**: Consider implementing rate limiting for high-frequency events
5. **Error Handling**: Proper error responses for invalid requests

---

## 📊 **MONITORING & STATISTICS**

### **WebSocket Statistics**

- Track connected clients per match
- Monitor event frequency
- Monitor room occupancy
- Track error rates

### **Performance Metrics**

- Connection latency
- Event processing time
- Memory usage
- Network bandwidth usage

---

This comprehensive WebSocket event system provides real-time updates for all cricket scoring operations with proper role-based access control and security measures.
