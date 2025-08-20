// Test script to show squad endpoint response format
// Run this with: node test_squad_endpoint.js

const fetch = require("node-fetch");

async function testSquadEndpoint() {
  const matchId = "68a418b9e9f3a0b5f9a2cebc";
  const token = "your_jwt_token_here"; // Replace with actual token

  try {
    // Test GET squad endpoint
    console.log("Testing GET /api/matches/{matchId}/squad");
    console.log("=====================================");

    const response = await fetch(
      `http://localhost:5000/api/matches/${matchId}/squad`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const squad = await response.json();
      console.log("Response Format:");
      console.log(JSON.stringify(squad, null, 2));

      console.log("\nPlayer Details Available:");
      if (squad.teamA && squad.teamA.length > 0) {
        console.log("\nTeam A Players:");
        squad.teamA.forEach((player, index) => {
          console.log(`${index + 1}. ${player.fullName} (${player.shortName})`);
          console.log(`   Role: ${player.role}`);
          console.log(`   Nationality: ${player.nationality}`);
          console.log(`   Batting Style: ${player.battingStyle}`);
          console.log(`   Bowling Style: ${player.bowlingStyle}`);
          console.log(`   Photo URL: ${player.photoUrl}`);
          console.log(`   ID: ${player._id}`);
          console.log("");
        });
      }

      if (squad.teamB && squad.teamB.length > 0) {
        console.log("\nTeam B Players:");
        squad.teamB.forEach((player, index) => {
          console.log(`${index + 1}. ${player.fullName} (${player.shortName})`);
          console.log(`   Role: ${player.role}`);
          console.log(`   Nationality: ${player.nationality}`);
          console.log(`   Batting Style: ${player.battingStyle}`);
          console.log(`   Bowling Style: ${player.bowlingStyle}`);
          console.log(`   Photo URL: ${player.photoUrl}`);
          console.log(`   ID: ${player._id}`);
          console.log("");
        });
      }
    } else {
      console.error("Error:", response.status, response.statusText);
      const error = await response.text();
      console.error("Error details:", error);
    }
  } catch (error) {
    console.error("Network error:", error.message);
  }
}

// Example of how to update squad
async function testUpdateSquad() {
  const matchId = "68a418b9e9f3a0b5f9a2cebc";
  const token = "your_jwt_token_here"; // Replace with actual token

  console.log("\n\nTesting PATCH /api/matches/{matchId}/squad");
  console.log("==========================================");

  const updateData = {
    teamA: [
      "68a31ce54b434e94b655857b", // Virat Kohli
      "68a31ce54b434e94b655857c", // Rohit Sharma
      "68a31ce54b434e94b655857f", // Another player
    ],
    teamB: [
      "68a31ce54b434e94b655857d", // Steve Smith
      "68a31ce54b434e94b655857e", // Another player
    ],
  };

  console.log("Request Body:");
  console.log(JSON.stringify(updateData, null, 2));

  try {
    const response = await fetch(
      `http://localhost:5000/api/matches/${matchId}/squad`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log("\nUpdate successful!");
      console.log("Updated match:", result.name);
    } else {
      console.error("Update failed:", response.status, response.statusText);
      const error = await response.text();
      console.error("Error details:", error);
    }
  } catch (error) {
    console.error("Network error:", error.message);
  }
}

// Run tests
testSquadEndpoint();
// testUpdateSquad(); // Uncomment to test update functionality
