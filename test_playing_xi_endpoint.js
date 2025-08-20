// Test script to check Playing XI endpoint response
// Run this with: node test_playing_xi_endpoint.js

const fetch = require("node-fetch");

async function testPlayingXIEndpoint() {
  const matchId = "68a418b9e9f3a0b5f9a2cebc";
  const token = "your_jwt_token_here"; // Replace with actual token

  try {
    console.log("Testing GET /api/matches/{matchId}/playing-xi");
    console.log("==========================================");

    const response = await fetch(
      `http://localhost:5000/api/matches/${matchId}/playing-xi`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const playingXI = await response.json();
      console.log("Response Format:");
      console.log(JSON.stringify(playingXI, null, 2));

      console.log("\n=== ANALYSIS ===");

      // Check Team A
      if (playingXI.teamA) {
        console.log("\nTeam A:");
        console.log(`- Players: ${playingXI.teamA.players?.length || 0}`);
        console.log(
          `- Captain: ${playingXI.teamA.captain ? "Set" : "Not set"}`
        );
        console.log(
          `- Vice-Captain: ${playingXI.teamA.viceCaptain ? "Set" : "Not set"}`
        );
        console.log(
          `- Wicket-Keeper: ${playingXI.teamA.wicketKeeper ? "Set" : "Not set"}`
        );
        console.log(
          `- Batting Order: ${
            playingXI.teamA.battingOrder?.length || 0
          } players`
        );

        if (
          playingXI.teamA.battingOrder &&
          playingXI.teamA.battingOrder.length > 0
        ) {
          console.log("\nTeam A Batting Order:");
          playingXI.teamA.battingOrder.forEach((player, index) => {
            console.log(
              `${index + 1}. ${player.fullName} (${player.shortName}) - ${
                player.role
              }`
            );
          });
        } else {
          console.log("⚠️  Team A Batting Order: Not set or empty");
        }
      }

      // Check Team B
      if (playingXI.teamB) {
        console.log("\nTeam B:");
        console.log(`- Players: ${playingXI.teamB.players?.length || 0}`);
        console.log(
          `- Captain: ${playingXI.teamB.captain ? "Set" : "Not set"}`
        );
        console.log(
          `- Vice-Captain: ${playingXI.teamB.viceCaptain ? "Set" : "Not set"}`
        );
        console.log(
          `- Wicket-Keeper: ${playingXI.teamB.wicketKeeper ? "Set" : "Not set"}`
        );
        console.log(
          `- Batting Order: ${
            playingXI.teamB.battingOrder?.length || 0
          } players`
        );

        if (
          playingXI.teamB.battingOrder &&
          playingXI.teamB.battingOrder.length > 0
        ) {
          console.log("\nTeam B Batting Order:");
          playingXI.teamB.battingOrder.forEach((player, index) => {
            console.log(
              `${index + 1}. ${player.fullName} (${player.shortName}) - ${
                player.role
              }`
            );
          });
        } else {
          console.log("⚠️  Team B Batting Order: Not set or empty");
        }
      }

      // Check if batting order is missing
      if (
        !playingXI.teamA?.battingOrder ||
        playingXI.teamA.battingOrder.length === 0
      ) {
        console.log("\n❌ ISSUE: Team A batting order is missing or empty");
        console.log("This could mean:");
        console.log("1. Batting order was never set");
        console.log("2. Playing XI was created with old schema");
        console.log("3. Database migration needed");
      }

      if (
        !playingXI.teamB?.battingOrder ||
        playingXI.teamB.battingOrder.length === 0
      ) {
        console.log("\n❌ ISSUE: Team B batting order is missing or empty");
        console.log("This could mean:");
        console.log("1. Batting order was never set");
        console.log("2. Playing XI was created with old schema");
        console.log("3. Database migration needed");
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

// Test updating batting order
async function testUpdateBattingOrder() {
  const matchId = "68a418b9e9f3a0b5f9a2cebc";
  const token = "your_jwt_token_here"; // Replace with actual token

  console.log("\n\nTesting PATCH /api/matches/{matchId}/batting-order");
  console.log("================================================");

  // First, get current Playing XI to see available players
  try {
    const response = await fetch(
      `http://localhost:5000/api/matches/${matchId}/playing-xi`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const playingXI = await response.json();

      if (playingXI.teamA?.players?.length >= 11) {
        const playerIds = playingXI.teamA.players.map((p) => p._id);

        const updateData = {
          team: "A",
          battingOrder: playerIds.slice(0, 11), // Use first 11 players
        };

        console.log("Updating Team A batting order with:", updateData);

        const updateResponse = await fetch(
          `http://localhost:5000/api/matches/${matchId}/batting-order`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          }
        );

        if (updateResponse.ok) {
          console.log("✅ Batting order updated successfully!");

          // Verify the update
          const verifyResponse = await fetch(
            `http://localhost:5000/api/matches/${matchId}/playing-xi`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (verifyResponse.ok) {
            const updatedPlayingXI = await verifyResponse.json();
            console.log("\nUpdated Team A Batting Order:");
            updatedPlayingXI.teamA.battingOrder.forEach((player, index) => {
              console.log(
                `${index + 1}. ${player.fullName} (${player.shortName})`
              );
            });
          }
        } else {
          console.error(
            "❌ Failed to update batting order:",
            updateResponse.status
          );
          const error = await updateResponse.text();
          console.error("Error details:", error);
        }
      } else {
        console.log(
          "⚠️  Not enough players in Team A Playing XI to set batting order"
        );
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Run tests
testPlayingXIEndpoint();
// testUpdateBattingOrder(); // Uncomment to test updating batting order
