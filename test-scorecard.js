const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function testScorecardEndpoints() {
  try {
    console.log("🧪 Testing Scorecard Endpoints...\n");

    // Test 1: Get scorecard for a match
    console.log("1. Testing GET /api/scorecard/:matchId");
    try {
      const response = await axios.get(
        `${BASE_URL}/scorecard/68a418b9e9f3a0b5f9a2cebc`
      );
      console.log("✅ Scorecard endpoint working:", response.status);
      console.log("📊 Scorecard data structure:", {
        hasInnings: !!response.data.innings,
        inningsCount: response.data.innings?.length || 0,
        hasCommentary: !!response.data.commentary,
        commentaryCount: response.data.commentary?.length || 0,
        hasMatchSummary: !!response.data.matchSummary,
      });
    } catch (error) {
      console.log(
        "❌ Scorecard endpoint failed:",
        error.response?.status,
        error.response?.data?.message || error.message
      );
    }

    console.log("\n2. Testing GET /api/scorecard/:matchId/live");
    try {
      const response = await axios.get(
        `${BASE_URL}/scorecard/68a418b9e9f3a0b5f9a2cebc/live`
      );
      console.log("✅ Live scorecard endpoint working:", response.status);
    } catch (error) {
      console.log(
        "❌ Live scorecard endpoint failed:",
        error.response?.status,
        error.response?.data?.message || error.message
      );
    }

    console.log(
      "\n3. Testing GET /api/scorecard/:matchId/innings/:inningsNumber"
    );
    try {
      const response = await axios.get(
        `${BASE_URL}/scorecard/68a418b9e9f3a0b5f9a2cebc/innings/1`
      );
      console.log("✅ Innings scorecard endpoint working:", response.status);
      console.log("📊 Innings data structure:", {
        hasBatting: !!response.data.batting,
        battingCount: response.data.batting?.length || 0,
        hasBowling: !!response.data.bowling,
        bowlingCount: response.data.bowling?.length || 0,
        hasFallOfWickets: !!response.data.fallOfWickets,
        fallOfWicketsCount: response.data.fallOfWickets?.length || 0,
      });
    } catch (error) {
      console.log(
        "❌ Innings scorecard endpoint failed:",
        error.response?.status,
        error.response?.data?.message || error.message
      );
    }

    console.log("\n4. Testing GET /api/scorecard/:matchId/player/:playerId");
    try {
      const response = await axios.get(
        `${BASE_URL}/scorecard/68a418b9e9f3a0b5f9a2cebc/player/68a5c511f34f76ed7ea43c38`
      );
      console.log("✅ Player performance endpoint working:", response.status);
    } catch (error) {
      console.log(
        "❌ Player performance endpoint failed:",
        error.response?.status,
        error.response?.data?.message || error.message
      );
    }

    console.log("\n🎉 Scorecard API Testing Complete!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run the test
testScorecardEndpoints();
