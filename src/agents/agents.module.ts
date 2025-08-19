import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AgentManagerService } from "./services/agent-manager.service";
import { AdminAutomationService } from "./services/admin-automation.service";
import { AgentLoggingService } from "./services/agent-logging.service";
import { AgentsController, GlobalAgentsController } from "./agents.controller";
import { Agent, AgentSchema } from "./schemas/agent.schema";
import { MatchesModule } from "../matches/matches.module";
import { BallsModule } from "../balls/balls.module";
import { OddsModule } from "../odds/odds.module";
import { WebSocketModule } from "../websocket/websocket.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Agent.name, schema: AgentSchema }]),
    MatchesModule,
    BallsModule,
    OddsModule,
    WebSocketModule,
  ],
  controllers: [AgentsController, GlobalAgentsController],
  providers: [AgentManagerService, AdminAutomationService, AgentLoggingService],
  exports: [AgentManagerService, AdminAutomationService, AgentLoggingService],
})
export class AgentsModule {}
