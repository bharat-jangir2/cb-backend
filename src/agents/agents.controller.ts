import { Controller, Get, Post, Param, Body, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { AgentManagerService } from "./services/agent-manager.service";
import { AdminAutomationService } from "./services/admin-automation.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../common/enums/user-role.enum";

@ApiTags("agents")
@Controller("api/matches/:matchId/agent")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AgentsController {
  constructor(
    private readonly agentManagerService: AgentManagerService,
    private readonly adminAutomationService: AdminAutomationService
  ) {}

  @Post("start")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Start AI agent for a match" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Agent started successfully",
  })
  @ApiResponse({ status: 400, description: "Failed to start agent" })
  startAgent(@Param("matchId") matchId: string) {
    return this.agentManagerService.startAgent(matchId);
  }

  @Post("stop")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Stop AI agent for a match" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Agent stopped successfully",
  })
  @ApiResponse({ status: 400, description: "Failed to stop agent" })
  stopAgent(@Param("matchId") matchId: string) {
    return this.agentManagerService.stopAgent(matchId);
  }

  @Post("pause")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Pause AI agent for a match" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Agent paused successfully",
  })
  @ApiResponse({ status: 400, description: "Failed to pause agent" })
  pauseAgent(@Param("matchId") matchId: string) {
    return this.agentManagerService.pauseAgent(matchId);
  }

  @Post("resume")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Resume AI agent for a match" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Agent resumed successfully",
  })
  @ApiResponse({ status: 400, description: "Failed to resume agent" })
  resumeAgent(@Param("matchId") matchId: string) {
    return this.agentManagerService.resumeAgent(matchId);
  }

  @Get("status")
  @ApiOperation({ summary: "Get agent status for a match" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Agent status retrieved successfully",
  })
  getAgentStatus(@Param("matchId") matchId: string) {
    return this.agentManagerService.getAgent(matchId);
  }

  @Post("command")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Execute natural language admin command" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Command executed successfully",
  })
  @ApiResponse({ status: 400, description: "Failed to execute command" })
  executeCommand(
    @Param("matchId") matchId: string,
    @Body() body: { command: string; userId?: string }
  ) {
    return this.adminAutomationService.processCommand(
      body.command,
      matchId,
      body.userId
    );
  }

  @Post("automate")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Execute automated match management" })
  @ApiParam({ name: "matchId", description: "Match ID" })
  @ApiResponse({
    status: 200,
    description: "Automation executed successfully",
  })
  @ApiResponse({ status: 400, description: "Failed to execute automation" })
  async executeAutomation(@Param("matchId") matchId: string) {
    // Execute a series of automated commands
    const commands = ["start agent", "get status", "update odds"];

    const results = [];
    for (const command of commands) {
      const result = await this.adminAutomationService.processCommand(
        command,
        matchId
      );
      results.push({ command, result });
    }

    return {
      success: true,
      message: "Automation sequence completed",
      results,
    };
  }
}

@ApiTags("agents")
@Controller("api/agents")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class GlobalAgentsController {
  constructor(
    private readonly agentManagerService: AgentManagerService,
    private readonly adminAutomationService: AdminAutomationService
  ) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Get all agents" })
  @ApiResponse({
    status: 200,
    description: "All agents retrieved successfully",
  })
  getAllAgents() {
    return this.agentManagerService.getAllAgents();
  }

  @Post("command")
  @Roles(UserRole.ADMIN, UserRole.SCORER)
  @ApiOperation({ summary: "Execute global admin command" })
  @ApiResponse({
    status: 200,
    description: "Command executed successfully",
  })
  @ApiResponse({ status: 400, description: "Failed to execute command" })
  executeGlobalCommand(@Body() body: { command: string; userId?: string }) {
    return this.adminAutomationService.processCommand(
      body.command,
      undefined,
      body.userId
    );
  }

  @Post("automate-all")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Execute automation for all active matches" })
  @ApiResponse({
    status: 200,
    description: "Global automation executed successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Failed to execute global automation",
  })
  async executeGlobalAutomation() {
    const agents = await this.agentManagerService.getAllAgents();
    const activeAgents = agents.filter((agent) => agent.status === "running");

    const results = [];
    for (const agent of activeAgents) {
      const matchId = agent.matchId.toString();
      const result = await this.adminAutomationService.processCommand(
        "get status",
        matchId
      );
      results.push({ matchId, result });
    }

    return {
      success: true,
      message: `Global automation completed for ${activeAgents.length} active matches`,
      results,
    };
  }
}
