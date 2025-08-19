export interface ScrapedMatchData {
  match_id: string;
  teams: {
    team1: {
      name: string;
      shortName: string;
      runs: number;
      wickets: number;
      overs: number;
    };
    team2: {
      name: string;
      shortName: string;
      runs: number;
      wickets: number;
      overs: number;
    };
  };
  score: {
    team1: {
      runs: number;
      wickets: number;
      overs: number;
    };
    team2: {
      runs: number;
      wickets: number;
      overs: number;
    };
  };
  overs: {
    current: number;
    total: number;
  };
  wickets: {
    team1: number;
    team2: number;
  };
  commentary: string[];
  last_update: Date;
  source: string;
  reliability: number; // 0-1 score
  timestamp: Date;
}

export interface ScraperConfig {
  name: string;
  baseUrl: string;
  selectors: {
    matchInfo: string;
    team1Name: string;
    team2Name: string;
    team1Score: string;
    team2Score: string;
    team1Wickets: string;
    team2Wickets: string;
    team1Overs: string;
    team2Overs: string;
    currentOver: string;
    commentary: string;
  };
  userAgents: string[];
  rateLimit: {
    requestsPerMinute: number;
    delayBetweenRequests: number;
  };
  reliability: number; // 0-1 score
  priority: number; // 1 = highest priority
}

export interface ScraperResult {
  success: boolean;
  data?: ScrapedMatchData;
  error?: string;
  source: string;
  timestamp: Date;
  responseTime: number;
  selectorChanges?: string[];
}

export interface SourceStatus {
  name: string;
  isActive: boolean;
  lastSuccess: Date;
  lastError: Date;
  errorCount: number;
  successCount: number;
  averageResponseTime: number;
  reliability: number;
  currentSelectorVersion: string;
}

export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  discrepancies: string[];
  recommendedSource: string;
  crossCheckResults: {
    [source: string]: {
      data: ScrapedMatchData;
      reliability: number;
    };
  };
}

export interface SelectorUpdate {
  selector: string;
  oldValue: string;
  newValue: string;
  reason: string;
  timestamp: Date;
  success: boolean;
}

export interface ProxyConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
  country?: string;
  reliability: number;
}

export interface ScrapingMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  lastUpdate: Date;
  sourcesUsed: {
    [source: string]: {
      requests: number;
      successes: number;
      failures: number;
      averageResponseTime: number;
    };
  };
  selectorUpdates: SelectorUpdate[];
  proxyRotations: number;
}
