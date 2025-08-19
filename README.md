# Cricket Live Score Platform Backend

A complete NestJS + MongoDB backend for a cricket live-score platform similar to Crex.live, featuring real-time scoring, AI agents, and comprehensive match management.

## 🏏 Features

### Core Functionality
- **Authentication & Authorization**: JWT-based login/logout/refresh with role-based access control
- **User Management**: Admin, scorer, and viewer roles with comprehensive user CRUD operations
- **Team & Player Management**: Global player profiles with career stats and match-specific assignments
- **Match Management**: Complete match lifecycle from scheduling to completion
- **Ball-by-Ball Scoring**: Real-time scoring with undo functionality and event tracking
- **AI Agent System**: Intelligent agents that process match events and update odds
- **Real-time Updates**: WebSocket-based live score updates and notifications
- **Odds Management**: AI-powered betting odds calculation and management

### Technical Features
- **MongoDB Integration**: Mongoose schemas with optimized indexing
- **WebSocket Support**: Socket.io for real-time communication
- **Swagger Documentation**: Complete API documentation
- **Role-based Security**: Comprehensive access control
- **Error Handling**: Robust error handling and validation
- **Modular Architecture**: Clean, maintainable code structure

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cricket-live-score-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/cricket_live_score
   MONGODB_DB_NAME=cricket_live_score
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRES_IN=7d
   PORT=3000
   NODE_ENV=development
   AI_AGENT_ENABLED=true
   AI_AGENT_UPDATE_INTERVAL=5000
   ```

4. **Start MongoDB**
   ```bash
   # If using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   
   # Or start your local MongoDB instance
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

6. **Access the application**
   - API: http://localhost:3000
   - Swagger Documentation: http://localhost:3000/api/docs

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/users` - Get all users (Admin/Scorer)
- `POST /api/users` - Create user (Admin)
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

### Teams & Players
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create team (Admin/Scorer)
- `GET /api/players` - Get all players
- `POST /api/players` - Create player (Admin/Scorer)

### Match Management
- `GET /api/matches` - Get all matches
- `POST /api/matches` - Create match (Admin/Scorer)
- `GET /api/matches/:id` - Get match details
- `PATCH /api/matches/:id/status` - Update match status
- `GET /api/matches/live` - Get live matches

### Ball-by-Ball Scoring
- `POST /api/matches/:matchId/balls` - Add ball event
- `POST /api/matches/:matchId/balls/undo` - Undo last ball
- `GET /api/matches/:matchId/balls` - Get match balls

### AI Agents
- `POST /api/matches/:matchId/agent/start` - Start AI agent
- `POST /api/matches/:matchId/agent/stop` - Stop AI agent
- `POST /api/matches/:matchId/agent/pause` - Pause AI agent
- `POST /api/matches/:matchId/agent/resume` - Resume AI agent

### Odds Management
- `POST /api/matches/:matchId/odds` - Set odds
- `POST /api/matches/:matchId/odds/ai` - Generate AI odds
- `GET /api/matches/:matchId/odds/latest` - Get latest odds

## 🔌 WebSocket Events

### Client → Server
- `join_match` - Join a match room
- `leave_match` - Leave a match room
- `ball.apply` - Apply ball event
- `ball.undo` - Undo ball event
- `player.update` - Update player stats

### Server → Client
- `score.state` - Current match state
- `score.diff` - Score updates
- `ball.applied` - Ball event applied
- `ball.undone` - Ball event undone
- `odds.update` - Odds updates
- `alert.reviewNeeded` - Review alerts

## 🏗️ Architecture

### Module Structure
```
src/
├── auth/           # Authentication & authorization
├── users/          # User management
├── teams/          # Team management
├── players/        # Player management
├── matches/        # Match management
├── match-players/  # Match-specific player data
├── balls/          # Ball-by-ball scoring
├── odds/           # Odds management
├── agents/         # AI agent system
├── websocket/      # Real-time communication
└── common/         # Shared DTOs and enums
```

### Database Collections
- `users` - User accounts and roles
- `teams` - Team information
- `players` - Player profiles and stats
- `matches` - Match details and status
- `matchPlayers` - Match-specific player assignments
- `balls` - Ball-by-ball events
- `odds` - Betting odds snapshots
- `agents` - AI agent lifecycle tracking

## 🤖 AI Agent System

The platform includes intelligent AI agents that:

- **Process Match Events**: Automatically analyze ball events for anomalies
- **Update Odds**: Calculate live betting odds based on match state
- **Generate Alerts**: Identify unusual events requiring human review
- **Optimize Performance**: Adaptive configuration based on match conditions

### Agent Features
- Real-time match analysis
- Automatic odds calculation
- Anomaly detection
- Configurable update intervals
- Error handling and recovery

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (Admin, Scorer, Viewer)
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting (configurable)

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Deployment

### Docker Deployment
```bash
# Build image
docker build -t cricket-live-score-backend .

# Run container
docker run -p 3000:3000 --env-file .env cricket-live-score-backend
```

### Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - Application port
- `NODE_ENV` - Environment (development/production)
- `AI_AGENT_ENABLED` - Enable/disable AI agents

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api/docs`
- Review the code examples in the repository

## 🔮 Future Enhancements

- Machine learning-based odds prediction
- Advanced analytics and statistics
- Multi-language support
- Mobile app backend
- Integration with external cricket APIs
- Advanced reporting and dashboards 