# 🏏 Cricket Live Score - Enhanced Features Documentation

## 🚀 New Functionalities Added

### 1. **Strike Rotation Management** ⚡

**Manage real-time strike rotation between batsmen and bowlers**

#### API Endpoints:

- `PATCH /api/matches/:id/strike-rotation` - Update strike rotation
- `GET /api/matches/:id/strike-rotation` - Get current strike rotation

#### WebSocket Events:

- `strike.rotation.update` - Update strike rotation
- `strike.rotation.updated` - Strike rotation updated (broadcast)

#### Features:

- ✅ Real-time striker/non-striker management
- ✅ Bowler assignment tracking
- ✅ Automatic timestamp updates
- ✅ WebSocket real-time broadcasting

---

### 2. **Scorecard Commentary** 📝

**Add and manage ball-by-ball commentary with timestamps**

#### API Endpoints:

- `POST /api/matches/:id/commentary` - Add commentary
- `GET /api/matches/:id/commentary` - Get commentary (with filters)

#### WebSocket Events:

- `commentary.add` - Add new commentary
- `commentary.added` - Commentary added (broadcast)

#### Features:

- ✅ Ball-by-ball commentary
- ✅ Over and innings filtering
- ✅ Commentator attribution
- ✅ Timestamp tracking
- ✅ Real-time broadcasting

---

### 3. **Player Profile Management** 👤

**Enhanced player profiles with match-specific data**

#### Features:

- ✅ Individual player score updates
- ✅ Match-specific player statistics
- ✅ Batting/bowling order management
- ✅ Captain/vice-captain assignments
- ✅ Jersey number tracking

---

### 4. **Match Toss Notifications** 🪙

**Complete toss management with notifications**

#### API Endpoints:

- `PATCH /api/matches/:id/toss` - Update toss information
- `GET /api/matches/:id/toss` - Get toss information

#### WebSocket Events:

- `toss.update` - Update toss information
- `toss.updated` - Toss updated (broadcast)

#### Features:

- ✅ Toss winner tracking
- ✅ Bat/bowl decision recording
- ✅ Automatic notifications
- ✅ Timestamp tracking
- ✅ Real-time updates

---

### 5. **Squad & Playing XI Management** 🏃‍♂️

**Complete squad and playing XI management**

#### API Endpoints:

- `PATCH /api/matches/:id/squad` - Update squad
- `GET /api/matches/:id/squad` - Get squad
- `PATCH /api/matches/:id/playing-xi` - Update playing XI
- `GET /api/matches/:id/playing-xi` - Get playing XI

#### WebSocket Events:

- `squad.update` - Update squad
- `squad.updated` - Squad updated (broadcast)
- `playing.xi.update` - Update playing XI
- `playing.xi.updated` - Playing XI updated (broadcast)

#### Features:

- ✅ Team squad management
- ✅ Playing XI selection
- ✅ Player role assignments
- ✅ Real-time updates
- ✅ Automatic notifications

---

### 6. **Individual Player Score Updates** 📊

**Track and update individual player statistics**

#### Features:

- ✅ Batting statistics (runs, balls, strike rate)
- ✅ Bowling statistics (wickets, overs, economy)
- ✅ Fielding statistics (catches, run-outs)
- ✅ Match-specific performance tracking
- ✅ Real-time score updates

---

### 7. **WebSocket Connection Monitoring** 🔌

**Monitor and track WebSocket connections**

#### API Endpoints:

- `PATCH /api/matches/:id/websocket-stats` - Update connection stats
- `GET /api/matches/:id/websocket-stats` - Get connection stats

#### WebSocket Events:

- `websocket.stats.get` - Get connection statistics
- `websocket.stats` - Connection statistics response

#### Features:

- ✅ Total connections tracking
- ✅ Active connections monitoring
- ✅ Connection timestamp tracking
- ✅ Real-time statistics

---

## 📡 WebSocket Event Reference

### Client → Server Events:

```javascript
// Join/Leave Match
socket.emit('join_match', { matchId: 'match_id' });
socket.emit('leave_match', { matchId: 'match_id' });

// Ball Events
socket.emit('ball.apply', { matchId: 'match_id', ballData: {...} });
socket.emit('ball.undo', { matchId: 'match_id' });

// Strike Rotation
socket.emit('strike.rotation.update', {
  matchId: 'match_id',
  strikeRotation: { striker: 'player_id', nonStriker: 'player_id', bowler: 'player_id' }
});

// Commentary
socket.emit('commentary.add', {
  matchId: 'match_id',
  commentary: { ball: 1, over: 1, innings: 1, commentary: 'text', commentator: 'name' }
});

// Toss Management
socket.emit('toss.update', {
  matchId: 'match_id',
  tossInfo: { winner: 'team_id', decision: 'bat/bowl', completed: true }
});

// Squad Management
socket.emit('squad.update', {
  matchId: 'match_id',
  squad: { teamA: ['player_ids'], teamB: ['player_ids'] }
});

// Playing XI
socket.emit('playing.xi.update', {
  matchId: 'match_id',
  playingXI: { teamA: ['player_ids'], teamB: ['player_ids'] }
});

// Notifications
socket.emit('notification.add', {
  matchId: 'match_id',
  notification: { type: 'toss', message: 'text' }
});

// WebSocket Stats
socket.emit('websocket.stats.get', { matchId: 'match_id' });
```

### Server → Client Events:

```javascript
// Score Updates
socket.on("score.state", (data) => {
  /* match state */
});
socket.on("score.update", (data) => {
  /* score diff */
});
socket.on("score.diff", (data) => {
  /* score difference */
});

// Ball Events
socket.on("ball.applied", (data) => {
  /* ball applied */
});
socket.on("ball.undone", (data) => {
  /* ball undone */
});

// Strike Rotation
socket.on("strike.rotation.updated", (data) => {
  /* rotation updated */
});

// Commentary
socket.on("commentary.added", (data) => {
  /* commentary added */
});

// Toss
socket.on("toss.updated", (data) => {
  /* toss updated */
});

// Squad
socket.on("squad.updated", (data) => {
  /* squad updated */
});

// Playing XI
socket.on("playing.xi.updated", (data) => {
  /* playing XI updated */
});

// Notifications
socket.on("notification.added", (data) => {
  /* notification added */
});

// Odds
socket.on("odds.update", (data) => {
  /* odds updated */
});

// Alerts
socket.on("alert.reviewNeeded", (data) => {
  /* review needed */
});

// WebSocket Stats
socket.on("websocket.stats", (data) => {
  /* connection stats */
});

// Errors
socket.on("error", (data) => {
  /* error message */
});
```

## 🗄️ Database Schema Enhancements

### Match Schema New Fields:

```javascript
// Strike rotation management
currentPlayers: {
  striker: ObjectId,
  nonStriker: ObjectId,
  bowler: ObjectId,
  lastUpdated: Date
}

// Squad management
squads: {
  teamA: [ObjectId],
  teamB: [ObjectId]
}

// Playing XI
playingXI: {
  teamA: [ObjectId],
  teamB: [ObjectId]
}

// Match commentary
commentary: [{
  ball: Number,
  over: Number,
  innings: Number,
  commentary: String,
  timestamp: Date,
  commentator: String
}]

// Toss notifications
tossInfo: {
  completed: Boolean,
  winner: ObjectId,
  decision: String,
  timestamp: Date,
  notified: Boolean
}

// Match notifications
notifications: [{
  type: String,
  message: String,
  timestamp: Date,
  sent: Boolean
}]

// WebSocket connections tracking
websocketStats: {
  totalConnections: Number,
  activeConnections: Number,
  lastConnectionUpdate: Date
}
```

## 🔧 Usage Examples

### 1. Update Strike Rotation:

```javascript
// API Call
PATCH /api/matches/64f1a2b3c4d5e6f7g8h9i0j1/strike-rotation
{
  "striker": "64f1a2b3c4d5e6f7g8h9i0j2",
  "nonStriker": "64f1a2b3c4d5e6f7g8h9i0j3",
  "bowler": "64f1a2b3c4d5e6f7g8h9i0j4"
}

// WebSocket
socket.emit('strike.rotation.update', {
  matchId: '64f1a2b3c4d5e6f7g8h9i0j1',
  strikeRotation: {
    striker: '64f1a2b3c4d5e6f7g8h9i0j2',
    nonStriker: '64f1a2b3c4d5e6f7g8h9i0j3',
    bowler: '64f1a2b3c4d5e6f7g8h9i0j4'
  }
});
```

### 2. Add Commentary:

```javascript
// API Call
POST /api/matches/64f1a2b3c4d5e6f7g8h9i0j1/commentary
{
  "ball": 3,
  "over": 1,
  "innings": 1,
  "commentary": "Excellent delivery! Yorker length, batsman just manages to dig it out.",
  "commentator": "John Smith"
}

// WebSocket
socket.emit('commentary.add', {
  matchId: '64f1a2b3c4d5e6f7g8h9i0j1',
  commentary: {
    ball: 3,
    over: 1,
    innings: 1,
    commentary: "Excellent delivery! Yorker length, batsman just manages to dig it out.",
    commentator: "John Smith"
  }
});
```

### 3. Update Toss:

```javascript
// API Call
PATCH /api/matches/64f1a2b3c4d5e6f7g8h9i0j1/toss
{
  "winner": "64f1a2b3c4d5e6f7g8h9i0j5",
  "decision": "bat",
  "completed": true,
  "notified": true
}

// WebSocket
socket.emit('toss.update', {
  matchId: '64f1a2b3c4d5e6f7g8h9i0j1',
  tossInfo: {
    winner: '64f1a2b3c4d5e6f7g8h9i0j5',
    decision: 'bat',
    completed: true,
    notified: true
  }
});
```

## 🎯 Key Benefits

1. **Real-time Management**: All features support real-time updates via WebSockets
2. **Comprehensive Tracking**: Complete match lifecycle management
3. **Flexible API**: Both REST API and WebSocket interfaces
4. **Scalable Architecture**: Modular design for easy extension
5. **Production Ready**: Proper error handling and validation
6. **Documentation**: Complete Swagger documentation for all endpoints

## 🚀 Getting Started

1. **Start the application**:

   ```bash
   JWT_SECRET=your-secret-key npm run start:dev
   ```

2. **Access the API documentation**:

   ```
   http://localhost:3000/api/docs
   ```

3. **Connect to WebSocket**:

   ```javascript
   const socket = io("http://localhost:3000/matches");
   ```

4. **Test the features** using the provided examples above

---

**🎉 Your Cricket Live Score platform now has comprehensive match management capabilities!**
