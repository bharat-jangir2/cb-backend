# 🏗️ **MODULAR DATABASE ARCHITECTURE**

## 📋 **Overview**

We've successfully refactored the monolithic Match schema into a modular, scalable architecture with separate collections for different types of data. This approach provides better performance, scalability, and maintainability.

---

## 🗂️ **Collection Structure**

### **1. Match Collection** 📊

**Purpose**: Basic match information and settings

**Key Fields**:

- Basic match details (name, venue, teams, status)
- Match settings (DRS, power play rules, rain rules)
- Current match state (live status, WebSocket stats)
- Squad and playing XI information
- Current players on field

**Benefits**:

- ✅ Lightweight and fast queries
- ✅ Easy to update basic match info
- ✅ Perfect for match listings and summaries

### **2. Innings Collection** 🏏

**Purpose**: Per-innings data and statistics

**Key Fields**:

- Innings-specific scores (runs, wickets, overs)
- Power play information and status
- Current players on field for this innings
- Innings result and duration
- DRS reviews used

**Benefits**:

- ✅ Efficient innings-specific queries
- ✅ Power play management per innings
- ✅ Easy to track innings progress

### **3. Ball Collection** ⚾

**Purpose**: Ball-by-ball event tracking

**Key Fields**:

- Each ball's event (runs, wickets, extras)
- Player involvement (striker, non-striker, bowler)
- Fielding positions for each ball
- Score state after each ball
- Power play status for each ball
- Commentary and DRS review info

**Benefits**:

- ✅ Perfect for WebSocket real-time updates
- ✅ Efficient ball-by-ball queries
- ✅ Easy to track match progression
- ✅ Optimized for live scoring

### **4. PlayerMatchStats Collection** 👤

**Purpose**: Per-player statistics for each match

**Key Fields**:

- Batting statistics (runs, balls, strike rate)
- Bowling statistics (wickets, overs, economy)
- Fielding statistics (catches, stumpings)
- Partnership information
- Player roles and performance indicators

**Benefits**:

- ✅ Efficient player performance queries
- ✅ Easy to calculate player rankings
- ✅ Perfect for fantasy cricket
- ✅ Optimized for player statistics

### **5. Partnership Collection** 🤝

**Purpose**: Partnership tracking and analysis

**Key Fields**:

- Partnership details (players, runs, balls)
- Partnership milestones (50s, 100s, 200s)
- Partnership quality indicators
- Key moments in partnerships
- Partnership statistics and context

**Benefits**:

- ✅ Efficient "best partnerships" queries
- ✅ Partnership analysis and insights
- ✅ Historical partnership tracking
- ✅ Quality-based partnership ranking

### **6. MatchEvent Collection** 📅

**Purpose**: All match events, highlights, and timeline

**Key Fields**:

- Event types (toss, wickets, boundaries, etc.)
- Event metadata and context
- Highlight information (videos, images)
- Notification data
- Commentary and timeline events

**Benefits**:

- ✅ Comprehensive event tracking
- ✅ Efficient timeline queries
- ✅ Highlight management
- ✅ Notification system support

### **7. DRSReview Collection** 📺

**Purpose**: DRS review management

**Key Fields**:

- Review details and outcomes
- Technology used (Hawk-Eye, Snicko, etc.)
- Review impact and statistics
- Controversial review tracking
- Review processing status

**Benefits**:

- ✅ Efficient DRS review queries
- ✅ Review statistics and analysis
- ✅ Controversial review tracking
- ✅ Review impact assessment

---

## 🔗 **Relationships & References**

### **Primary Relationships**

```
Match (1) ←→ (Many) Innings
Match (1) ←→ (Many) Ball
Match (1) ←→ (Many) PlayerMatchStats
Match (1) ←→ (Many) Partnership
Match (1) ←→ (Many) MatchEvent
Match (1) ←→ (Many) DRSReview
```

### **Cross-Collection References**

- All collections reference `matchId` to link to the main match
- `Ball` collection references `innings` for innings-specific data
- `PlayerMatchStats` references both `matchId` and `innings`
- `Partnership` references both players and match context
- `MatchEvent` can reference specific balls, players, or teams

---

## ⚡ **Performance Benefits**

### **1. Query Optimization**

- **Lightweight Match Queries**: Basic match info loads quickly
- **Targeted Data Retrieval**: Only fetch needed data (e.g., only balls for live updates)
- **Indexed Collections**: Each collection has optimized indexes for common queries
- **Reduced Document Size**: Smaller documents = faster reads/writes

### **2. Scalability**

- **Horizontal Scaling**: Each collection can be scaled independently
- **Sharding Potential**: Different collections can be sharded differently
- **Memory Efficiency**: Smaller documents use less memory
- **Network Efficiency**: Less data transfer for specific queries

### **3. Real-time Performance**

- **WebSocket Optimization**: Ball collection perfect for real-time updates
- **Live Scoring**: Fast ball-by-ball updates without loading entire match
- **Event Streaming**: MatchEvent collection optimized for timeline streaming
- **Notification Efficiency**: Quick event queries for notifications

---

## 🎯 **Use Case Examples**

### **1. Live Match Dashboard**

```javascript
// Fast match summary
const match = await Match.findById(matchId);

// Current innings data
const currentInnings = await Innings.findOne({
  matchId,
  inningsNumber: match.currentInnings,
});

// Recent balls for live updates
const recentBalls = await Ball.find({ matchId })
  .sort({ timestamp: -1 })
  .limit(10);
```

### **2. Player Statistics**

```javascript
// Player performance for this match
const playerStats = await PlayerMatchStats.find({
  matchId,
  player: playerId,
});

// Player's best partnerships
const partnerships = await Partnership.find({
  $or: [{ player1: playerId }, { player2: playerId }],
}).sort({ runs: -1 });
```

### **3. Match Timeline**

```javascript
// Complete match timeline
const timeline = await MatchEvent.find({ matchId }).sort({ time: 1 });

// Highlights only
const highlights = await MatchEvent.find({
  matchId,
  isHighlight: true,
}).sort({ impactScore: -1 });
```

### **4. Best Partnerships Query**

```javascript
// Top partnerships across all matches
const bestPartnerships = await Partnership.find()
  .sort({ runs: -1 })
  .limit(10)
  .populate("player1 player2 matchId");
```

---

## 🔧 **API Structure**

### **Match APIs**

```bash
GET    /api/matches                    # List matches (lightweight)
GET    /api/matches/:id                # Match details
PATCH  /api/matches/:id                # Update match
PATCH  /api/matches/:id/status         # Update match status
```

### **Innings APIs**

```bash
GET    /api/matches/:id/innings        # Get all innings
GET    /api/matches/:id/innings/:num   # Get specific innings
PATCH  /api/matches/:id/innings/:num   # Update innings
```

### **Ball APIs**

```bash
POST   /api/matches/:id/balls          # Add ball (WebSocket)
GET    /api/matches/:id/balls          # Get balls with filters
GET    /api/matches/:id/balls/latest   # Get recent balls
```

### **Player Stats APIs**

```bash
GET    /api/matches/:id/player-stats   # All player stats
GET    /api/matches/:id/player-stats/:playerId # Specific player
GET    /api/players/:id/match-stats    # Player's match history
```

### **Partnership APIs**

```bash
GET    /api/matches/:id/partnerships   # Match partnerships
GET    /api/partnerships/best          # Best partnerships
GET    /api/partnerships/player/:id    # Player's partnerships
```

### **Event APIs**

```bash
GET    /api/matches/:id/events         # Match timeline
GET    /api/matches/:id/highlights     # Match highlights
POST   /api/matches/:id/events         # Add event
```

### **DRS APIs**

```bash
GET    /api/matches/:id/drs-reviews    # Match DRS reviews
POST   /api/matches/:id/drs-reviews    # Add DRS review
PATCH  /api/matches/:id/drs-reviews/:id # Update DRS review
```

---

## 🚀 **Frontend Integration**

### **1. Real-time Updates**

```typescript
// WebSocket events for live updates
socket.on("ball.added", (ballData) => {
  // Update ball collection in frontend
  updateBallCollection(ballData);
});

socket.on("innings.updated", (inningsData) => {
  // Update innings display
  updateInningsDisplay(inningsData);
});
```

### **2. Efficient Data Loading**

```typescript
// Load only needed data
const matchSummary = await api.get(`/matches/${matchId}`);
const currentInnings = await api.get(`/matches/${matchId}/innings/current`);
const recentBalls = await api.get(`/matches/${matchId}/balls/latest`);
```

### **3. Optimized Queries**

```typescript
// Player statistics
const playerStats = await api.get(
  `/matches/${matchId}/player-stats/${playerId}`
);

// Best partnerships
const bestPartnerships = await api.get("/partnerships/best?limit=10");
```

---

## 📊 **Migration Strategy**

### **1. Database Migration**

```javascript
// Migrate existing match data to new structure
const migrateMatch = async (oldMatch) => {
  // Create new match document
  const newMatch = await Match.create({
    name: oldMatch.name,
    venue: oldMatch.venue,
    // ... other basic fields
  });

  // Migrate innings data
  if (oldMatch.score) {
    await Innings.create({
      matchId: newMatch._id,
      inningsNumber: 1,
      battingTeam: oldMatch.teamAId,
      bowlingTeam: oldMatch.teamBId,
      runs: oldMatch.score.teamA.runs,
      wickets: oldMatch.score.teamA.wickets,
      // ... other innings data
    });
  }

  // Migrate ball-by-ball data
  if (oldMatch.ballByBall) {
    for (const ball of oldMatch.ballByBall) {
      await Ball.create({
        matchId: newMatch._id,
        innings: ball.innings,
        over: ball.over,
        ball: ball.ball,
        // ... other ball data
      });
    }
  }

  // Continue for other collections...
};
```

### **2. API Migration**

- Maintain backward compatibility during transition
- Gradually migrate endpoints to use new collections
- Update frontend to use new API structure
- Monitor performance improvements

---

## 🎯 **Benefits Summary**

### **Performance**

- ✅ **Faster Queries**: Smaller documents, targeted indexes
- ✅ **Real-time Updates**: Optimized for WebSocket streaming
- ✅ **Scalability**: Independent collection scaling
- ✅ **Memory Efficiency**: Reduced memory usage

### **Maintainability**

- ✅ **Modular Design**: Clear separation of concerns
- ✅ **Easy Updates**: Update specific data without affecting others
- ✅ **Better Testing**: Test each collection independently
- ✅ **Clear APIs**: Logical API structure

### **Functionality**

- ✅ **Rich Queries**: Efficient complex queries (best partnerships, etc.)
- ✅ **Real-time Features**: Perfect for live scoring and updates
- ✅ **Analytics**: Easy to build statistics and insights
- ✅ **Extensibility**: Easy to add new features

---

This modular architecture provides a solid foundation for a high-performance, scalable cricket platform that can handle real-time updates, complex queries, and extensive analytics while maintaining excellent performance and user experience.
