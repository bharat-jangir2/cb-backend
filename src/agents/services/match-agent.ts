import { Logger } from "@nestjs/common";
import { MatchesService } from "../../matches/matches.service";
import { BallsService } from "../../balls/balls.service";
import { OddsService } from "../../odds/odds.service";
import { MatchesGateway } from "../../websocket/websocket.gateway";

export interface AgentConfig {
  updateInterval: number;
  autoUpdateOdds: boolean;
  autoReviewBalls: boolean;
  confidenceThreshold: number;
  enableMatchSetup: boolean;
  enablePostMatchHandling: boolean;
  enableDataValidation: boolean;
  enableAdminAutomation: boolean;
  retryAttempts: number;
  retryDelay: number;
}

export class MatchAgent {
  private readonly logger = new Logger(`MatchAgent-${this.matchId}`);
  private isRunning = false;
  private isPaused = false;
  private updateTimer: NodeJS.Timeout | null = null;
  private lastProcessedBallId: string | null = null;
  private lastValidationTime: Date | null = null;
  private lastStatusReport: Date | null = null;
  private retryCount = 0;
  private matchStartTime: Date | null = null;
  private validationErrors: string[] = [];
  private processedBallsCount = 0;
  private oddsUpdatesCount = 0;
  private alertsGeneratedCount = 0;

  constructor(
    private readonly matchId: string,
    private readonly matchesService: MatchesService,
    private readonly ballsService: BallsService,
    private readonly oddsService: OddsService,
    private readonly matchesGateway: MatchesGateway,
    private config: AgentConfig
  ) {}

  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn("Agent is already running");
      return;
    }

    this.isRunning = true;
    this.isPaused = false;
    this.matchStartTime = new Date();
    this.logger.log("Starting match agent");

    // Initialize match setup if enabled
    if (this.config.enableMatchSetup) {
      await this.setupMatch();
    }

    // Start the update loop
    this.scheduleUpdate();
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    this.isPaused = false;
    this.logger.log("Stopping match agent");

    // Handle post-match processing if enabled
    if (this.config.enablePostMatchHandling) {
      await this.handlePostMatch();
    }

    // Clear any pending timers
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
      this.updateTimer = null;
    }
  }

  async pause(): Promise<void> {
    if (!this.isRunning || this.isPaused) {
      return;
    }

    this.isPaused = true;
    this.logger.log("Pausing match agent");

    // Clear any pending timers
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
      this.updateTimer = null;
    }
  }

  async resume(): Promise<void> {
    if (!this.isRunning || !this.isPaused) {
      return;
    }

    this.isPaused = false;
    this.logger.log("Resuming match agent");

    // Restart the update loop
    this.scheduleUpdate();
  }

  updateConfig(config: Partial<AgentConfig>): void {
    this.config = { ...this.config, ...config };
    this.logger.log("Agent configuration updated");
  }

  // Get agent statistics
  getStats() {
    return {
      matchId: this.matchId,
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      startTime: this.matchStartTime,
      processedBalls: this.processedBallsCount,
      oddsUpdates: this.oddsUpdatesCount,
      alertsGenerated: this.alertsGeneratedCount,
      validationErrors: this.validationErrors.length,
      retryCount: this.retryCount,
    };
  }

  private scheduleUpdate(): void {
    if (!this.isRunning || this.isPaused) {
      return;
    }

    this.updateTimer = setTimeout(async () => {
      await this.update();
      this.scheduleUpdate();
    }, this.config.updateInterval);
  }

  private async update(): Promise<void> {
    try {
      this.logger.debug("Running agent update");

      // Check if match is still active
      const match = await this.matchesService.findById(this.matchId);
      if (
        !match ||
        match.status === "completed" ||
        match.status === "cancelled"
      ) {
        this.logger.log("Match completed or cancelled, stopping agent");
        await this.stop();
        return;
      }

      // Data validation if enabled
      if (this.config.enableDataValidation) {
        await this.validateMatchData();
      }

      // Process new balls if auto-review is enabled
      if (this.config.autoReviewBalls) {
        await this.processNewBalls();
      }

      // Update odds if auto-update is enabled
      if (this.config.autoUpdateOdds) {
        await this.updateOdds();
      }

      // Check for anomalies and generate alerts
      await this.checkForAnomalies();

      // Send hourly status report
      await this.sendStatusReport();

      // Reset retry count on successful update
      this.retryCount = 0;
    } catch (error) {
      this.logger.error("Error in agent update:", error);
      this.retryCount++;

      // Handle retries
      if (this.retryCount <= this.config.retryAttempts) {
        this.logger.warn(
          `Retrying update (${this.retryCount}/${this.config.retryAttempts})`
        );
        setTimeout(() => this.scheduleUpdate(), this.config.retryDelay);
        return;
      }

      // Emit error alert after max retries
      await this.matchesGateway.emitAlert(this.matchId, {
        type: "agent_error",
        message: `Agent failed after ${this.config.retryAttempts} retries: ${error.message}`,
        severity: "high",
      });
    }
  }

  private async setupMatch(): Promise<void> {
    try {
      this.logger.log("Setting up match automation");

      const match = await this.matchesService.findById(this.matchId);

      // Validate match has required data
      if (!match.teamAId || !match.teamBId) {
        throw new Error("Match missing team information");
      }

      // Check if match is ready to start
      if (match.status === "scheduled" || match.status === "toss") {
        this.logger.log("Match is in pre-match state, monitoring for start");
      }

      // Emit setup completion alert
      await this.matchesGateway.emitAlert(this.matchId, {
        type: "match_setup_complete",
        message: "Match automation setup completed",
        severity: "low",
      });
    } catch (error) {
      this.logger.error("Error in match setup:", error);
      throw error;
    }
  }

  private async validateMatchData(): Promise<void> {
    try {
      const now = new Date();
      const lastValidation = this.lastValidationTime;

      // Only validate every 30 seconds to avoid excessive API calls
      if (lastValidation && now.getTime() - lastValidation.getTime() < 30000) {
        return;
      }

      this.lastValidationTime = now;

      // Get current match state
      const matchState = await this.matchesService.getMatchState(this.matchId);
      const match = await this.matchesService.findById(this.matchId);

      // Validate score consistency
      if (matchState.score) {
        const { teamA, teamB } = matchState.score;

        // Check for impossible scores
        if (teamA.wickets > 10 || teamB.wickets > 10) {
          this.validationErrors.push("Invalid wicket count detected");
          await this.requestDataRefresh();
        }

        // Check for impossible run rates
        if (teamA.overs > 0 && teamA.runs / teamA.overs > 20) {
          this.validationErrors.push(
            "Unrealistic run rate detected for Team A"
          );
        }

        if (teamB.overs > 0 && teamB.runs / teamB.overs > 20) {
          this.validationErrors.push(
            "Unrealistic run rate detected for Team B"
          );
        }

        // Check for impossible over counts
        if (
          teamA.overs > (match.overs || 50) ||
          teamB.overs > (match.overs || 50)
        ) {
          this.validationErrors.push("Over count exceeds match limit");
          await this.requestDataRefresh();
        }
      }

      // Validate current match state
      if (
        matchState.currentInnings &&
        (matchState.currentInnings < 1 || matchState.currentInnings > 2)
      ) {
        this.validationErrors.push("Invalid innings number");
        await this.requestDataRefresh();
      }

      if (matchState.currentOver && matchState.currentOver < 0) {
        this.validationErrors.push("Invalid over number");
        await this.requestDataRefresh();
      }

      // Log validation results
      if (this.validationErrors.length > 0) {
        this.logger.warn(
          `Data validation found ${this.validationErrors.length} issues`
        );
        await this.matchesGateway.emitAlert(this.matchId, {
          type: "data_validation_error",
          message: `Found ${this.validationErrors.length} data inconsistencies`,
          details: this.validationErrors,
          severity: "medium",
        });
      }
    } catch (error) {
      this.logger.error("Error in data validation:", error);
    }
  }

  private async requestDataRefresh(): Promise<void> {
    try {
      this.logger.log("Requesting fresh data from backend");

      // Emit data refresh request
      await this.matchesGateway.emitAlert(this.matchId, {
        type: "data_refresh_requested",
        message: "Requesting fresh match data due to inconsistencies",
        severity: "medium",
      });

      // Wait for data refresh
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Re-validate after refresh
      this.lastValidationTime = null;
      await this.validateMatchData();
    } catch (error) {
      this.logger.error("Error requesting data refresh:", error);
    }
  }

  private async processNewBalls(): Promise<void> {
    try {
      // Get the last ball to check if there are new ones
      const lastBall = await this.ballsService.findLastBall(this.matchId);

      if (!lastBall) {
        return; // No balls yet
      }

      // Check if this is a new ball we haven't processed
      const ballId = lastBall._id?.toString();
      if (this.lastProcessedBallId === ballId) {
        return; // Already processed
      }

      this.logger.log(`Processing new ball: ${ballId}`);
      this.processedBallsCount++;

      // Analyze the ball event for potential issues
      const analysis = this.analyzeBallEvent(lastBall);

      if (analysis.needsReview) {
        this.alertsGeneratedCount++;
        await this.matchesGateway.emitAlert(this.matchId, {
          type: "ball_review_needed",
          ballId: ballId,
          reason: analysis.reason,
          severity: analysis.severity,
        });
      }

      // Update last processed ball
      this.lastProcessedBallId = ballId;
    } catch (error) {
      this.logger.error("Error processing new balls:", error);
    }
  }

  private async updateOdds(): Promise<void> {
    try {
      // Check if we should update odds based on confidence threshold
      const currentOdds = await this.oddsService.findLatestByMatch(
        this.matchId
      );

      if (
        !currentOdds ||
        !currentOdds.confidence ||
        currentOdds.confidence < this.config.confidenceThreshold
      ) {
        this.logger.log("Updating odds due to low confidence or missing odds");

        const newOdds = await this.oddsService.updateAIOdds(this.matchId);
        this.oddsUpdatesCount++;

        // Emit odds update through WebSocket
        await this.matchesGateway.emitOddsUpdate(this.matchId, newOdds);

        this.logger.log("Odds updated successfully");
      }
    } catch (error) {
      this.logger.error("Error updating odds:", error);
    }
  }

  private async checkForAnomalies(): Promise<void> {
    try {
      // Get current match state
      const matchState = await this.matchesService.getMatchState(this.matchId);

      if (!matchState.score) {
        return; // No score data yet
      }

      const { teamA, teamB } = matchState.score;

      // Check for unusual scoring patterns
      const anomalies = this.detectAnomalies(teamA, teamB, matchState);

      for (const anomaly of anomalies) {
        this.alertsGeneratedCount++;
        await this.matchesGateway.emitAlert(this.matchId, {
          type: "anomaly_detected",
          details: anomaly,
          severity: anomaly.severity,
        });
      }
    } catch (error) {
      this.logger.error("Error checking for anomalies:", error);
    }
  }

  private async handlePostMatch(): Promise<void> {
    try {
      this.logger.log("Handling post-match processing");

      const match = await this.matchesService.findById(this.matchId);

      if (match.status === "completed") {
        // Generate match summary
        const summary = await this.generateMatchSummary();

        // Update leaderboards and standings
        await this.updateLeaderboards();

        // Emit post-match completion
        await this.matchesGateway.emitAlert(this.matchId, {
          type: "post_match_complete",
          message: "Post-match processing completed",
          summary: summary,
          severity: "low",
        });

        this.logger.log("Post-match processing completed");
      }
    } catch (error) {
      this.logger.error("Error in post-match handling:", error);
    }
  }

  private async generateMatchSummary(): Promise<any> {
    try {
      const match = await this.matchesService.findById(this.matchId);
      const matchState = await this.matchesService.getMatchState(this.matchId);
      const balls = await this.ballsService.findAllByMatch(this.matchId);

      const summary = {
        matchId: this.matchId,
        duration: this.matchStartTime
          ? new Date().getTime() - this.matchStartTime.getTime()
          : 0,
        totalBalls: balls.length,
        totalOvers: matchState.score
          ? matchState.score.teamA.overs + matchState.score.teamB.overs
          : 0,
        totalRuns: matchState.score
          ? matchState.score.teamA.runs + matchState.score.teamB.runs
          : 0,
        totalWickets: matchState.score
          ? matchState.score.teamA.wickets + matchState.score.teamB.wickets
          : 0,
        agentStats: this.getStats(),
        validationErrors: this.validationErrors,
      };

      return summary;
    } catch (error) {
      this.logger.error("Error generating match summary:", error);
      return { error: "Failed to generate summary" };
    }
  }

  private async updateLeaderboards(): Promise<void> {
    try {
      // This would integrate with tournament/league services
      // For now, just log the action
      this.logger.log("Updating leaderboards and standings");

      // Emit leaderboard update request
      await this.matchesGateway.emitAlert(this.matchId, {
        type: "leaderboard_update_requested",
        message: "Requesting leaderboard updates",
        severity: "low",
      });
    } catch (error) {
      this.logger.error("Error updating leaderboards:", error);
    }
  }

  private async sendStatusReport(): Promise<void> {
    try {
      const now = new Date();
      const lastReport = this.lastStatusReport;

      // Send status report every hour
      if (lastReport && now.getTime() - lastReport.getTime() < 3600000) {
        return;
      }

      this.lastStatusReport = now;

      const stats = this.getStats();
      const match = await this.matchesService.findById(this.matchId);

      const statusReport = {
        timestamp: now,
        matchId: this.matchId,
        matchStatus: match.status,
        agentStatus: this.isRunning
          ? this.isPaused
            ? "paused"
            : "running"
          : "stopped",
        stats: stats,
        validationErrors: this.validationErrors.length,
        uptime: this.matchStartTime
          ? now.getTime() - this.matchStartTime.getTime()
          : 0,
      };

      // Log status report
      this.logger.log(
        "Hourly Status Report:",
        JSON.stringify(statusReport, null, 2)
      );

      // Emit status report
      await this.matchesGateway.emitAlert(this.matchId, {
        type: "status_report",
        message: "Hourly agent status report",
        report: statusReport,
        severity: "low",
      });
    } catch (error) {
      this.logger.error("Error sending status report:", error);
    }
  }

  private analyzeBallEvent(ball: any): {
    needsReview: boolean;
    reason?: string;
    severity: string;
  } {
    const event = ball.event;

    // Check for unusual events that might need human review
    if (event.type === "wicket") {
      // Check for unusual dismissal types
      if (
        event.wicket.type === "obstructing" ||
        event.wicket.type === "handled_ball"
      ) {
        return {
          needsReview: true,
          reason: "Unusual dismissal type",
          severity: "medium",
        };
      }
    }

    if (event.type === "runs") {
      // Check for unusually high runs in one ball
      if (event.runs > 6) {
        return {
          needsReview: true,
          reason: "Unusually high runs in one ball",
          severity: "high",
        };
      }
    }

    if (event.type === "extra") {
      // Check for unusual extra amounts
      if (event.extras.runs > 5) {
        return {
          needsReview: true,
          reason: "Unusually high extra runs",
          severity: "medium",
        };
      }
    }

    return { needsReview: false, severity: "low" };
  }

  private detectAnomalies(teamA: any, teamB: any, matchState: any): any[] {
    const anomalies = [];

    // Check for unrealistic run rates
    if (teamA.overs > 0) {
      const runRate = teamA.runs / teamA.overs;
      if (runRate > 15) {
        // Very high run rate
        anomalies.push({
          type: "unrealistic_run_rate",
          team: "A",
          runRate: runRate,
          severity: "medium",
        });
      }
    }

    if (teamB.overs > 0) {
      const runRate = teamB.runs / teamB.overs;
      if (runRate > 15) {
        anomalies.push({
          type: "unrealistic_run_rate",
          team: "B",
          runRate: runRate,
          severity: "medium",
        });
      }
    }

    // Check for unusual wicket patterns
    if (teamA.wickets === 0 && teamA.overs > 10) {
      anomalies.push({
        type: "no_wickets_after_10_overs",
        team: "A",
        overs: teamA.overs,
        severity: "low",
      });
    }

    if (teamB.wickets === 0 && teamB.overs > 10) {
      anomalies.push({
        type: "no_wickets_after_10_overs",
        team: "B",
        overs: teamB.overs,
        severity: "low",
      });
    }

    return anomalies;
  }
}
