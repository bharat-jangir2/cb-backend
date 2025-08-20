import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CricketScoringInterface from '../../components/admin/CricketScoringInterface';

interface Match {
  id: string;
  series: string;
  team1: string;
  team2: string;
  toss: {
    winner: string;
    choice: string;
  };
  status: string;
}

const MatchScoringPage: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setLoading(true);
        // Fetch match data from API
        const response = await fetch(`http://localhost:3000/api/matches/${matchId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch match data');
        }
        const matchData = await response.json();
        setMatch(matchData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (matchId) {
      fetchMatch();
    }
  }, [matchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-center text-gray-600">Loading match data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-center">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Match Not Found</h2>
            <p className="text-gray-600">The requested match could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Match Scoring</h1>
              <p className="text-sm text-gray-600">
                {match.series} - {match.team1} vs {match.team2}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                match.status === 'live' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {match.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scoring Interface */}
      <CricketScoringInterface />
    </div>
  );
};

export default MatchScoringPage;
