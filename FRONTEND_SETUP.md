# 🏏 Cricket Live Score Frontend Setup Guide

## 📋 Project Overview

Build a React frontend with two interfaces:

- **Admin Panel**: For scorers/admins to manage matches and live scoring
- **User Website**: For viewers to watch live matches

## 🛠️ Technology Stack

- **React 18** + TypeScript + Vite
- **React Router v6** for routing
- **Socket.IO Client** for real-time updates
- **Axios** for API calls
- **Tailwind CSS** for styling
- **React Query** for state management
- **Zustand** for global state
- **React Hook Form** for forms

## 🚀 Quick Setup

### 1. Initialize Project

```bash
npm create vite@latest cricket-frontend -- --template react-ts
cd cricket-frontend

# Install dependencies
npm install react-router-dom @tanstack/react-query axios socket.io-client
npm install react-hook-form @hookform/resolvers zod zustand
npm install @headlessui/react @heroicons/react react-hot-toast
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Environment Setup

```bash
# .env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
VITE_APP_NAME="Cricket Live Score"
```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── admin/           # Admin panel components
│   └── user/            # User website components
├── services/
│   ├── api.ts           # Axios configuration
│   ├── auth.service.ts  # Authentication
│   ├── matches.service.ts
│   └── socket.service.ts # WebSocket handling
├── stores/
│   ├── auth.store.ts    # Zustand stores
│   └── match.store.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useSocket.ts
│   └── useApi.ts
└── pages/
    ├── admin/           # Admin pages
    └── user/            # User pages
```

## 🔧 Core Services

### 1. API Service

```typescript
// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// JWT interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 2. Socket Service

```typescript
// src/services/socket.service.ts
import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    this.socket = io(import.meta.env.VITE_SOCKET_URL + "/matches", {
      auth: { token },
      transports: ["websocket"],
    });
  }

  joinMatch(matchId: string) {
    this.socket?.emit("join_match", { matchId });
  }

  applyBall(matchId: string, ballData: any) {
    this.socket?.emit("ball.apply", { matchId, ballData });
  }

  undoBall(matchId: string) {
    this.socket?.emit("ball.undo", { matchId });
  }

  // Enhanced features
  updateStrikeRotation(matchId: string, data: any) {
    this.socket?.emit("strike.rotation.update", {
      matchId,
      strikeRotation: data,
    });
  }

  addCommentary(matchId: string, commentary: any) {
    this.socket?.emit("commentary.add", { matchId, commentary });
  }

  // Event listeners
  onScoreState(callback: (data: any) => void) {
    this.socket?.on("score.state", callback);
  }

  onBallApplied(callback: (data: any) => void) {
    this.socket?.on("ball.applied", callback);
  }

  onCommentaryAdded(callback: (data: any) => void) {
    this.socket?.on("commentary.added", callback);
  }
}

export const socketService = new SocketService();
```

### 3. Auth Store

```typescript
// src/stores/auth.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: any | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: any, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      login: (user, token) =>
        set({ user, accessToken: token, isAuthenticated: true }),
      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" }
  )
);
```

## 🎨 Key Components

### 1. Protected Route

```typescript
// src/components/auth/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";

export const ProtectedRoute = ({ children, allowedRoles }: any) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};
```

### 2. Live Scoring (Admin)

```typescript
// src/components/admin/LiveScoring.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { socketService } from "../../services/socket.service";
import toast from "react-hot-toast";

export const LiveScoring = () => {
  const { matchId } = useParams();
  const [ballData, setBallData] = useState({
    eventType: "runs",
    runs: 0,
    extras: 0,
    wicket: false,
  });

  useEffect(() => {
    if (matchId) {
      socketService.joinMatch(matchId);

      socketService.onBallApplied(() => {
        toast.success("Ball applied!");
      });

      return () => socketService.leaveMatch(matchId);
    }
  }, [matchId]);

  const handleBallSubmit = () => {
    socketService.applyBall(matchId!, ballData);
  };

  const handleAddCommentary = (commentary: string) => {
    socketService.addCommentary(matchId!, {
      ball: 1,
      over: 1,
      innings: 1,
      commentary,
      commentator: "Scorer",
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Live Scoring</h2>

      {/* Ball Event Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Runs"
            value={ballData.runs}
            onChange={(e) =>
              setBallData({ ...ballData, runs: parseInt(e.target.value) })
            }
            className="border rounded px-3 py-2"
          />
        </div>
        <button
          onClick={handleBallSubmit}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Apply Ball
        </button>
      </div>

      {/* Commentary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Add Commentary</h3>
        {/* Commentary form */}
      </div>
    </div>
  );
};
```

### 3. Live Match View (User)

```typescript
// src/components/user/MatchView.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { socketService } from "../../services/socket.service";
import { useMatchStore } from "../../stores/match.store";

export const MatchView = () => {
  const { matchId } = useParams();
  const { currentMatch, addCommentary } = useMatchStore();
  const [activeTab, setActiveTab] = useState("live");

  useEffect(() => {
    if (matchId) {
      socketService.joinMatch(matchId);

      socketService.onScoreState((data) => {
        console.log("Live score update:", data);
      });

      socketService.onCommentaryAdded((data) => {
        addCommentary(data.commentary);
      });

      return () => socketService.leaveMatch(matchId);
    }
  }, [matchId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Match Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">
            {currentMatch?.teamA?.name} vs {currentMatch?.teamB?.name}
          </h1>
        </div>
      </div>

      {/* Live Score */}
      <div className="bg-green-500 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-3xl font-bold">
            {currentMatch?.score?.teamA || 0} -{" "}
            {currentMatch?.score?.teamB || 0}
          </div>
          <div className="text-lg">
            {currentMatch?.currentOver || 0}.{currentMatch?.currentBall || 0}{" "}
            overs
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {["live", "scorecard", "commentary", "odds"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "live" && <div>Live Score Content</div>}
          {activeTab === "scorecard" && <div>Scorecard Content</div>}
          {activeTab === "commentary" && <div>Commentary Content</div>}
          {activeTab === "odds" && <div>Odds Content</div>}
        </div>
      </div>
    </div>
  );
};
```

## 🎯 Admin Panel Features

### 1. Dashboard

- Overview of all matches
- Recent activities
- Quick stats
- Live match status

### 2. Match Management

- Create/edit/delete matches
- Assign players to matches
- Manage match status
- Live scoring interface

### 3. Player Management

- Add/edit player profiles
- Upload player photos
- Manage player statistics
- Team assignments

### 4. Live Scoring

- Ball-by-ball scoring
- Undo functionality
- Real-time updates
- Commentary addition
- Strike rotation management

## 🎯 User Website Features

### 1. Home Page

- Live matches display
- Upcoming matches
- Recent results
- Quick navigation

### 2. Live Match View

- Real-time score updates
- Ball-by-ball commentary
- Player statistics
- Match notifications
- Odds display

### 3. Match History

- Past match results
- Detailed scorecards
- Player performances
- Match highlights

## 🔐 Authentication Flow

### 1. Login/Register

```typescript
// src/pages/auth/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import { authService } from "../../services/auth.service";

export const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login(credentials);
      login(response.user, response.accessToken);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow"
        >
          <input
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            className="w-full border rounded px-3 py-2 mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            className="w-full border rounded px-3 py-2 mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
```

### 2. Role-based Routing

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Login } from "./pages/auth/Login";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { UserHome } from "./pages/user/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin", "scorer"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* User Routes */}
        <Route path="/" element={<UserHome />} />
        <Route path="/match/:id" element={<MatchView />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## 🚀 Deployment

### 1. Build

```bash
npm run build
```

### 2. Environment Variables

```bash
# Production
VITE_API_URL=https://your-api-domain.com/api
VITE_SOCKET_URL=https://your-api-domain.com
```

### 3. Deploy

```bash
# Vercel
npm i -g vercel
vercel --prod

# Netlify
npm run build
# Upload dist folder
```

## 🧪 Testing

### 1. Unit Tests

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### 2. Component Test Example

```typescript
// src/components/__tests__/LiveScoring.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { LiveScoring } from "../admin/LiveScoring";

test("renders live scoring form", () => {
  render(<LiveScoring />);
  expect(screen.getByText("Live Scoring")).toBeInTheDocument();
  expect(screen.getByText("Apply Ball")).toBeInTheDocument();
});
```

## 📱 Responsive Design

### Tailwind CSS Classes

```css
/* Mobile first approach */
.container {
  @apply px-4 sm:px-6 lg:px-8;
}

.grid {
  @apply grid-cols-1 md:grid-cols-2 lg:grid-cols-3;
}
```

## 🎨 UI Components

### Common Components

```typescript
// src/components/common/Button.tsx
interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button = ({
  variant = "primary",
  size = "md",
  children,
  onClick,
}: ButtonProps) => {
  const baseClasses =
    "font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

## 🔧 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Lint code
```

## 📊 Performance Optimization

### 1. Code Splitting

```typescript
// Lazy load components
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const MatchView = lazy(() => import("./pages/user/MatchView"));
```

### 2. React Query Setup

```typescript
// src/main.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

---

## 🎯 **Implementation Priority**

1. **Setup & Authentication** - Project setup, auth flow, routing
2. **API Integration** - Connect to backend APIs
3. **Admin Panel** - Dashboard, match management, live scoring
4. **WebSocket Integration** - Real-time updates
5. **User Interface** - Public match viewing
6. **Enhanced Features** - Commentary, strike rotation, etc.
7. **Testing & Polish** - Testing, optimization, deployment

This frontend will provide a complete, responsive, and real-time experience for both administrators and viewers! 🏏✨
