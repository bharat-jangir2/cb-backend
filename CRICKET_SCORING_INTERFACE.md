# 🏏 Cricket Scoring Interface

## 📋 Overview

This is a comprehensive cricket scoring interface designed for live match scoring and management. The interface provides real-time scoring capabilities with a user-friendly design that matches professional cricket scoring systems.

## 🎯 Features

### **Core Scoring Features**
- ✅ **Ball-by-ball scoring** with detailed statistics
- ✅ **Real-time updates** via WebSocket connections
- ✅ **Player statistics** tracking (batting & bowling)
- ✅ **Team score management** with extras tracking
- ✅ **Power Play** and **DLS** management
- ✅ **Toss information** management
- ✅ **Commentary** system
- ✅ **Betting odds** integration

### **Interface Components**
- **Header Section**: Match info, series details, and control buttons
- **Team Score Summary**: Live scores for both teams
- **Scoreboard Panel**: Central scoring controls and match status
- **Bowlers Panel**: Bowler selection and statistics
- **Batsmen Panel**: Batsman selection and batting statistics
- **Extras Tracking**: Wide, no-ball, leg-bye, bye, and penalty runs

## 🚀 Quick Start

### 1. **Installation**

```bash
# Install dependencies
npm install

# Start the backend server
npm run start:dev

# The interface will be available at:
# http://localhost:5173/admin/matches/{matchId}/scoring
```

### 2. **Access the Interface**

Navigate to: `http://localhost:5173/admin/matches/68a4bca3e5dbb94da94b99c1/scoring`

## 📱 Interface Layout

### **Header Section**
```
┌─────────────────────────────────────────────────────────────┐
│ Series: Latest Series    [Info] [Squad] [Squads] [LIVE]    │
│ Live: India vs Sri Lanka                                    │
│ Toss: India Won The Toss and Choo                          │
└─────────────────────────────────────────────────────────────┘
```

### **Controls Section**
```
┌─────────────────────────────────────────────────────────────┐
│ [Showing] [DLS]  [Live ▼] [Inv: 2 ▼]  [Search: ___] [Update] │
│ [Power Play On]  [Odds History] [commentary] [On Oc]        │
└─────────────────────────────────────────────────────────────┘
```

### **Betting/Session Controls**
```
┌─────────────────────────────────────────────────────────────┐
│ Odds: [Select ▼] [20] [0] [Update]                          │
│ Session: [Select ▼] [12] [0] [Update]                       │
│ lambi: [Select ▼] [10] [0] [Update]                         │
└─────────────────────────────────────────────────────────────┘
```

### **Main Content Area**
```
┌─────────────────┬─────────────────┬─────────────────┐
│ Team Scores     │ Scoreboard      │ Bowlers         │
│                 │                 │                 │
│ India: 0-0      │ [Updateball]    │ ST | Bowler     │
│ 0.0 overs       │ [Update]        │ ●  | Ashwin     │
│ CRR: 0.00       │                 │ ○  | Jadeja     │
│                 │ Runs: 0         │ ○  | Bumrah     │
│ Sri Lanka: 0-0  │ Wickets: 0      │ ○  | Yadav      │
│ 0.0 overs       │ Overs: 0.0      │ ○  | Shami      │
│ CRR: 0.00       │                 │                 │
│                 │ [comment 2]     │                 │
│                 │ [Update]        │                 │
└─────────────────┴─────────────────┴─────────────────┘
```

### **Batsmen Panel**
```
┌─────────────────────────────────────────────────────────────┐
│ Batsmen                                                    │
│ ex: 0  wd: 0  nb: 0  lb: 0  b: 0  p: 0                    │
│                                                             │
│ ST | Strike Batsmen | Runs | Balls | 4s | 6s | TO | TR |  │
│ ☑  | ● Kusal Mendis | 0    | 0     | 0  | 0  | -  | -  |  │
│ ☐  | ○ Silva        | 0    | 0     | 0  | 0  | -  | -  |  │
│ ☐  | ○ Asalanka     | 2    | 2     | 0  | 0  | -  | -  |  │
└─────────────────────────────────────────────────────────────┘
```

## 🎮 How to Use

### **1. Setting Up a Match**

1. **Load Match Data**: The interface automatically loads match details
2. **Select Bowler**: Click the radio button next to the current bowler
3. **Select Batsmen**: Choose striker and non-striker using checkboxes/radio buttons

### **2. Scoring a Ball**

1. **Select Current Bowler**: Use radio buttons in the Bowlers panel
2. **Select Striker**: Use radio buttons in the Batsmen panel
3. **Update Ball**: Click "Updateball" button in Scoreboard panel
4. **Add Commentary**: Type commentary in the text area and click "Update"

### **3. Managing Extras**

- **Wides**: Track in the extras row (wd: 0)
- **No Balls**: Track in the extras row (nb: 0)
- **Leg Byes**: Track in the extras row (lb: 0)
- **Byes**: Track in the extras row (b: 0)
- **Penalty**: Track in the extras row (p: 0)

### **4. Power Play & DLS**

- **Power Play**: Toggle "Power Play On" button
- **DLS**: Toggle "DLS" button for Duckworth-Lewis-Stern calculations

### **5. Betting Integration**

- **Odds**: Set betting odds for the match
- **Session**: Manage session-based betting
- **Lambi**: Handle long-term betting options

## 🔧 Technical Implementation

### **Components Structure**
```
src/
├── components/
│   └── admin/
│       └── CricketScoringInterface.tsx    # Main scoring interface
├── pages/
│   └── admin/
│       └── MatchScoringPage.tsx          # Page wrapper
├── services/
│   └── scoring.service.ts                # API service
├── hooks/
│   └── useScoring.ts                     # Custom hook
└── types/
    └── scoring.types.ts                  # TypeScript interfaces
```

### **Key Features**

#### **Real-time Updates**
- WebSocket connection for live updates
- Automatic state synchronization
- Real-time player statistics

#### **State Management**
- Centralized scoring state
- Player selection management
- Match status tracking

#### **API Integration**
- RESTful API calls for data persistence
- WebSocket events for real-time updates
- Error handling and loading states

## 🎨 Styling

The interface uses **Tailwind CSS** for styling with:
- **Responsive design** for different screen sizes
- **Color-coded sections** for easy navigation
- **Professional cricket scoring appearance**
- **Accessible design** with proper contrast

## 🔌 API Endpoints

### **Match Management**
- `GET /api/matches/:id` - Get match details
- `PUT /api/matches/:id/score` - Update match score
- `PUT /api/matches/:id/status` - Update match status

### **Ball-by-Ball Scoring**
- `POST /api/matches/:id/balls` - Add ball update
- `GET /api/matches/:id/player-stats` - Get player statistics
- `PUT /api/matches/:id/players/:playerId/stats` - Update player stats

### **Commentary**
- `GET /api/matches/:id/commentary` - Get match commentary
- `POST /api/matches/:id/commentary` - Add commentary

### **Match Settings**
- `PUT /api/matches/:id/toss` - Update toss information
- `PUT /api/matches/:id/power-play` - Update power play status
- `PUT /api/matches/:id/dls` - Update DLS information

## 🚨 Error Handling

The interface includes comprehensive error handling:
- **Network errors** with retry mechanisms
- **Validation errors** with user feedback
- **Loading states** for better UX
- **Fallback UI** for error scenarios

## 🔒 Security

- **JWT authentication** for admin access
- **Role-based permissions** (ADMIN, SCORER)
- **Input validation** and sanitization
- **CSRF protection** for form submissions

## 📊 Data Flow

```
User Action → Interface → Hook → Service → API → Database
     ↓
WebSocket → Real-time Update → Interface → User
```

## 🎯 Future Enhancements

- **DRS Reviews** integration
- **Fielding positions** management
- **Partnership tracking**
- **Advanced statistics** and analytics
- **Mobile responsive** design improvements
- **Offline scoring** capabilities
- **Multi-language** support

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include error handling
4. Write unit tests for new features
5. Update documentation

## 📞 Support

For technical support or feature requests, please contact the development team.

---

**Note**: This interface is designed for professional cricket scoring and should be used by trained scorers or administrators.
