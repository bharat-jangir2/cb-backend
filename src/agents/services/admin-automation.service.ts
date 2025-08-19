import { Injectable, Logger } from "@nestjs/common";
import { MatchesService } from "../../matches/matches.service";
import { BallsService } from "../../balls/balls.service";
import { OddsService } from "../../odds/odds.service";
import { MatchesGateway } from "../../websocket/websocket.gateway";
import { AgentManagerService } from "./agent-manager.service";
import { MatchStatus } from "../../common/enums/match-status.enum";

export interface AdminCommand {
  type: string;
  matchId?: string;
  parameters: any;
  timestamp: Date;
  userId?: string;
}

export interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

@Injectable()
export class AdminAutomationService {
  private readonly logger = new Logger(AdminAutomationService.name);

  constructor(
    private matchesService: MatchesService,
    private ballsService: BallsService,
    private oddsService: OddsService,
    private matchesGateway: MatchesGateway,
    private agentManagerService: AgentManagerService
  ) {}

  async processCommand(
    command: string,
    matchId?: string,
    userId?: string
  ): Promise<CommandResult> {
    try {
      this.logger.log(`Processing admin command: ${command}`);

      const parsedCommand = this.parseNaturalLanguage(command);
      const adminCommand: AdminCommand = {
        type: parsedCommand.type,
        matchId: matchId,
        parameters: parsedCommand.parameters,
        timestamp: new Date(),
        userId: userId,
      };

      return await this.executeCommand(adminCommand);
    } catch (error) {
      this.logger.error("Error processing admin command:", error);
      return {
        success: false,
        message: "Failed to process command",
        error: error.message,
      };
    }
  }

  private parseNaturalLanguage(command: string): {
    type: string;
    parameters: any;
  } {
    const lowerCommand = command.toLowerCase().trim();

    // Match status commands
    if (
      lowerCommand.includes("start match") ||
      lowerCommand.includes("begin match")
    ) {
      return { type: "start_match", parameters: {} };
    }

    if (
      lowerCommand.includes("pause match") ||
      lowerCommand.includes("stop match")
    ) {
      return { type: "pause_match", parameters: {} };
    }

    if (
      lowerCommand.includes("resume match") ||
      lowerCommand.includes("continue match")
    ) {
      return { type: "resume_match", parameters: {} };
    }

    if (
      lowerCommand.includes("end match") ||
      lowerCommand.includes("finish match")
    ) {
      return { type: "end_match", parameters: {} };
    }

    // Ball event commands
    if (
      lowerCommand.includes("add ball") ||
      lowerCommand.includes("record ball")
    ) {
      const runs = this.extractNumber(lowerCommand, "runs");
      const wickets = this.extractNumber(lowerCommand, "wicket");
      const extras = this.extractNumber(lowerCommand, "extra");

      return {
        type: "add_ball",
        parameters: {
          runs: runs || 0,
          wickets: wickets || 0,
          extras: extras || 0,
          description: this.extractDescription(command),
        },
      };
    }

    if (
      lowerCommand.includes("undo ball") ||
      lowerCommand.includes("remove ball")
    ) {
      return { type: "undo_ball", parameters: {} };
    }

    // Agent commands
    if (
      lowerCommand.includes("start agent") ||
      lowerCommand.includes("enable agent")
    ) {
      return { type: "start_agent", parameters: {} };
    }

    if (
      lowerCommand.includes("stop agent") ||
      lowerCommand.includes("disable agent")
    ) {
      return { type: "stop_agent", parameters: {} };
    }

    if (lowerCommand.includes("pause agent")) {
      return { type: "pause_agent", parameters: {} };
    }

    if (lowerCommand.includes("resume agent")) {
      return { type: "resume_agent", parameters: {} };
    }

    // Odds commands
    if (
      lowerCommand.includes("update odds") ||
      lowerCommand.includes("calculate odds")
    ) {
      return { type: "update_odds", parameters: {} };
    }

    // Status commands
    if (lowerCommand.includes("status") || lowerCommand.includes("state")) {
      return { type: "get_status", parameters: {} };
    }

    if (lowerCommand.includes("score") || lowerCommand.includes("scorecard")) {
      return { type: "get_score", parameters: {} };
    }

    // Commentary commands
    if (
      lowerCommand.includes("add commentary") ||
      lowerCommand.includes("comment")
    ) {
      return {
        type: "add_commentary",
        parameters: {
          commentary: this.extractDescription(command),
        },
      };
    }

    // Toss commands
    if (lowerCommand.includes("toss") || lowerCommand.includes("coin toss")) {
      const winner = this.extractTeam(lowerCommand);
      const decision = this.extractDecision(lowerCommand);

      return {
        type: "update_toss",
        parameters: {
          winner: winner,
          decision: decision,
        },
      };
    }

    // Squad commands
    if (
      lowerCommand.includes("playing xi") ||
      lowerCommand.includes("playing 11")
    ) {
      return { type: "get_playing_xi", parameters: {} };
    }

    // Default to help
    return { type: "help", parameters: {} };
  }

  private async executeCommand(command: AdminCommand): Promise<CommandResult> {
    const { type, matchId, parameters } = command;

    if (!matchId && type !== "help") {
      return {
        success: false,
        message: "Match ID is required for this command",
        error: "Missing match ID",
      };
    }

    switch (type) {
      case "start_match":
        return await this.startMatch(matchId!);

      case "pause_match":
        return await this.pauseMatch(matchId!);

      case "resume_match":
        return await this.resumeMatch(matchId!);

      case "end_match":
        return await this.endMatch(matchId!);

      case "add_ball":
        return await this.addBall(matchId!, parameters);

      case "undo_ball":
        return await this.undoBall(matchId!);

      case "start_agent":
        return await this.startAgent(matchId!);

      case "stop_agent":
        return await this.stopAgent(matchId!);

      case "pause_agent":
        return await this.pauseAgent(matchId!);

      case "resume_agent":
        return await this.resumeAgent(matchId!);

      case "update_odds":
        return await this.updateOdds(matchId!);

      case "get_status":
        return await this.getStatus(matchId!);

      case "get_score":
        return await this.getScore(matchId!);

      case "add_commentary":
        return await this.addCommentary(matchId!, parameters);

      case "update_toss":
        return await this.updateToss(matchId!, parameters);

      case "get_playing_xi":
        return await this.getPlayingXI(matchId!);

      case "help":
        return this.getHelp();

      default:
        return {
          success: false,
          message: "Unknown command type",
          error: `Unknown command type: ${type}`,
        };
    }
  }

  private async startMatch(matchId: string): Promise<CommandResult> {
    try {
      await this.matchesService.updateStatus(matchId, {
        status: MatchStatus.IN_PROGRESS,
      });

      // Start agent if not already running
      const agent = await this.agentManagerService.getAgent(matchId);
      if (!agent || agent.status !== "running") {
        await this.agentManagerService.startAgent(matchId);
      }

      return {
        success: true,
        message: "Match started successfully",
        data: { status: MatchStatus.IN_PROGRESS },
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to start match",
        error: error.message,
      };
    }
  }

  private async pauseMatch(matchId: string): Promise<CommandResult> {
    try {
      await this.matchesService.updateStatus(matchId, {
        status: MatchStatus.PAUSED,
      });

      return {
        success: true,
        message: "Match paused successfully",
        data: { status: MatchStatus.PAUSED },
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to pause match",
        error: error.message,
      };
    }
  }

  private async resumeMatch(matchId: string): Promise<CommandResult> {
    try {
      await this.matchesService.updateStatus(matchId, {
        status: MatchStatus.IN_PROGRESS,
      });

      return {
        success: true,
        message: "Match resumed successfully",
        data: { status: MatchStatus.IN_PROGRESS },
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to resume match",
        error: error.message,
      };
    }
  }

  private async endMatch(matchId: string): Promise<CommandResult> {
    try {
      await this.matchesService.updateStatus(matchId, {
        status: MatchStatus.COMPLETED,
      });

      // Stop agent
      await this.agentManagerService.stopAgent(matchId);

      return {
        success: true,
        message: "Match ended successfully",
        data: { status: MatchStatus.COMPLETED },
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to end match",
        error: error.message,
      };
    }
  }

  private async addBall(
    matchId: string,
    parameters: any
  ): Promise<CommandResult> {
    try {
      const match = await this.matchesService.findById(matchId);
      const matchState = await this.matchesService.getMatchState(matchId);

      const ballData = {
        innings: matchState.currentInnings || 1,
        over: matchState.currentOver || 0,
        ball: (matchState.currentBall || 0) + 1,
        eventType: (parameters.wickets > 0 ? "wicket" : "runs") as
          | "runs"
          | "wicket"
          | "extra"
          | "over_change"
          | "innings_change",
        runs: parameters.runs || 0,
        extras:
          parameters.extras > 0
            ? { type: "wide" as const, runs: parameters.extras }
            : undefined,
        wicket:
          parameters.wickets > 0
            ? { type: "bowled" as const, batsman: "temp" }
            : undefined,
        description:
          parameters.description || "Ball recorded via admin command",
      };

      const ball = await this.ballsService.create(matchId, ballData);

      return {
        success: true,
        message: "Ball added successfully",
        data: ball,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to add ball",
        error: error.message,
      };
    }
  }

  private async undoBall(matchId: string): Promise<CommandResult> {
    try {
      const ball = await this.ballsService.undoLastBall(matchId);

      return {
        success: true,
        message: "Last ball undone successfully",
        data: ball,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to undo ball",
        error: error.message,
      };
    }
  }

  private async startAgent(matchId: string): Promise<CommandResult> {
    try {
      const agent = await this.agentManagerService.startAgent(matchId);

      return {
        success: true,
        message: "Agent started successfully",
        data: agent,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to start agent",
        error: error.message,
      };
    }
  }

  private async stopAgent(matchId: string): Promise<CommandResult> {
    try {
      const agent = await this.agentManagerService.stopAgent(matchId);

      return {
        success: true,
        message: "Agent stopped successfully",
        data: agent,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to stop agent",
        error: error.message,
      };
    }
  }

  private async pauseAgent(matchId: string): Promise<CommandResult> {
    try {
      const agent = await this.agentManagerService.pauseAgent(matchId);

      return {
        success: true,
        message: "Agent paused successfully",
        data: agent,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to pause agent",
        error: error.message,
      };
    }
  }

  private async resumeAgent(matchId: string): Promise<CommandResult> {
    try {
      const agent = await this.agentManagerService.resumeAgent(matchId);

      return {
        success: true,
        message: "Agent resumed successfully",
        data: agent,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to resume agent",
        error: error.message,
      };
    }
  }

  private async updateOdds(matchId: string): Promise<CommandResult> {
    try {
      const odds = await this.oddsService.updateAIOdds(matchId);

      return {
        success: true,
        message: "Odds updated successfully",
        data: odds,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to update odds",
        error: error.message,
      };
    }
  }

  private async getStatus(matchId: string): Promise<CommandResult> {
    try {
      const match = await this.matchesService.findById(matchId);
      const matchState = await this.matchesService.getMatchState(matchId);
      const agent = await this.agentManagerService.getAgent(matchId);

      return {
        success: true,
        message: "Status retrieved successfully",
        data: {
          match: match,
          state: matchState,
          agent: agent,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to get status",
        error: error.message,
      };
    }
  }

  private async getScore(matchId: string): Promise<CommandResult> {
    try {
      const matchState = await this.matchesService.getMatchState(matchId);

      return {
        success: true,
        message: "Score retrieved successfully",
        data: matchState,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to get score",
        error: error.message,
      };
    }
  }

  private async addCommentary(
    matchId: string,
    parameters: any
  ): Promise<CommandResult> {
    try {
      const match = await this.matchesService.findById(matchId);
      const matchState = await this.matchesService.getMatchState(matchId);

      const commentaryData = {
        over: matchState.currentOver || 0,
        ball: matchState.currentBall || 0,
        innings: matchState.currentInnings || 1,
        commentary: parameters.commentary,
        type: "general",
      };

      await this.matchesService.addCommentary(matchId, commentaryData);

      return {
        success: true,
        message: "Commentary added successfully",
        data: commentaryData,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to add commentary",
        error: error.message,
      };
    }
  }

  private async updateToss(
    matchId: string,
    parameters: any
  ): Promise<CommandResult> {
    try {
      const tossData = {
        winner: parameters.winner,
        decision: parameters.decision,
      };

      await this.matchesService.updateToss(matchId, tossData);

      return {
        success: true,
        message: "Toss updated successfully",
        data: tossData,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to update toss",
        error: error.message,
      };
    }
  }

  private async getPlayingXI(matchId: string): Promise<CommandResult> {
    try {
      const playingXI = await this.matchesService.getPlayingXI(matchId);

      return {
        success: true,
        message: "Playing XI retrieved successfully",
        data: playingXI,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to get playing XI",
        error: error.message,
      };
    }
  }

  private getHelp(): CommandResult {
    const helpText = `
Available Commands:

Match Control:
- "start match" - Start the match
- "pause match" - Pause the match
- "resume match" - Resume the match
- "end match" - End the match

Ball Events:
- "add ball with 4 runs" - Add a ball with 4 runs
- "add ball with wicket" - Add a wicket
- "add ball with 2 extras" - Add extras
- "undo ball" - Undo the last ball

Agent Control:
- "start agent" - Start the AI agent
- "stop agent" - Stop the AI agent
- "pause agent" - Pause the agent
- "resume agent" - Resume the agent

Odds & Status:
- "update odds" - Update betting odds
- "get status" - Get match status
- "get score" - Get current score

Commentary:
- "add commentary: Great shot!" - Add commentary

Toss:
- "toss won by team A batting" - Update toss result

Squad:
- "get playing xi" - Get playing XI
    `;

    return {
      success: true,
      message: "Help information",
      data: { help: helpText.trim() },
    };
  }

  private extractNumber(command: string, keyword: string): number | null {
    const regex = new RegExp(`${keyword}\\s*(\\d+)`, "i");
    const match = command.match(regex);
    return match ? parseInt(match[1]) : null;
  }

  private extractDescription(command: string): string {
    const colonIndex = command.indexOf(":");
    if (colonIndex !== -1) {
      return command.substring(colonIndex + 1).trim();
    }
    return "";
  }

  private extractTeam(command: string): string | null {
    if (command.includes("team a") || command.includes("team1")) return "teamA";
    if (command.includes("team b") || command.includes("team2")) return "teamB";
    return null;
  }

  private extractDecision(command: string): string | null {
    if (command.includes("bat") || command.includes("batting")) return "bat";
    if (command.includes("bowl") || command.includes("bowling")) return "bowl";
    return null;
  }
}
