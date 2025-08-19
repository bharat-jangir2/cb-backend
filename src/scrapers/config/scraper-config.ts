import { ScraperConfig } from "../interfaces/scraper.interface";

export const SCRAPER_CONFIGS: { [key: string]: ScraperConfig } = {
  cricinfo: {
    name: "ESPNcricinfo",
    baseUrl: "https://www.espncricinfo.com",
    selectors: {
      matchInfo: ".match-info",
      team1Name: ".team-1 .team-name",
      team2Name: ".team-2 .team-name",
      team1Score: ".team-1 .score",
      team2Score: ".team-2 .score",
      team1Wickets: ".team-1 .wickets",
      team2Wickets: ".team-2 .wickets",
      team1Overs: ".team-1 .overs",
      team2Overs: ".team-2 .overs",
      currentOver: ".current-over",
      commentary: ".commentary-item",
    },
    userAgents: [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0",
    ],
    rateLimit: {
      requestsPerMinute: 30,
      delayBetweenRequests: 2000,
    },
    reliability: 0.95,
    priority: 1,
  },
  cricbuzz: {
    name: "Cricbuzz",
    baseUrl: "https://www.cricbuzz.com",
    selectors: {
      matchInfo: ".match-header",
      team1Name: ".team-1 .team-name",
      team2Name: ".team-2 .team-name",
      team1Score: ".team-1 .score",
      team2Score: ".team-2 .score",
      team1Wickets: ".team-1 .wickets",
      team2Wickets: ".team-2 .wickets",
      team1Overs: ".team-1 .overs",
      team2Overs: ".team-2 .overs",
      currentOver: ".current-over",
      commentary: ".commentary-item",
    },
    userAgents: [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:90.0) Gecko/20100101 Firefox/90.0",
    ],
    rateLimit: {
      requestsPerMinute: 25,
      delayBetweenRequests: 2400,
    },
    reliability: 0.9,
    priority: 2,
  },
  flashscore: {
    name: "Flashscore",
    baseUrl: "https://www.flashscore.com",
    selectors: {
      matchInfo: ".match-header",
      team1Name: ".team-1 .team-name",
      team2Name: ".team-2 .team-name",
      team1Score: ".team-1 .score",
      team2Score: ".team-2 .score",
      team1Wickets: ".team-1 .wickets",
      team2Wickets: ".team-2 .wickets",
      team1Overs: ".team-1 .overs",
      team2Overs: ".team-2 .overs",
      currentOver: ".current-over",
      commentary: ".commentary-item",
    },
    userAgents: [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:91.0) Gecko/20100101 Firefox/91.0",
    ],
    rateLimit: {
      requestsPerMinute: 20,
      delayBetweenRequests: 3000,
    },
    reliability: 0.85,
    priority: 3,
  },
  crex: {
    name: "Crex.live",
    baseUrl: "https://crex.live",
    selectors: {
      matchInfo: ".match-details, .match-info, .game-header",
      team1Name: ".team1-name, .batting-team .name, .team-1 .team-name",
      team2Name: ".team2-name, .bowling-team .name, .team-2 .team-name",
      team1Score: ".team1-score, .batting-team .score, .team-1 .score",
      team2Score: ".team2-score, .bowling-team .score, .team-2 .score",
      team1Wickets: ".team1-wickets, .batting-team .wickets, .team-1 .wickets",
      team2Wickets: ".team2-wickets, .bowling-team .wickets, .team-2 .wickets",
      team1Overs: ".team1-overs, .batting-team .overs, .team-1 .overs",
      team2Overs: ".team2-overs, .bowling-team .overs, .team-2 .overs",
      currentOver: ".current-over, .live-over, .over-progress",
      commentary: ".commentary, .live-commentary, .ball-by-ball",
    },
    userAgents: [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:92.0) Gecko/20100101 Firefox/92.0",
    ],
    rateLimit: {
      requestsPerMinute: 30,
      delayBetweenRequests: 2000,
    },
    reliability: 0.88,
    priority: 2,
  },
};

export const PROXY_CONFIGS = [
  {
    host: "proxy1.example.com",
    port: 8080,
    username: "user1",
    password: "pass1",
    country: "US",
    reliability: 0.9,
  },
  {
    host: "proxy2.example.com",
    port: 8080,
    username: "user2",
    password: "pass2",
    country: "UK",
    reliability: 0.85,
  },
  {
    host: "proxy3.example.com",
    port: 8080,
    username: "user3",
    password: "pass3",
    country: "CA",
    reliability: 0.8,
  },
];

export const SCRAPING_SETTINGS = {
  failoverTimeout: 10000, // 10 seconds
  maxRetries: 3,
  retryDelay: 2000,
  validationThreshold: 0.8, // 80% confidence required
  updateInterval: 5000, // 5 seconds base
  updateIntervalVariance: 1000, // ±1 second
  maxConcurrentRequests: 5,
  selectorUpdateThreshold: 3, // Number of failures before trying to update selector
  logRetentionDays: 30,
  metricsUpdateInterval: 60000, // 1 minute
};
