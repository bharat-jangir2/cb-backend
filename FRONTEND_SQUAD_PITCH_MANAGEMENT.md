# Frontend Squad and Pitch Management Guide

## 🚀 Enhanced Features Summary

### ✅ **NEW: Complete Cricket Management System**

**Enhanced Playing XI Management:**

- ✅ **Captain & Vice-Captain** designation
- ✅ **Batting Order** management (1-11 positions)
- ✅ **Wicket-Keeper** designation (any player can be wicket-keeper)
- ✅ **Individual Updates** for each component
- ✅ **Validation** for all cricket rules
- ✅ **Squad Relationship Management** - All Playing XI players must be from squad
- ✅ **Duplicate Prevention** - No duplicate players in batting order
- ✅ **Cross-Validation** - Captain ≠ Vice-captain, all selections from Playing XI

**New API Endpoints:**

- `PATCH /api/matches/{matchId}/captain` - Update team captain
- `PATCH /api/matches/{matchId}/vice-captain` - Update team vice-captain
- `PATCH /api/matches/{matchId}/batting-order` - Update batting order
- `PATCH /api/matches/{matchId}/wicket-keeper` - Update wicket-keeper
- `GET /api/matches/{matchId}/squad/team/{team}` - Get squad for specific team
- `GET /api/matches/{matchId}/available-players/{team}` - Get available players with capabilities

**Enhanced Response Format:**

```json
{
  "teamA": {
    "players": [...],           // All 11 players
    "captain": {...},           // Captain details
    "viceCaptain": {...},       // Vice-captain details
    "battingOrder": [...],      // Batting order (1-11)
    "wicketKeeper": {...}       // Wicket-keeper details
  }
}
```

**Validation Rules:**

- ✅ Squad players must exist in database
- ✅ Playing XI players must be from squad
- ✅ Exactly 11 players per team
- ✅ Captain must be in Playing XI
- ✅ Vice-captain must be in Playing XI and ≠ Captain
- ✅ Wicket-keeper must be in Playing XI (any player can be wicket-keeper)
- ✅ Batting order must contain all 11 players exactly once
- ✅ All selections must be from current Playing XI

## Quick Reference - Correct Endpoints

### ❌ Don't Use (404 Error)

```http
GET /api/teams/{teamId}/players  # This endpoint doesn't exist
```

### ✅ Use These Instead

```http
GET /api/players?limit=1000                    # Get all players
GET /api/players/team/{teamId}                 # Get players by team (returns all for now)
GET /api/players/role/{role}                   # Get players by role
GET /api/teams/{teamId}                        # Get team details
GET /api/matches/{matchId}/squad               # Get match squad
PATCH /api/matches/{matchId}/squad             # Update match squad
```

## Overview

This guide provides comprehensive instructions for frontend developers on how to manage squad selection and pitch conditions for cricket matches using the existing API endpoints.

## Table of Contents

1. [Squad Management](#squad-management)
2. [Playing XI Management](#playing-xi-management)
3. [Pitch Condition Management](#pitch-condition-management)
4. [API Endpoints Reference](#api-endpoints-reference)
5. [Frontend Implementation Examples](#frontend-implementation-examples)
6. [Best Practices](#best-practices)

## Squad Management

### What is Squad?

- **Squad**: The complete list of players available for a team in a match (usually 15-18 players)
- **Playing XI**: The final 11 players who will actually play the match
- Teams can have different squad sizes but must select exactly 11 players for Playing XI

### API Endpoints for Squad Management

#### 1. Get Match Squad

```http
GET /api/matches/{matchId}/squad
Authorization: Bearer {token}
```

**Response:**

```json
{
  "teamA": [
    {
      "_id": "68a31ce54b434e94b655857b",
      "fullName": "Virat Kohli",
      "shortName": "V Kohli",
      "role": "batsman",
      "nationality": "India",
      "battingStyle": "Right-handed",
      "bowlingStyle": "Right-arm medium",
      "photoUrl": "https://example.com/virat-kohli.jpg"
    },
    {
      "_id": "68a31ce54b434e94b655857c",
      "fullName": "Rohit Sharma",
      "shortName": "R Sharma",
      "role": "batsman",
      "nationality": "India",
      "battingStyle": "Right-handed",
      "bowlingStyle": "Right-arm off break",
      "photoUrl": "https://example.com/rohit-sharma.jpg"
    }
  ],
  "teamB": [
    {
      "_id": "68a31ce54b434e94b655857d",
      "fullName": "Steve Smith",
      "shortName": "SPD Smith",
      "role": "batsman",
      "nationality": "Australia",
      "battingStyle": "Right-handed",
      "bowlingStyle": "Right-arm leg break",
      "photoUrl": "https://example.com/steve-smith.jpg"
    }
  ]
}
```

#### 2. Update Match Squad

```http
PATCH /api/matches/{matchId}/squad
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "teamA": ["68a31ce54b434e94b655857b", "68a31ce54b434e94b655857c"],
  "teamB": ["68a31ce54b434e94b655857d", "68a31ce54b434e94b655857e"]
}
```

**Note:** You can update either teamA, teamB, or both. Omitted teams will remain unchanged.

## Playing XI Management

### What is Playing XI?

The final 11 players selected from the squad who will play the match

- Must be exactly 11 players per team
- Can be changed before the match starts (before toss)

### API Endpoints for Playing XI Management

#### 1. Get Playing XI

```http
GET /api/matches/{matchId}/playing-xi
Authorization: Bearer {token}
```

**Response:**

```json
{
  "teamA": {
    "players": [
      {
        "_id": "68a31ce54b434e94b655857b",
        "fullName": "Virat Kohli",
        "shortName": "V Kohli",
        "role": "batsman",
        "nationality": "India",
        "battingStyle": "Right-handed",
        "bowlingStyle": "Right-arm medium",
        "photoUrl": "https://example.com/virat-kohli.jpg"
      }
    ],
    "captain": {
      "_id": "68a31ce54b434e94b655857b",
      "fullName": "Virat Kohli",
      "shortName": "V Kohli",
      "role": "batsman",
      "nationality": "India"
    },
    "viceCaptain": {
      "_id": "68a31ce54b434e94b655857c",
      "fullName": "Rohit Sharma",
      "shortName": "R Sharma",
      "role": "batsman",
      "nationality": "India"
    },
    "battingOrder": [
      {
        "_id": "68a31ce54b434e94b655857c",
        "fullName": "Rohit Sharma",
        "shortName": "R Sharma",
        "role": "batsman",
        "nationality": "India"
      },
      {
        "_id": "68a31ce54b434e94b655857b",
        "fullName": "Virat Kohli",
        "shortName": "V Kohli",
        "role": "batsman",
        "nationality": "India"
      },
      {
        "_id": "68a31ce54b434e94b655857f",
        "fullName": "KL Rahul",
        "shortName": "KL Rahul",
        "role": "batsman",
        "nationality": "India"
      },
      {
        "_id": "68a31ce54b434e94b655857g",
        "fullName": "Rishabh Pant",
        "shortName": "R Pant",
        "role": "wicket_keeper",
        "nationality": "India"
      },
      {
        "_id": "68a31ce54b434e94b655857h",
        "fullName": "Hardik Pandya",
        "shortName": "H Pandya",
        "role": "all_rounder",
        "nationality": "India"
      },
      {
        "_id": "68a31ce54b434e94b655857i",
        "fullName": "Ravindra Jadeja",
        "shortName": "R Jadeja",
        "role": "all_rounder",
        "nationality": "India"
      },
      {
        "_id": "68a31ce54b434e94b655857j",
        "fullName": "Bhuvneshwar Kumar",
        "shortName": "B Kumar",
        "role": "bowler",
        "nationality": "India"
      },
      {
        "_id": "68a31ce54b434e94b655857k",
        "fullName": "Jasprit Bumrah",
        "shortName": "J Bumrah",
        "role": "bowler",
        "nationality": "India"
      },
      {
        "_id": "68a31ce54b434e94b655857l",
        "fullName": "Yuzvendra Chahal",
        "shortName": "Y Chahal",
        "role": "bowler",
        "nationality": "India"
      },
      {
        "_id": "68a31ce54b434e94b655857m",
        "fullName": "Mohammed Shami",
        "shortName": "M Shami",
        "role": "bowler",
        "nationality": "India"
      },
      {
        "_id": "68a31ce54b434e94b655857n",
        "fullName": "Arshdeep Singh",
        "shortName": "A Singh",
        "role": "bowler",
        "nationality": "India"
      }
    ],
    "wicketKeeper": {
      "_id": "68a31ce54b434e94b655857g",
      "fullName": "Rishabh Pant",
      "shortName": "R Pant",
      "role": "wicket_keeper",
      "nationality": "India"
    }
  },
  "teamB": {
    "players": [
      {
        "_id": "68a31ce54b434e94b655857e",
        "fullName": "Steve Smith",
        "shortName": "SPD Smith",
        "role": "batsman",
        "nationality": "Australia",
        "battingStyle": "Right-handed",
        "bowlingStyle": "Right-arm leg break",
        "photoUrl": "https://example.com/steve-smith.jpg"
      }
    ],
    "captain": {
      "_id": "68a31ce54b434e94b655857e",
      "fullName": "Steve Smith",
      "shortName": "SPD Smith",
      "role": "batsman",
      "nationality": "Australia"
    },
    "viceCaptain": null,
    "battingOrder": [],
    "wicketKeeper": null
  }
}
```

**Key Features:**

- ✅ **Batting Order** - Complete 1-11 batting order with player details
- ✅ **Sequence Maintained** - Batting order preserves the exact sequence
- ✅ **Player Details** - Full player information for each position
- ✅ **All Components** - Captain, vice-captain, wicket-keeper, and batting order

#### 2. Update Playing XI

```http
PATCH /api/matches/{matchId}/playing-xi
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "teamA": {
    "players": [
      "68a31ce54b434e94b655857b",
      "68a31ce54b434e94b655857c",
      "68a31ce54b434e94b655857f",
      "68a31ce54b434e94b655857g",
      "68a31ce54b434e94b655857h",
      "68a31ce54b434e94b655857i",
      "68a31ce54b434e94b655857j",
      "68a31ce54b434e94b655857k",
      "68a31ce54b434e94b655857l",
      "68a31ce54b434e94b655857m",
      "68a31ce54b434e94b655857n"
    ],
    "captain": "68a31ce54b434e94b655857b",
    "viceCaptain": "68a31ce54b434e94b655857c",
    "battingOrder": [
      "68a31ce54b434e94b655857c",
      "68a31ce54b434e94b655857b",
      "68a31ce54b434e94b655857f",
      "68a31ce54b434e94b655857g",
      "68a31ce54b434e94b655857h",
      "68a31ce54b434e94b655857i",
      "68a31ce54b434e94b655857j",
      "68a31ce54b434e94b655857k",
      "68a31ce54b434e94b655857l",
      "68a31ce54b434e94b655857m",
      "68a31ce54b434e94b655857n"
    ],
    "wicketKeeper": "68a31ce54b434e94b655857d"
  },
  "teamB": {
    "players": [
      "68a31ce54b434e94b655857e",
      "68a31ce54b434e94b655857o",
      "68a31ce54b434e94b655857p",
      "68a31ce54b434e94b655857q",
      "68a31ce54b434e94b655857r",
      "68a31ce54b434e94b655857s",
      "68a31ce54b434e94b655857t",
      "68a31ce54b434e94b655857u",
      "68a31ce54b434e94b655857v",
      "68a31ce54b434e94b655857w",
      "68a31ce54b434e94b655857x"
    ],
    "captain": "68a31ce54b434e94b655857e",
    "viceCaptain": "68a31ce54b434e94b655857o",
    "battingOrder": [
      "68a31ce54b434e94b655857e",
      "68a31ce54b434e94b655857o",
      "68a31ce54b434e94b655857p",
      "68a31ce54b434e94b655857q",
      "68a31ce54b434e94b655857r",
      "68a31ce54b434e94b655857s",
      "68a31ce54b434e94b655857t",
      "68a31ce54b434e94b655857u",
      "68a31ce54b434e94b655857v",
      "68a31ce54b434e94b655857w",
      "68a31ce54b434e94b655857x"
    ],
    "wicketKeeper": "68a31ce54b434e94b655857p"
  }
}
```

**Important:** Each team must have exactly 11 players in the Playing XI.

### Enhanced Playing XI Management Endpoints

#### 3. Update Captain Only

```http
PATCH /api/matches/{matchId}/captain
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "team": "A",
  "captainId": "68a31ce54b434e94b655857b"
}
```

#### 4. Update Vice-Captain Only

```http
PATCH /api/matches/{matchId}/vice-captain
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "team": "A",
  "viceCaptainId": "68a31ce54b434e94b655857c"
}
```

#### 5. Update Batting Order Only

```http
PATCH /api/matches/{matchId}/batting-order
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "team": "A",
  "battingOrder": [
    "68a31ce54b434e94b655857c",
    "68a31ce54b434e94b655857b",
    "68a31ce54b434e94b655857f",
    "68a31ce54b434e94b655857g",
    "68a31ce54b434e94b655857h",
    "68a31ce54b434e94b655857i",
    "68a31ce54b434e94b655857j",
    "68a31ce54b434e94b655857k",
    "68a31ce54b434e94b655857l",
    "68a31ce54b434e94b655857m",
    "68a31ce54b434e94b655857n"
  ]
}
```

#### 6. Update Wicket-Keeper Only

```http
PATCH /api/matches/{matchId}/wicket-keeper
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "team": "A",
  "wicketKeeperId": "68a31ce54b434e94b655857d"
}
```

## Pitch Condition Management

### What is Pitch Condition?

- Describes the current state and characteristics of the cricket pitch
- Affects gameplay strategy and team selection
- Can be updated throughout the match

### API Endpoints for Pitch Condition

#### 1. Update Pitch Condition (via Match Update)

```http
PATCH /api/matches/{matchId}
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "pitchCondition": "Batting friendly - Good for stroke play"
}
```

#### 2. Get Match Details (includes pitch condition)

```http
GET /api/matches/{matchId}
Authorization: Bearer {token}
```

**Response includes:**

```json
{
  "id": "match_id",
  "name": "Match Name",
  "venue": "Stadium Name",
  "pitchCondition": "Batting friendly - Good for stroke play",
  "weather": "Sunny",
  "status": "scheduled",
  "teamA": { "id": "team_id", "name": "Team A" },
  "teamB": { "id": "team_id", "name": "Team B" }
}
```

## API Endpoints Reference

### Authentication

All endpoints require JWT authentication:

```javascript
const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};
```

### Player Management Endpoints

#### 1. Get All Players

```http
GET /api/players?page=1&limit=50
Authorization: Bearer {token}
```

#### 2. Get Players by Team

```http
GET /api/players/team/{teamId}
Authorization: Bearer {token}
```

**Note:** Currently, this endpoint returns all active players since the team-player relationship is not fully implemented in the database schema. You can filter players on the frontend based on your requirements.

#### 3. Get Squad for Specific Team

```http
GET /api/matches/{matchId}/squad/team/{team}
Authorization: Bearer {token}
```

**Response:**

```json
[
  {
    "_id": "68a31ce54b434e94b655857b",
    "fullName": "Virat Kohli",
    "shortName": "V Kohli",
    "role": "batsman",
    "nationality": "India",
    "battingStyle": "Right-handed",
    "bowlingStyle": "Right-arm medium",
    "photoUrl": "https://example.com/virat-kohli.jpg"
  }
]
```

#### 4. Get Available Players with Capabilities

```http
GET /api/matches/{matchId}/available-players/{team}
Authorization: Bearer {token}
```

**Response:**

```json
[
  {
    "_id": "68a31ce54b434e94b655857b",
    "fullName": "Virat Kohli",
    "shortName": "V Kohli",
    "role": "batsman",
    "nationality": "India",
    "battingStyle": "Right-handed",
    "bowlingStyle": "Right-arm medium",
    "photoUrl": "https://example.com/virat-kohli.jpg",
    "isInPlayingXI": true,
    "canBeCaptain": true,
    "canBeViceCaptain": true,
    "canBeWicketKeeper": false,
    "canBat": true
  }
]
```

#### 5. Get Players by Role

```http
GET /api/players/role/{role}
Authorization: Bearer {token}
```

**Available roles:** `batsman`, `bowler`, `all_rounder`, `wicket_keeper`

#### 6. Get Players by Nationality

```http
GET /api/players/nationality/{nationality}
Authorization: Bearer {token}
```

### Team Management Endpoints

#### 1. Get All Teams

```http
GET /api/teams?page=1&limit=50
Authorization: Bearer {token}
```

#### 2. Get Team by ID

```http
GET /api/teams/{teamId}
Authorization: Bearer {token}
```

### Error Handling

```javascript
// Common error responses
{
  "statusCode": 400,
  "message": "Bad request - validation error",
  "error": "Bad Request"
}

{
  "statusCode": 404,
  "message": "Match not found",
  "error": "Not Found"
}

{
  "statusCode": 403,
  "message": "Forbidden - insufficient permissions",
  "error": "Forbidden"
}
```

### Enhanced Validation Error Messages

The system now provides specific validation error messages:

```javascript
// Squad Validation Errors
{
  "statusCode": 400,
  "message": "Invalid player IDs: 68a31ce54b434e94b655857x, 68a31ce54b434e94b655857y",
  "error": "Bad Request"
}

// Playing XI Validation Errors
{
  "statusCode": 400,
  "message": "Team A must have exactly 11 players",
  "error": "Bad Request"
}

{
  "statusCode": 400,
  "message": "Team A players not in squad: 68a31ce54b434e94b655857x",
  "error": "Bad Request"
}

{
  "statusCode": 400,
  "message": "Team A captain must be in the playing XI",
  "error": "Bad Request"
}

{
  "statusCode": 400,
  "message": "Vice-captain cannot be the same as captain",
  "error": "Bad Request"
}

{
  "statusCode": 400,
  "message": "Team A batting order must contain all 11 players exactly once",
  "error": "Bad Request"
}
```

### Frontend Validation Best Practices

```javascript
// Validate before sending requests
const validatePlayingXI = (teamData) => {
  const errors = [];

  // Check player count
  if (teamData.players.length !== 11) {
    errors.push("Must have exactly 11 players");
  }

  // Check captain is selected
  if (!teamData.captain) {
    errors.push("Captain must be selected");
  }

  // Check vice-captain is selected
  if (!teamData.viceCaptain) {
    errors.push("Vice-captain must be selected");
  }

  // Check captain ≠ vice-captain
  if (teamData.captain === teamData.viceCaptain) {
    errors.push("Captain and vice-captain cannot be the same");
  }

  // Check wicket-keeper is selected
  if (!teamData.wicketKeeper) {
    errors.push("Wicket-keeper must be selected");
  }

  // Check batting order has all players
  if (teamData.battingOrder.length !== 11) {
    errors.push("Batting order must have all 11 players");
  }

  // Check no duplicates in batting order
  const battingOrderSet = new Set(teamData.battingOrder);
  if (battingOrderSet.size !== 11) {
    errors.push("Batting order cannot have duplicate players");
  }

  return errors;
};

// Use in component
const handleUpdatePlayingXI = async () => {
  const errors = validatePlayingXI(selectedPlayers.teamA);
  if (errors.length > 0) {
    alert("Validation errors:\n" + errors.join("\n"));
    return;
  }

  // Proceed with API call
  await updatePlayingXI();
};
```

## Frontend Implementation Examples

### React/JavaScript Examples

#### 1. Player Selection Strategy

Since the team-player relationship is not fully implemented in the database, here are strategies for player selection:

```javascript
// Strategy 1: Get all players and filter by team on frontend
const getAllPlayersForTeam = async (teamId, token) => {
  try {
    const response = await fetch(`/api/players?limit=1000`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    // Filter players based on your business logic
    // You can maintain a mapping of players to teams in your frontend
    const teamPlayers = data.data.filter(player =>
      // Add your team-player mapping logic here
      player.teamId === teamId ||
      player.nationality === getTeamNationality(teamId) ||
      // Other filtering criteria
    );

    return teamPlayers;
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
};

// Strategy 2: Use the team endpoint (returns all players for now)
const getPlayersByTeam = async (teamId, token) => {
  try {
    const response = await fetch(`/api/players/team/${teamId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const players = await response.json();

    // Apply additional filtering if needed
    return players;
  } catch (error) {
    console.error("Error fetching team players:", error);
    return [];
  }
};

// Strategy 3: Get players by role for better team balance
const getPlayersByRole = async (role, token) => {
  try {
    const response = await fetch(`/api/players/role/${role}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const players = await response.json();
    return players;
  } catch (error) {
    console.error("Error fetching players by role:", error);
    return [];
  }
};
```

#### 2. Enhanced Squad Management Component

```javascript
import React, { useState, useEffect } from "react";

const SquadManagement = ({ matchId, token }) => {
  const [squad, setSquad] = useState({ teamA: [], teamB: [] });
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [teams, setTeams] = useState({ teamA: null, teamB: null });
  const [loading, setLoading] = useState(false);

  // Fetch match details to get team IDs
  const fetchMatchDetails = async () => {
    try {
      const response = await fetch(`/api/matches/${matchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const match = await response.json();

      // Fetch team details
      const [teamAResponse, teamBResponse] = await Promise.all([
        fetch(`/api/teams/${match.teamAId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`/api/teams/${match.teamBId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
      ]);

      const teamA = await teamAResponse.json();
      const teamB = await teamBResponse.json();

      setTeams({ teamA, teamB });
    } catch (error) {
      console.error("Error fetching match details:", error);
    }
  };

  // Fetch all available players
  const fetchAvailablePlayers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/players?limit=1000`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setAvailablePlayers(data.data);
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch current squad
  const fetchSquad = async () => {
    try {
      const response = await fetch(`/api/matches/${matchId}/squad`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setSquad(data);
    } catch (error) {
      console.error("Error fetching squad:", error);
    }
  };

  // Update squad
  const updateSquad = async (teamData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/matches/${matchId}/squad`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teamData),
      });

      if (response.ok) {
        await fetchSquad(); // Refresh data
        alert("Squad updated successfully!");
      }
    } catch (error) {
      console.error("Error updating squad:", error);
      alert("Failed to update squad");
    } finally {
      setLoading(false);
    }
  };

  // Filter players by team (you can implement your own logic)
  const getPlayersForTeam = (teamId) => {
    // For now, return all players. You can implement filtering based on:
    // - Team nationality
    // - Player contracts
    // - League affiliations
    // - Custom team-player mappings
    return availablePlayers;
  };

  useEffect(() => {
    fetchMatchDetails();
    fetchAvailablePlayers();
    fetchSquad();
  }, [matchId]);

  return (
    <div>
      <h2>Squad Management</h2>
      {loading && <p>Loading...</p>}

      {/* Team A Squad */}
      <div>
        <h3>{teams.teamA?.name || "Team A"} Squad</h3>
        <div>
          <h4>Available Players:</h4>
          <ul>
            {getPlayersForTeam(teams.teamA?._id).map((player) => (
              <li key={player._id}>
                {player.fullName} - {player.role} ({player.nationality})
                <button
                  onClick={() => {
                    const newSquad = {
                      ...squad,
                      teamA: [...(squad.teamA || []), player._id],
                    };
                    updateSquad(newSquad);
                  }}
                  disabled={squad.teamA?.includes(player._id)}
                >
                  {squad.teamA?.includes(player._id) ? "Added" : "Add to Squad"}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Current Squad:</h4>
          <ul>
            {squad.teamA?.map((player) => (
              <li key={player._id}>
                {player.fullName} - {player.role} ({player.nationality})
                <button
                  onClick={() => {
                    const newSquad = {
                      ...squad,
                      teamA: squad.teamA.filter((p) => p._id !== player._id),
                    };
                    updateSquad(newSquad);
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Team B Squad */}
      <div>
        <h3>{teams.teamB?.name || "Team B"} Squad</h3>
        {/* Similar structure as Team A */}
      </div>
    </div>
  );
};
```

#### 2. Enhanced Playing XI Management Component

```javascript
const EnhancedPlayingXIManagement = ({ matchId, token }) => {
  const [playingXI, setPlayingXI] = useState({
    teamA: {
      players: [],
      captain: null,
      viceCaptain: null,
      battingOrder: [],
      wicketKeeper: null,
    },
    teamB: {
      players: [],
      captain: null,
      viceCaptain: null,
      battingOrder: [],
      wicketKeeper: null,
    },
  });
  const [selectedPlayers, setSelectedPlayers] = useState({
    teamA: {
      players: [],
      captain: null,
      viceCaptain: null,
      battingOrder: [],
      wicketKeeper: null,
    },
    teamB: {
      players: [],
      captain: null,
      viceCaptain: null,
      battingOrder: [],
      wicketKeeper: null,
    },
  });

  // Fetch Playing XI
  const fetchPlayingXI = async () => {
    try {
      const response = await fetch(`/api/matches/${matchId}/playing-xi`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setPlayingXI(data);
      setSelectedPlayers(data);
    } catch (error) {
      console.error("Error fetching Playing XI:", error);
    }
  };

  // Update Playing XI
  const updatePlayingXI = async () => {
    // Validate exactly 11 players per team
    if (
      selectedPlayers.teamA.players.length !== 11 ||
      selectedPlayers.teamB.players.length !== 11
    ) {
      alert("Each team must have exactly 11 players!");
      return;
    }

    // Validate captain and vice-captain are selected
    if (!selectedPlayers.teamA.captain || !selectedPlayers.teamA.viceCaptain) {
      alert("Please select captain and vice-captain for Team A!");
      return;
    }

    if (!selectedPlayers.teamB.captain || !selectedPlayers.teamB.viceCaptain) {
      alert("Please select captain and vice-captain for Team B!");
      return;
    }

    // Validate wicket-keeper is selected
    if (!selectedPlayers.teamA.wicketKeeper) {
      alert("Please select wicket-keeper for Team A!");
      return;
    }

    if (!selectedPlayers.teamB.wicketKeeper) {
      alert("Please select wicket-keeper for Team B!");
      return;
    }

    // Validate batting order has all 11 players
    if (
      selectedPlayers.teamA.battingOrder.length !== 11 ||
      selectedPlayers.teamB.battingOrder.length !== 11
    ) {
      alert("Please set batting order for all 11 players!");
      return;
    }

    try {
      const response = await fetch(`/api/matches/${matchId}/playing-xi`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedPlayers),
      });

      if (response.ok) {
        await fetchPlayingXI();
        alert("Playing XI updated successfully!");
      }
    } catch (error) {
      console.error("Error updating Playing XI:", error);
      alert("Failed to update Playing XI");
    }
  };

  // Update individual components
  const updateCaptain = async (team, captainId) => {
    try {
      const response = await fetch(`/api/matches/${matchId}/captain`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ team, captainId }),
      });

      if (response.ok) {
        await fetchPlayingXI();
        alert("Captain updated successfully!");
      }
    } catch (error) {
      console.error("Error updating captain:", error);
    }
  };

  const updateViceCaptain = async (team, viceCaptainId) => {
    try {
      const response = await fetch(`/api/matches/${matchId}/vice-captain`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ team, viceCaptainId }),
      });

      if (response.ok) {
        await fetchPlayingXI();
        alert("Vice-captain updated successfully!");
      }
    } catch (error) {
      console.error("Error updating vice-captain:", error);
    }
  };

  const updateBattingOrder = async (team, battingOrder) => {
    try {
      const response = await fetch(`/api/matches/${matchId}/batting-order`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ team, battingOrder }),
      });

      if (response.ok) {
        await fetchPlayingXI();
        alert("Batting order updated successfully!");
      }
    } catch (error) {
      console.error("Error updating batting order:", error);
    }
  };

  const updateWicketKeeper = async (team, wicketKeeperId) => {
    try {
      const response = await fetch(`/api/matches/${matchId}/wicket-keeper`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ team, wicketKeeperId }),
      });

      if (response.ok) {
        await fetchPlayingXI();
        alert("Wicket-keeper updated successfully!");
      }
    } catch (error) {
      console.error("Error updating wicket-keeper:", error);
    }
  };

  return (
    <div>
      <h2>Enhanced Playing XI Management</h2>

      {/* Team A Management */}
      <div>
        <h3>Team A Playing XI ({selectedPlayers.teamA.players.length}/11)</h3>

        {/* Player Selection */}
        <div>
          <h4>Select Players:</h4>
          {/* Player selection interface */}
        </div>

        {/* Captain Selection */}
        <div>
          <h4>Captain:</h4>
          <select
            value={selectedPlayers.teamA.captain || ""}
            onChange={(e) => {
              setSelectedPlayers((prev) => ({
                ...prev,
                teamA: { ...prev.teamA, captain: e.target.value },
              }));
            }}
          >
            <option value="">Select Captain</option>
            {selectedPlayers.teamA.players.map((player) => (
              <option key={player._id} value={player._id}>
                {player.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Vice-Captain Selection */}
        <div>
          <h4>Vice-Captain:</h4>
          <select
            value={selectedPlayers.teamA.viceCaptain || ""}
            onChange={(e) => {
              setSelectedPlayers((prev) => ({
                ...prev,
                teamA: { ...prev.teamA, viceCaptain: e.target.value },
              }));
            }}
          >
            <option value="">Select Vice-Captain</option>
            {selectedPlayers.teamA.players.map((player) => (
              <option key={player._id} value={player._id}>
                {player.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Wicket-Keeper Selection */}
        <div>
          <h4>Wicket-Keeper:</h4>
          <select
            value={selectedPlayers.teamA.wicketKeeper || ""}
            onChange={(e) => {
              setSelectedPlayers((prev) => ({
                ...prev,
                teamA: { ...prev.teamA, wicketKeeper: e.target.value },
              }));
            }}
          >
            <option value="">Select Wicket-Keeper</option>
            {selectedPlayers.teamA.players
              .filter((player) => player.role === "wicket_keeper")
              .map((player) => (
                <option key={player._id} value={player._id}>
                  {player.fullName}
                </option>
              ))}
          </select>
        </div>

        {/* Batting Order */}
        <div>
          <h4>Batting Order:</h4>
          <div>
            {selectedPlayers.teamA.players.map((player, index) => (
              <div key={player._id}>
                <span>{index + 1}. </span>
                <select
                  value={selectedPlayers.teamA.battingOrder[index] || ""}
                  onChange={(e) => {
                    const newBattingOrder = [
                      ...selectedPlayers.teamA.battingOrder,
                    ];
                    newBattingOrder[index] = e.target.value;
                    setSelectedPlayers((prev) => ({
                      ...prev,
                      teamA: { ...prev.teamA, battingOrder: newBattingOrder },
                    }));
                  }}
                >
                  <option value="">Select Player</option>
                  {selectedPlayers.teamA.players.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.fullName}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team B Management - Similar structure */}
      <div>
        <h3>Team B Playing XI ({selectedPlayers.teamB.players.length}/11)</h3>
        {/* Similar structure as Team A */}
      </div>

      <button onClick={updatePlayingXI}>Update Playing XI</button>
    </div>
  );
};
```

#### 3. Pitch Condition Management Component

```javascript
const PitchConditionManagement = ({ matchId, token }) => {
  const [pitchCondition, setPitchCondition] = useState("");
  const [match, setMatch] = useState(null);

  // Fetch match details
  const fetchMatch = async () => {
    try {
      const response = await fetch(`/api/matches/${matchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setMatch(data);
      setPitchCondition(data.pitchCondition || "");
    } catch (error) {
      console.error("Error fetching match:", error);
    }
  };

  // Update pitch condition
  const updatePitchCondition = async () => {
    try {
      const response = await fetch(`/api/matches/${matchId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pitchCondition }),
      });

      if (response.ok) {
        await fetchMatch();
        alert("Pitch condition updated successfully!");
      }
    } catch (error) {
      console.error("Error updating pitch condition:", error);
      alert("Failed to update pitch condition");
    }
  };

  useEffect(() => {
    fetchMatch();
  }, [matchId]);

  return (
    <div>
      <h2>Pitch Condition Management</h2>

      <div>
        <label>Current Pitch Condition:</label>
        <textarea
          value={pitchCondition}
          onChange={(e) => setPitchCondition(e.target.value)}
          placeholder="Describe the pitch condition..."
          rows={4}
          cols={50}
        />
      </div>

      <button onClick={updatePitchCondition}>Update Pitch Condition</button>

      {match && (
        <div>
          <h3>Match Information</h3>
          <p>
            <strong>Venue:</strong> {match.venue}
          </p>
          <p>
            <strong>Weather:</strong> {match.weather}
          </p>
          <p>
            <strong>Status:</strong> {match.status}
          </p>
        </div>
      )}
    </div>
  );
};
```

## Current API Limitations and Solutions

### Issue: Team-Player Relationship

The current database schema doesn't have a direct relationship between players and teams. This means:

1. **No direct team-player mapping** in the database
2. **`/api/teams/{teamId}/players` endpoint doesn't exist** (hence the 404 error)
3. **Player selection requires frontend filtering**

### Solutions

#### 1. Frontend Filtering (Immediate Solution)

```javascript
// Create a team-player mapping in your frontend
const teamPlayerMapping = {
  "68a31ce54b434e94b655857b": ["player_id_1", "player_id_2", "player_id_3"],
  // ... other teams
};

// Filter players for a specific team
const getTeamPlayers = (teamId) => {
  const playerIds = teamPlayerMapping[teamId] || [];
  return allPlayers.filter((player) => playerIds.includes(player._id));
};
```

#### 2. Nationality-Based Filtering

```javascript
// Filter players by team nationality
const getPlayersByTeamNationality = (teamId, allPlayers) => {
  const teamNationalities = {
    "68a31ce54b434e94b655857b": ["India", "Indian"],
    // ... other teams
  };

  const nationalities = teamNationalities[teamId] || [];
  return allPlayers.filter((player) =>
    nationalities.includes(player.nationality)
  );
};
```

#### 3. Role-Based Selection

```javascript
// Ensure team balance by role
const getBalancedTeamPlayers = (allPlayers) => {
  const batsmen = allPlayers.filter((p) => p.role === "batsman");
  const bowlers = allPlayers.filter((p) => p.role === "bowler");
  const allRounders = allPlayers.filter((p) => p.role === "all_rounder");
  const wicketKeepers = allPlayers.filter((p) => p.role === "wicket_keeper");

  return {
    batsmen,
    bowlers,
    allRounders,
    wicketKeepers,
  };
};
```

### Recommended Implementation Strategy

1. **Use `/api/players?limit=1000`** to get all players
2. **Implement frontend filtering** based on your business logic
3. **Create team-player mappings** in your application state
4. **Use the new `/api/players/team/{teamId}` endpoint** (returns all players for now)
5. **Consider database schema enhancement** for future releases

### Database Schema Enhancement (Future)

To properly implement team-player relationships, consider adding:

```javascript
// In player schema
@Prop({ type: Types.ObjectId, ref: "Team" })
currentTeam: Types.ObjectId;

@Prop([{ type: Types.ObjectId, ref: "Team" }])
previousTeams: Types.ObjectId[];

@Prop()
contractStartDate: Date;

@Prop()
contractEndDate: Date;
```

## Best Practices

### 1. Squad Management

- **Validation**: Ensure squad size is reasonable (15-18 players per team)
- **Player Roles**: Display player roles (batsman, bowler, all-rounder, wicket-keeper)
- **Team Balance**: Provide guidance on maintaining team balance
- **Backup Players**: Include backup players for key positions

### 2. Playing XI Management

- **Validation**: Enforce exactly 11 players per team
- **Role Balance**: Ensure proper mix of batsmen, bowlers, all-rounders
- **Wicket-keeper**: Ensure at least one wicket-keeper is selected
- **Captain/Vice-captain**: Allow designation of captain and vice-captain

### 3. Pitch Condition Management

- **Real-time Updates**: Allow updates during the match
- **Historical Data**: Track pitch condition changes over time
- **Impact Analysis**: Show how pitch condition affects strategy
- **Weather Integration**: Consider weather impact on pitch

### 4. User Experience

- **Drag & Drop**: Implement drag-and-drop for player selection
- **Search/Filter**: Allow searching and filtering players by role
- **Validation Feedback**: Provide clear validation messages
- **Auto-save**: Auto-save changes to prevent data loss
- **Undo/Redo**: Allow undoing changes

### 5. Permissions

- **Role-based Access**: Only admins and scorers can modify squads
- **Match Status**: Prevent changes after match starts
- **Audit Trail**: Log all changes for accountability

### 6. Performance

- **Caching**: Cache squad and player data
- **Optimistic Updates**: Update UI immediately, sync with server
- **Error Handling**: Graceful error handling and retry mechanisms
- **Loading States**: Show loading indicators during API calls

## Common Use Cases

### 1. Pre-match Setup

1. Create match with basic details
2. Add players to squad for both teams
3. Select Playing XI from squad
4. Set initial pitch condition
5. Update weather information

### 2. Match Day Changes

1. Update pitch condition based on inspection
2. Make last-minute Playing XI changes (before toss)
3. Update weather conditions
4. Add match officials

### 3. In-match Updates

1. Update pitch condition as match progresses
2. Track pitch deterioration
3. Update weather conditions
4. Add match events and notifications

## Integration with Other Features

### 1. Fantasy Cricket

- Squad changes affect fantasy team selection
- Playing XI determines available players
- Pitch condition affects player performance predictions

### 2. Live Scoring

- Playing XI determines who can bat/bowl
- Squad changes affect player statistics
- Pitch condition affects scoring patterns

### 3. Analytics

- Track squad performance over time
- Analyze pitch condition impact on results
- Player selection patterns and success rates

This guide provides a comprehensive framework for implementing squad and pitch management in your frontend application. The existing API endpoints are well-structured and provide all necessary functionality for managing cricket match data effectively.
