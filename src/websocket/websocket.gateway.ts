import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UseGuards } from "@nestjs/common";
import { WsJwtGuard } from "./guards/ws-jwt.guard";
import { MatchesService } from "../matches/matches.service";
import { BallsService } from "../balls/balls.service";
import { OddsService } from "../odds/odds.service";
import { StrikeRotationDto } from "../matches/dto/strike-rotation.dto";
import { CommentaryDto } from "../matches/dto/commentary.dto";
import { NotificationDto } from "../matches/dto/toss.dto";

interface MatchRoom {
  matchId: string;
  clients: Set<string>;
}

@WebSocketGateway({
  namespace: "/matches",
  cors: {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
    ],
    credentials: true,
  },
})
export class MatchesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private matchRooms: Map<string, MatchRoom> = new Map();

  constructor(
    private matchesService: MatchesService,
    private ballsService: BallsService,
    private oddsService: OddsService
  ) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);

    // Remove client from all match rooms
    this.matchRooms.forEach((room, matchId) => {
      if (room.clients.has(client.id)) {
        room.clients.delete(client.id);
        if (room.clients.size === 0) {
          this.matchRooms.delete(matchId);
        }
      }
    });
  }

  @SubscribeMessage("join_match")
  async handleJoinMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string }
  ) {
    const { matchId } = data;

    // Join the match room
    await client.join(`match_${matchId}`);

    // Add client to match room tracking
    if (!this.matchRooms.has(matchId)) {
      this.matchRooms.set(matchId, { matchId, clients: new Set() });
    }
    this.matchRooms.get(matchId)!.clients.add(client.id);

    // Send current match state
    try {
      const matchState = await this.matchesService.getMatchState(matchId);
      const latestOdds = await this.oddsService.findLatestByMatch(matchId);

      client.emit("score.state", {
        matchId,
        state: matchState,
        odds: latestOdds,
      });

      console.log(`Client ${client.id} joined match ${matchId}`);
    } catch (error) {
      client.emit("error", { message: "Failed to get match state" });
    }
  }

  @SubscribeMessage("leave_match")
  handleLeaveMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string }
  ) {
    const { matchId } = data;

    // Leave the match room
    client.leave(`match_${matchId}`);

    // Remove client from match room tracking
    const room = this.matchRooms.get(matchId);
    if (room) {
      room.clients.delete(client.id);
      if (room.clients.size === 0) {
        this.matchRooms.delete(matchId);
      }
    }

    console.log(`Client ${client.id} left match ${matchId}`);
  }

  @SubscribeMessage("ball.apply")
  async handleBallApply(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string; ballData: any }
  ) {
    const { matchId, ballData } = data;

    try {
      // Apply the ball event
      const ball = await this.ballsService.create(matchId, ballData);

      // Get updated match state
      const matchState = await this.matchesService.getMatchState(matchId);

      // Broadcast to all clients in the match room
      this.server.to(`match_${matchId}`).emit("ball.applied", {
        matchId,
        ball,
        state: matchState,
      });

      // Update odds if AI agent is enabled
      try {
        const aiOdds = await this.oddsService.updateAIOdds(matchId);
        this.server.to(`match_${matchId}`).emit("odds.update", {
          matchId,
          odds: aiOdds,
        });
      } catch (error) {
        console.error("Failed to update AI odds:", error);
      }

      console.log(`Ball applied to match ${matchId}: ${ballData.eventType}`);
    } catch (error) {
      client.emit("error", { message: "Failed to apply ball event" });
    }
  }

  @SubscribeMessage("ball.undo")
  async handleBallUndo(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string }
  ) {
    const { matchId } = data;

    try {
      // Undo the last ball
      const undoneBall = await this.ballsService.undoLastBall(matchId);

      // Get updated match state
      const matchState = await this.matchesService.getMatchState(matchId);

      // Broadcast to all clients in the match room
      this.server.to(`match_${matchId}`).emit("ball.undone", {
        matchId,
        ball: undoneBall,
        state: matchState,
      });

      // Update odds if AI agent is enabled
      try {
        const aiOdds = await this.oddsService.updateAIOdds(matchId);
        this.server.to(`match_${matchId}`).emit("odds.update", {
          matchId,
          odds: aiOdds,
        });
      } catch (error) {
        console.error("Failed to update AI odds:", error);
      }

      console.log(`Ball undone in match ${matchId}`);
    } catch (error) {
      client.emit("error", { message: "Failed to undo ball event" });
    }
  }

  @SubscribeMessage("player.update")
  async handlePlayerUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string; playerId: string; updates: any }
  ) {
    const { matchId, playerId, updates } = data;

    try {
      // Update player stats (this would typically go through a service)
      // For now, we'll just broadcast the update

      this.server.to(`match_${matchId}`).emit("player.updated", {
        matchId,
        playerId,
        updates,
      });

      console.log(`Player ${playerId} updated in match ${matchId}`);
    } catch (error) {
      client.emit("error", { message: "Failed to update player" });
    }
  }

  // Method to emit score updates from external services
  async emitScoreUpdate(matchId: string, scoreData: any) {
    this.server.to(`match_${matchId}`).emit("score.diff", {
      matchId,
      score: scoreData,
      timestamp: new Date(),
    });
  }

  // Method to emit odds updates from external services
  async emitOddsUpdate(matchId: string, oddsData: any) {
    this.server.to(`match_${matchId}`).emit("odds.update", {
      matchId,
      odds: oddsData,
      timestamp: new Date(),
    });
  }

  // Method to emit alerts
  async emitAlert(matchId: string, alertData: any) {
    this.server.to(`match_${matchId}`).emit("alert.reviewNeeded", {
      matchId,
      alert: alertData,
      timestamp: new Date(),
    });
  }

  // New WebSocket event handlers for enhanced functionality
  @SubscribeMessage("strike.rotation.update")
  async handleStrikeRotationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string; strikeRotation: StrikeRotationDto }
  ) {
    try {
      const updatedMatch = await this.matchesService.updateStrikeRotation(
        data.matchId,
        data.strikeRotation
      );

      // Emit strike rotation update to all clients
      this.server.to(`match_${data.matchId}`).emit("strike.rotation.updated", {
        matchId: data.matchId,
        strikeRotation: updatedMatch.currentPlayers,
        timestamp: new Date(),
      });

      // Update WebSocket stats
      await this.updateWebSocketStats(data.matchId);
    } catch (error) {
      client.emit("error", { message: "Failed to update strike rotation" });
    }
  }

  @SubscribeMessage("commentary.add")
  async handleCommentaryAdd(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string; commentary: CommentaryDto }
  ) {
    try {
      const updatedMatch = await this.matchesService.addCommentary(
        data.matchId,
        data.commentary
      );

      // Emit commentary update to all clients
      this.server.to(`match_${data.matchId}`).emit("commentary.added", {
        matchId: data.matchId,
        commentary: data.commentary,
        timestamp: new Date(),
      });

      // Update WebSocket stats
      await this.updateWebSocketStats(data.matchId);
    } catch (error) {
      client.emit("error", { message: "Failed to add commentary" });
    }
  }

  @SubscribeMessage("toss.update")
  async handleTossUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string; tossInfo: any }
  ) {
    try {
      const updatedMatch = await this.matchesService.updateToss(
        data.matchId,
        data.tossInfo
      );

      // Get toss info from the updated match
      const tossInfo = {
        completed: !!updatedMatch.tossWinner,
        winner: updatedMatch.tossWinner,
        decision: updatedMatch.tossDecision,
        timestamp: new Date(),
        notified: false,
      };

      // Emit toss update to all clients
      this.server.to(`match_${data.matchId}`).emit("toss.updated", {
        matchId: data.matchId,
        tossInfo: tossInfo,
        timestamp: new Date(),
      });

      // Add notification
      await this.matchesService.addEvent(data.matchId, {
        eventType: "notification",
        event: "Toss Completed",
        description: `Toss completed: ${
          tossInfo.winner ? "Team" : "Unknown"
        } chose to ${tossInfo.decision}`,
        category: "match_control",
        isNotification: true,
        notificationType: "in_app",
        notificationTitle: "Toss Completed",
        notificationMessage: `Toss completed: ${
          tossInfo.winner ? "Team" : "Unknown"
        } chose to ${tossInfo.decision}`,
      });

      // Update WebSocket stats
      await this.updateWebSocketStats(data.matchId);
    } catch (error) {
      client.emit("error", { message: "Failed to update toss information" });
    }
  }

  @SubscribeMessage("squad.update")
  async handleSquadUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string; squad: any }
  ) {
    try {
      const updatedMatch = await this.matchesService.updateSquad(
        data.matchId,
        data.squad
      );

      // Emit squad update to all clients
      this.server.to(`match_${data.matchId}`).emit("squad.updated", {
        matchId: data.matchId,
        squad: updatedMatch.squads,
        timestamp: new Date(),
      });

      // Update WebSocket stats
      await this.updateWebSocketStats(data.matchId);
    } catch (error) {
      client.emit("error", { message: "Failed to update squad" });
    }
  }

  @SubscribeMessage("playing.xi.update")
  async handlePlayingXIUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string; playingXI: any }
  ) {
    try {
      const updatedMatch = await this.matchesService.updatePlayingXI(
        data.matchId,
        data.playingXI
      );

      // Emit playing XI update to all clients
      this.server.to(`match_${data.matchId}`).emit("playing.xi.updated", {
        matchId: data.matchId,
        playingXI: updatedMatch.playingXI,
        timestamp: new Date(),
      });

      // Add notification
      await this.matchesService.addNotification(data.matchId, {
        type: "playing_xi",
        message: "Playing XI has been updated",
      });

      // Update WebSocket stats
      await this.updateWebSocketStats(data.matchId);
    } catch (error) {
      client.emit("error", { message: "Failed to update playing XI" });
    }
  }

  @SubscribeMessage("notification.add")
  async handleNotificationAdd(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string; notification: NotificationDto }
  ) {
    try {
      const updatedMatch = await this.matchesService.addNotification(
        data.matchId,
        data.notification
      );

      // Emit notification to all clients
      this.server.to(`match_${data.matchId}`).emit("notification.added", {
        matchId: data.matchId,
        notification: data.notification,
        timestamp: new Date(),
      });

      // Update WebSocket stats
      await this.updateWebSocketStats(data.matchId);
    } catch (error) {
      client.emit("error", { message: "Failed to add notification" });
    }
  }

  @SubscribeMessage("websocket.stats.get")
  async handleGetWebSocketStats(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string }
  ) {
    try {
      const stats = await this.matchesService.getWebSocketStats(data.matchId);
      client.emit("websocket.stats", {
        matchId: data.matchId,
        stats,
        timestamp: new Date(),
      });
    } catch (error) {
      client.emit("error", { message: "Failed to get WebSocket stats" });
    }
  }

  // Helper method to update WebSocket stats
  private async updateWebSocketStats(matchId: string) {
    const room = this.matchRooms.get(matchId);
    if (room) {
      await this.matchesService.updateWebSocketStats(matchId, {
        totalConnections: room.clients.size,
        activeConnections: room.clients.size,
      });
    }
  }

  // New emit methods for enhanced functionality
  async emitStrikeRotationUpdate(matchId: string, strikeRotationData: any) {
    this.server.to(`match_${matchId}`).emit("strike.rotation.updated", {
      matchId,
      strikeRotation: strikeRotationData,
      timestamp: new Date(),
    });
  }

  async emitCommentaryUpdate(matchId: string, commentaryData: any) {
    this.server.to(`match_${matchId}`).emit("commentary.added", {
      matchId,
      commentary: commentaryData,
      timestamp: new Date(),
    });
  }

  async emitTossUpdate(matchId: string, tossData: any) {
    this.server.to(`match_${matchId}`).emit("toss.updated", {
      matchId,
      tossInfo: tossData,
      timestamp: new Date(),
    });
  }

  async emitSquadUpdate(matchId: string, squadData: any) {
    this.server.to(`match_${matchId}`).emit("squad.updated", {
      matchId,
      squad: squadData,
      timestamp: new Date(),
    });
  }

  async emitPlayingXIUpdate(matchId: string, playingXIData: any) {
    this.server.to(`match_${matchId}`).emit("playing.xi.updated", {
      matchId,
      playingXI: playingXIData,
      timestamp: new Date(),
    });
  }

  async emitNotification(matchId: string, notificationData: any) {
    this.server.to(`match_${matchId}`).emit("notification.added", {
      matchId,
      notification: notificationData,
      timestamp: new Date(),
    });
  }
}
