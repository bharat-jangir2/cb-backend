import { ApiProperty } from "@nestjs/swagger";

export class BattingStatsDto {
  @ApiProperty({ description: "Player ID" })
  playerId: string;

  @ApiProperty({ description: "Runs scored" })
  runs: number;

  @ApiProperty({ description: "Balls faced" })
  balls: number;

  @ApiProperty({ description: "Number of fours" })
  fours: number;

  @ApiProperty({ description: "Number of sixes" })
  sixes: number;

  @ApiProperty({ description: "Strike rate" })
  strikeRate: number;

  @ApiProperty({ description: "Whether player is out" })
  isOut: boolean;

  @ApiProperty({ description: "Dismissal details", required: false })
  dismissal?: any;
}

export class BowlingStatsDto {
  @ApiProperty({ description: "Player ID" })
  playerId: string;

  @ApiProperty({ description: "Overs bowled" })
  overs: number;

  @ApiProperty({ description: "Balls bowled" })
  balls: number;

  @ApiProperty({ description: "Maiden overs" })
  maidens: number;

  @ApiProperty({ description: "Runs conceded" })
  runsConceded: number;

  @ApiProperty({ description: "Wickets taken" })
  wickets: number;

  @ApiProperty({ description: "Economy rate" })
  economy: number;

  @ApiProperty({ description: "Bowling average" })
  average: number;

  @ApiProperty({ description: "Bowling strike rate" })
  strikeRate: number;

  @ApiProperty({ description: "Extras conceded" })
  extras: any;
}

export class FallOfWicketDto {
  @ApiProperty({ description: "Runs at fall of wicket" })
  runs: number;

  @ApiProperty({ description: "Wicket number" })
  wicket: number;

  @ApiProperty({ description: "Player ID" })
  playerId: string;

  @ApiProperty({ description: "Over number" })
  over: number;

  @ApiProperty({ description: "Ball number" })
  ball: number;

  @ApiProperty({ description: "Dismissal details" })
  dismissal: any;
}

export class CommentaryDto {
  @ApiProperty({ description: "Ball notation (e.g., 18.3)" })
  ball: string;

  @ApiProperty({ description: "Innings number" })
  innings: number;

  @ApiProperty({ description: "Over number" })
  over: number;

  @ApiProperty({ description: "Ball number" })
  ballNumber: number;

  @ApiProperty({ description: "Batsman ID" })
  batsmanId: string;

  @ApiProperty({ description: "Bowler ID" })
  bowlerId: string;

  @ApiProperty({ description: "Runs scored" })
  runs: number;

  @ApiProperty({ description: "Event type" })
  event: string;

  @ApiProperty({ description: "Commentary text" })
  comment: string;

  @ApiProperty({ description: "Extras details", required: false })
  extras?: any;

  @ApiProperty({ description: "Wicket details", required: false })
  wicket?: any;

  @ApiProperty({ description: "Whether reviewed", required: false })
  reviewed?: boolean;

  @ApiProperty({ description: "Review result", required: false })
  reviewResult?: any;

  @ApiProperty({ description: "Score state", required: false })
  scoreState?: any;
}

export class InningsDto {
  @ApiProperty({ description: "Innings number" })
  inningNumber: number;

  @ApiProperty({ description: "Team ID" })
  teamId: string;

  @ApiProperty({ description: "Total runs" })
  runs: number;

  @ApiProperty({ description: "Total wickets" })
  wickets: number;

  @ApiProperty({ description: "Overs completed" })
  overs: number;

  @ApiProperty({ description: "Extras conceded" })
  extras: number;

  @ApiProperty({ description: "Batting statistics" })
  batting: BattingStatsDto[];

  @ApiProperty({ description: "Bowling statistics" })
  bowling: BowlingStatsDto[];

  @ApiProperty({ description: "Fall of wickets" })
  fallOfWickets: FallOfWicketDto[];

  @ApiProperty({ description: "Power plays", required: false })
  powerPlays?: any[];
}

export class MatchSummaryDto {
  @ApiProperty({ description: "Total overs" })
  totalOvers: number;

  @ApiProperty({ description: "Match type" })
  matchType: string;

  @ApiProperty({ description: "Venue" })
  venue: string;

  @ApiProperty({ description: "Toss winner", required: false })
  tossWinner?: string;

  @ApiProperty({ description: "Toss decision", required: false })
  tossDecision?: string;

  @ApiProperty({ description: "Match result", required: false })
  result?: any;

  @ApiProperty({ description: "Man of the match", required: false })
  manOfTheMatch?: string;

  @ApiProperty({ description: "Umpires", required: false })
  umpires?: string[];

  @ApiProperty({ description: "Third umpire", required: false })
  thirdUmpire?: string;

  @ApiProperty({ description: "Match referee", required: false })
  matchReferee?: string;

  @ApiProperty({ description: "Weather", required: false })
  weather?: string;

  @ApiProperty({ description: "Pitch condition", required: false })
  pitchCondition?: string;
}

export class ScorecardResponseDto {
  @ApiProperty({ description: "Scorecard ID" })
  _id: string;

  @ApiProperty({ description: "Match ID" })
  matchId: string;

  @ApiProperty({ description: "Tournament ID", required: false })
  tournamentId?: string;

  @ApiProperty({ description: "Series ID", required: false })
  seriesId?: string;

  @ApiProperty({
    description: "Match number within tournament/series",
    required: false,
  })
  matchNumber?: number;

  @ApiProperty({ description: "Round information", required: false })
  round?: string;

  @ApiProperty({ description: "Innings data" })
  innings: InningsDto[];

  @ApiProperty({ description: "Commentary" })
  commentary: CommentaryDto[];

  @ApiProperty({ description: "Match summary" })
  matchSummary: MatchSummaryDto;

  @ApiProperty({ description: "Last update time" })
  lastUpdateTime: Date;

  @ApiProperty({ description: "Created at" })
  createdAt: Date;

  @ApiProperty({ description: "Updated at" })
  updatedAt: Date;
}

export class TeamComparisonDto {
  @ApiProperty({ description: "Match ID" })
  matchId: string;

  @ApiProperty({ description: "Teams data" })
  teams: any[];

  @ApiProperty({ description: "Match summary" })
  summary: {
    totalRuns: number;
    totalWickets: number;
    totalOvers: number;
    runRate: number;
    highestScore: number;
    lowestScore: number;
    bestBatting: any;
    bestBowling: any;
  };
}

export class PlayerPerformanceDto {
  @ApiProperty({ description: "Player ID" })
  playerId: string;

  @ApiProperty({ description: "Batting statistics", required: false })
  batting?: BattingStatsDto;

  @ApiProperty({ description: "Bowling statistics", required: false })
  bowling?: BowlingStatsDto;
}
