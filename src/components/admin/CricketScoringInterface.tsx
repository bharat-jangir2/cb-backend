import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface Player {
  id: string;
  name: string;
  role: string;
  nationality: string;
  battingStyle?: string;
  bowlingStyle?: string;
}

interface BowlerStats {
  id: string;
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  isSelected: boolean;
}

interface BatsmanStats {
  id: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOnStrike: boolean;
  isOut: boolean;
  dismissedBy?: string;
}

interface MatchState {
  matchId: string;
  series: string;
  teams: {
    team1: { name: string; score: number; wickets: number; overs: number; crr: number };
    team2: { name: string; score: number; wickets: number; overs: number; crr: number };
  };
  toss: { winner: string; choice: string };
  currentInnings: number;
  powerPlay: boolean;
  dls: boolean;
  extras: { ex: number; wd: number; nb: number; lb: number; b: number; p: number };
}

const CricketScoringInterface: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [matchState, setMatchState] = useState<MatchState>({
    matchId: '68a4bca3e5dbb94da94b99c1',
    series: 'Latest Series',
    teams: {
      team1: { name: 'India', score: 0, wickets: 0, overs: 0, crr: 0 },
      team2: { name: 'Sri Lanka', score: 0, wickets: 0, overs: 0, crr: 0 }
    },
    toss: { winner: 'India', choice: 'batting' },
    currentInnings: 1,
    powerPlay: true,
    dls: false,
    extras: { ex: 0, wd: 0, nb: 0, lb: 0, b: 0, p: 0 }
  });

  const [bowlers, setBowlers] = useState<BowlerStats[]>([
    { id: '1', name: 'Ravichandran Ashwin', overs: 1, maidens: 0, runs: 4, wickets: 2, isSelected: false },
    { id: '2', name: 'Ravindra Jadeja', overs: 1, maidens: 0, runs: 4, wickets: 2, isSelected: true },
    { id: '3', name: 'Jasprit Bumrah', overs: 1, maidens: 0, runs: 3, wickets: 1, isSelected: false },
    { id: '4', name: 'Kuldeep Yadav', overs: 0, maidens: 0, runs: 0, wickets: 0, isSelected: false },
    { id: '5', name: 'Mohammed Shami', overs: 0, maidens: 0, runs: 0, wickets: 0, isSelected: false }
  ]);

  const [batsmen, setBatsmen] = useState<BatsmanStats[]>([
    { id: '1', name: 'Kusal Mendis', runs: 0, balls: 0, fours: 0, sixes: 0, isOnStrike: true, isOut: false },
    { id: '2', name: 'Dhananjaya de Silva', runs: 0, balls: 0, fours: 0, sixes: 0, isOnStrike: false, isOut: false },
    { id: '3', name: 'Charith Asalanka', runs: 2, balls: 2, fours: 0, sixes: 0, isOnStrike: false, isOut: false },
    { id: '4', name: 'Nuwan Thushara', runs: 0, balls: 0, fours: 0, sixes: 0, isOnStrike: false, isOut: false },
    { id: '5', name: 'Lahiru Kumara', runs: 4, balls: 4, fours: 0, sixes: 0, isOnStrike: false, isOut: false },
    { id: '6', name: 'Asitha Fernando', runs: 1, balls: 1, fours: 0, sixes: 0, isOnStrike: false, isOut: false },
    { id: '7', name: 'Maheesh Theekshana', runs: 2, balls: 2, fours: 0, sixes: 0, isOnStrike: false, isOut: false },
    { id: '8', name: 'Matheesha Pathirana', runs: 0, balls: 0, fours: 0, sixes: 0, isOnStrike: false, isOut: false },
    { id: '9', name: 'Dushmantha Chameera', runs: 2, balls: 2, fours: 0, sixes: 0, isOnStrike: false, isOut: false }
  ]);

  const [commentary, setCommentary] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [oddsHistory, setOddsHistory] = useState(false);
  const [showCommentary, setShowCommentary] = useState(true);
  const [onOc, setOnOc] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleBowlerSelect = (bowlerId: string) => {
    setBowlers(bowlers.map(bowler => ({
      ...bowler,
      isSelected: bowler.id === bowlerId
    })));
  };

  const handleBatsmanSelect = (batsmanId: string) => {
    setBatsmen(batsmen.map(batsman => ({
      ...batsman,
      isOnStrike: batsman.id === batsmanId
    })));
  };

  const updateBall = () => {
    // Update ball logic
    console.log('Updating ball...');
  };

  const updateScore = () => {
    // Update score logic
    console.log('Updating score...');
  };

  const updateCommentary = () => {
    // Update commentary logic
    console.log('Updating commentary...');
  };

  const togglePowerPlay = () => {
    setMatchState(prev => ({ ...prev, powerPlay: !prev.powerPlay }));
  };

  const toggleDLS = () => {
    setMatchState(prev => ({ ...prev, dls: !prev.dls }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Series: {matchState.series}</h1>
            <h2 className="text-lg text-blue-600 font-semibold">Live: {matchState.teams.team1.name} vs {matchState.teams.team2.name}</h2>
          </div>
          <div className="flex gap-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Info</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded">Squad</button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded">Squads</button>
            <button className="bg-orange-500 text-white px-4 py-2 rounded">Scorecards</button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded">Select All</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded font-bold">LIVE</button>
          </div>
        </div>

        {/* Toss Information */}
        <div className="mt-4 p-3 bg-yellow-100 rounded">
          <p className="text-gray-800">Toss: {matchState.toss.winner} Won The Toss and Choo</p>
        </div>

        {/* Controls Section */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex gap-2">
            <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">Showing</button>
            <button 
              className={`px-3 py-1 rounded text-sm ${matchState.dls ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
              onClick={toggleDLS}
            >
              DLS
            </button>
          </div>
          
          <div className="flex gap-2">
            <select className="border rounded px-2 py-1 text-sm">
              <option>Live</option>
            </select>
            <select className="border rounded px-2 py-1 text-sm">
              <option>Inv: 2</option>
            </select>
          </div>

          <div>
            <input 
              type="text" 
              placeholder="Search:" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-2 py-1 text-sm w-full"
            />
            <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm mt-1">Update</button>
          </div>

          <div className="flex gap-2">
            <button 
              className={`px-3 py-1 rounded text-sm ${matchState.powerPlay ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
              onClick={togglePowerPlay}
            >
              Power Play On
            </button>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="mt-4 flex gap-4">
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={oddsHistory}
              onChange={(e) => setOddsHistory(e.target.checked)}
            />
            <span className="text-sm">Odds History</span>
          </label>
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={showCommentary}
              onChange={(e) => setShowCommentary(e.target.checked)}
            />
            <span className="text-sm">commentary</span>
          </label>
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={onOc}
              onChange={(e) => setOnOc(e.target.checked)}
            />
            <span className="text-sm">On Oc</span>
          </label>
        </div>

        {/* Betting/Session Details */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          {['Odds', 'Session', 'lambi'].map((type) => (
            <div key={type} className="flex gap-2 items-center">
              <select className="border rounded px-2 py-1 text-sm">
                <option>Select</option>
              </select>
              <input 
                type="number" 
                defaultValue={type === 'Odds' ? 20 : type === 'Session' ? 12 : 10}
                className="border rounded px-2 py-1 text-sm w-16"
              />
              <button className="bg-red-500 text-white px-2 py-1 rounded text-sm">0</button>
              <button className="bg-blue-500 text-white px-2 py-1 rounded text-sm">Update</button>
            </div>
          ))}
        </div>

        {/* Toss Winner Display */}
        <div className="mt-4 p-3 bg-blue-100 rounded">
          <p className="text-gray-800">lahore qalandars won the Toss</p>
          <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm mt-2">Update</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Team Score Summary */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
              <span className="font-semibold">{matchState.teams.team1.name}</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{matchState.teams.team1.score}-{matchState.teams.team1.wickets}</div>
              <div className="text-sm text-gray-600">{matchState.teams.team1.overs}.0</div>
              <div className="text-xs text-gray-500">CRR: {matchState.teams.team1.crr}</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full"></div>
              <span className="font-semibold">{matchState.teams.team2.name}</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{matchState.teams.team2.score}-{matchState.teams.team2.wickets}</div>
              <div className="text-sm text-gray-600">{matchState.teams.team2.overs}.0</div>
              <div className="text-xs text-gray-500">CRR: {matchState.teams.team2.crr}</div>
            </div>
          </div>
        </div>

        {/* Scoreboard Panel */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="bg-purple-600 text-white p-2 rounded mb-4">
            <h3 className="font-bold">Scoreboard</h3>
          </div>
          
          <div className="bg-purple-100 p-3 rounded mb-4">
            <p className="text-purple-800 font-semibold">{matchState.toss.winner} Won The Toss and Choose Batting</p>
          </div>

          <div className="flex gap-2 mb-4">
            <button className="bg-purple-500 text-white px-3 py-1 rounded text-sm" onClick={updateBall}>
              Updateball
            </button>
            <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm" onClick={updateScore}>
              Update
            </button>
          </div>

          <div className="bg-gray-100 p-3 rounded mb-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold">Runs: {matchState.teams.team1.score}</div>
              </div>
              <div>
                <div className="text-lg font-bold">Wickets: {matchState.teams.team1.wickets}</div>
              </div>
              <div>
                <div className="text-lg font-bold">Overs: {matchState.teams.team1.overs}.0</div>
              </div>
            </div>
          </div>

          <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm mb-4" onClick={updateScore}>
            Update
          </button>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">comment 2</label>
            <textarea 
              value={commentary}
              onChange={(e) => setCommentary(e.target.value)}
              className="w-full border rounded p-2 text-sm"
              rows={3}
            />
            <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm mt-2" onClick={updateCommentary}>
              Update
            </button>
          </div>
        </div>

        {/* Bowlers Panel */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="bg-teal-600 text-white p-2 rounded mb-4">
            <h3 className="font-bold">Bowlers</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-1 text-left">ST</th>
                  <th className="px-2 py-1 text-left">Bowler</th>
                  <th className="px-2 py-1 text-center">O</th>
                  <th className="px-2 py-1 text-center">M</th>
                  <th className="px-2 py-1 text-center">R</th>
                  <th className="px-2 py-1 text-center">W</th>
                  <th className="px-2 py-1 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {bowlers.map((bowler) => (
                  <tr key={bowler.id} className="border-b">
                    <td className="px-2 py-1">
                      <input 
                        type="radio" 
                        name="selectedBowler"
                        checked={bowler.isSelected}
                        onChange={() => handleBowlerSelect(bowler.id)}
                      />
                    </td>
                    <td className="px-2 py-1">{bowler.name}</td>
                    <td className="px-2 py-1 text-center">{bowler.overs}</td>
                    <td className="px-2 py-1 text-center">{bowler.maidens}</td>
                    <td className="px-2 py-1 text-center">{bowler.runs}</td>
                    <td className="px-2 py-1 text-center">{bowler.wickets}</td>
                    <td className="px-2 py-1 text-center">
                      <button className="text-gray-500">⋮</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Batsmen Panel */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="bg-red-700 text-white p-2 rounded mb-4">
            <h3 className="font-bold">Batsmen</h3>
          </div>

          {/* Extras Row */}
          <div className="grid grid-cols-6 gap-2 mb-4 text-center text-sm">
            <div className="bg-gray-100 p-2 rounded">
              <div className="font-semibold">ex</div>
              <div>{matchState.extras.ex}</div>
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <div className="font-semibold">wd</div>
              <div>{matchState.extras.wd}</div>
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <div className="font-semibold">nb</div>
              <div>{matchState.extras.nb}</div>
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <div className="font-semibold">lb</div>
              <div>{matchState.extras.lb}</div>
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <div className="font-semibold">b</div>
              <div>{matchState.extras.b}</div>
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <div className="font-semibold">p</div>
              <div>{matchState.extras.p}</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-1 text-left">ST</th>
                  <th className="px-2 py-1 text-left">Strike Batsmen</th>
                  <th className="px-2 py-1 text-center">Runs</th>
                  <th className="px-2 py-1 text-center">Balls</th>
                  <th className="px-2 py-1 text-center">4s</th>
                  <th className="px-2 py-1 text-center">6s</th>
                  <th className="px-2 py-1 text-center">TO</th>
                  <th className="px-2 py-1 text-center">TR</th>
                  <th className="px-2 py-1 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {batsmen.map((batsman) => (
                  <tr key={batsman.id} className="border-b">
                    <td className="px-2 py-1">
                      <input 
                        type="checkbox" 
                        checked={batsman.isOnStrike}
                        onChange={() => handleBatsmanSelect(batsman.id)}
                      />
                    </td>
                    <td className="px-2 py-1">
                      <div className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="strikeBatsman"
                          checked={batsman.isOnStrike}
                          onChange={() => handleBatsmanSelect(batsman.id)}
                        />
                        <span>{batsman.name}</span>
                        {batsman.dismissedBy && (
                          <span className="text-red-500 text-xs">({batsman.dismissedBy})</span>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-1 text-center">{batsman.runs}</td>
                    <td className="px-2 py-1 text-center">{batsman.balls}</td>
                    <td className="px-2 py-1 text-center">{batsman.fours}</td>
                    <td className="px-2 py-1 text-center">{batsman.sixes}</td>
                    <td className="px-2 py-1 text-center">-</td>
                    <td className="px-2 py-1 text-center">-</td>
                    <td className="px-2 py-1 text-center">
                      <button className="text-gray-500">⋮</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="mt-6 flex justify-center gap-4">
        <button className="bg-red-500 text-white px-6 py-2 rounded font-semibold">
          Submit
        </button>
        <button className="bg-red-300 text-red-700 px-6 py-2 rounded font-semibold">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CricketScoringInterface;
