import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Agent, AgentDocument, AgentStatus } from "../schemas/agent.schema";
import { MatchesService } from "../../matches/matches.service";
import { BallsService } from "../../balls/balls.service";
import { OddsService } from "../../odds/odds.service";
import { WebSocketModule } from "../../websocket/websocket.module";
import { MatchesGateway } from "../../websocket/websocket.gateway";
import { MatchAgent } from "./match-agent";

@Injectable()
export class AgentManagerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AgentManagerService.name);
  private readonly matchAgents: Map<string, MatchAgent> = new Map();
  private readonly updateInterval: NodeJS.Timeout;

  constructor(
    @InjectModel(Agent.name) private agentModel: Model<AgentDocument>,
    private matchesService: MatchesService,
    private ballsService: BallsService,
    private oddsService: OddsService,
    private matchesGateway: MatchesGateway
  ) {
    // Set up periodic update interval
    this.updateInterval = setInterval(() => {
      this.updateAllAgents();
    }, 5000); // Update every 5 seconds
  }

  async onModuleInit() {
    this.logger.log("Agent Manager Service initialized");

    // Start agents for all active matches
    await this.initializeAgents();
  }

  async onModuleDestroy() {
    this.logger.log("Agent Manager Service shutting down");

    // Stop all agents
    await this.stopAllAgents();

    // Clear update interval
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  async initializeAgents() {
    try {
      // Get all active agents from database
      const agents = await this.agentModel
        .find({
          status: { $in: [AgentStatus.RUNNING, AgentStatus.PAUSED] },
          isActive: true,
        })
        .exec();

      for (const agent of agents) {
        if (agent.status === AgentStatus.RUNNING) {
          await this.startAgent(agent.matchId.toString());
        }
      }

      this.logger.log(`Initialized ${agents.length} agents`);
    } catch (error) {
      this.logger.error("Failed to initialize agents:", error);
    }
  }

  async startAgent(matchId: string): Promise<Agent> {
    try {
      // Check if agent already exists
      let agent = await this.agentModel
        .findOne({
          matchId: new Types.ObjectId(matchId),
        })
        .exec();

      if (!agent) {
        // Create new agent
        agent = new this.agentModel({
          matchId: new Types.ObjectId(matchId),
          status: AgentStatus.RUNNING,
          startedAt: new Date(),
          lastActivityAt: new Date(),
          config: {
            updateInterval: 5000,
            autoUpdateOdds: true,
            autoReviewBalls: true,
            confidenceThreshold: 0.7,
            enableMatchSetup: true,
            enablePostMatchHandling: true,
            enableDataValidation: true,
            enableAdminAutomation: true,
            retryAttempts: 3,
            retryDelay: 5000,
          },
          stats: {
            ballsProcessed: 0,
            oddsUpdates: 0,
            alertsGenerated: 0,
          },
        });
        await agent.save();
      } else {
        // Update existing agent
        agent.status = AgentStatus.RUNNING;
        agent.startedAt = new Date();
        agent.lastActivityAt = new Date();
        agent.errorMessage = undefined;
        await agent.save();
      }

      // Create and start MatchAgent instance
      const matchAgent = new MatchAgent(
        matchId,
        this.matchesService,
        this.ballsService,
        this.oddsService,
        this.matchesGateway,
        agent.config
      );

      this.matchAgents.set(matchId, matchAgent);
      await matchAgent.start();

      this.logger.log(`Agent started for match ${matchId}`);
      return agent;
    } catch (error) {
      this.logger.error(`Failed to start agent for match ${matchId}:`, error);

      // Update agent status to error
      await this.agentModel
        .findOneAndUpdate(
          { matchId: new Types.ObjectId(matchId) },
          {
            status: AgentStatus.ERROR,
            errorMessage: error.message,
            stoppedAt: new Date(),
          }
        )
        .exec();

      throw error;
    }
  }

  async stopAgent(matchId: string): Promise<Agent> {
    try {
      // Stop MatchAgent instance
      const matchAgent = this.matchAgents.get(matchId);
      if (matchAgent) {
        await matchAgent.stop();
        this.matchAgents.delete(matchId);
      }

      // Update database
      const agent = await this.agentModel
        .findOneAndUpdate(
          { matchId: new Types.ObjectId(matchId) },
          {
            status: AgentStatus.STOPPED,
            stoppedAt: new Date(),
          },
          { new: true }
        )
        .exec();

      if (!agent) {
        throw new Error("Agent not found");
      }

      this.logger.log(`Agent stopped for match ${matchId}`);
      return agent;
    } catch (error) {
      this.logger.error(`Failed to stop agent for match ${matchId}:`, error);
      throw error;
    }
  }

  async pauseAgent(matchId: string): Promise<Agent> {
    try {
      // Pause MatchAgent instance
      const matchAgent = this.matchAgents.get(matchId);
      if (matchAgent) {
        await matchAgent.pause();
      }

      // Update database
      const agent = await this.agentModel
        .findOneAndUpdate(
          { matchId: new Types.ObjectId(matchId) },
          {
            status: AgentStatus.PAUSED,
            pausedAt: new Date(),
          },
          { new: true }
        )
        .exec();

      if (!agent) {
        throw new Error("Agent not found");
      }

      this.logger.log(`Agent paused for match ${matchId}`);
      return agent;
    } catch (error) {
      this.logger.error(`Failed to pause agent for match ${matchId}:`, error);
      throw error;
    }
  }

  async resumeAgent(matchId: string): Promise<Agent> {
    try {
      // Resume MatchAgent instance
      const matchAgent = this.matchAgents.get(matchId);
      if (matchAgent) {
        await matchAgent.resume();
      }

      // Update database
      const agent = await this.agentModel
        .findOneAndUpdate(
          { matchId: new Types.ObjectId(matchId) },
          {
            status: AgentStatus.RUNNING,
            pausedAt: undefined,
            lastActivityAt: new Date(),
          },
          { new: true }
        )
        .exec();

      if (!agent) {
        throw new Error("Agent not found");
      }

      this.logger.log(`Agent resumed for match ${matchId}`);
      return agent;
    } catch (error) {
      this.logger.error(`Failed to resume agent for match ${matchId}:`, error);
      throw error;
    }
  }

  async getAgent(matchId: string): Promise<Agent | null> {
    return this.agentModel
      .findOne({
        matchId: new Types.ObjectId(matchId),
      })
      .exec();
  }

  async getAllAgents(): Promise<Agent[]> {
    return this.agentModel.find({ isActive: true }).exec();
  }

  async updateAgentConfig(matchId: string, config: any): Promise<Agent> {
    const agent = await this.agentModel
      .findOneAndUpdate(
        { matchId: new Types.ObjectId(matchId) },
        { config },
        { new: true }
      )
      .exec();

    if (!agent) {
      throw new Error("Agent not found");
    }

    // Update running agent instance
    const matchAgent = this.matchAgents.get(matchId);
    if (matchAgent) {
      matchAgent.updateConfig(config);
    }

    return agent;
  }

  private async updateAllAgents() {
    for (const [matchId, matchAgent] of this.matchAgents) {
      try {
        await matchAgent["update"]();

        // Update last activity
        await this.agentModel
          .findOneAndUpdate(
            { matchId: new Types.ObjectId(matchId) },
            { lastActivityAt: new Date() }
          )
          .exec();
      } catch (error) {
        this.logger.error(
          `Failed to update agent for match ${matchId}:`,
          error
        );

        // Mark agent as error
        await this.agentModel
          .findOneAndUpdate(
            { matchId: new Types.ObjectId(matchId) },
            {
              status: AgentStatus.ERROR,
              errorMessage: error.message,
            }
          )
          .exec();
      }
    }
  }

  private async stopAllAgents() {
    for (const [matchId, matchAgent] of this.matchAgents) {
      try {
        await matchAgent.stop();
      } catch (error) {
        this.logger.error(`Failed to stop agent for match ${matchId}:`, error);
      }
    }
    this.matchAgents.clear();
  }
}
