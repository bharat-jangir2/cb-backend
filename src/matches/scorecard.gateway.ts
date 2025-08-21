import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ScorecardService } from "./scorecard.service";

interface ScorecardRoom {
  matchId: string;
  clients: Set<string>;
}

@WebSocketGateway({
  namespace: "/scorecard",
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
export class ScorecardGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private scorecardRooms: Map<string, ScorecardRoom> = new Map();

  constructor(private readonly scorecardService: ScorecardService) {}

  async handleConnection(client: Socket) {
    console.log(`Scorecard client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Scorecard client disconnected: ${client.id}`);

    // Remove client from all rooms
    this.scorecardRooms.forEach((room, matchId) => {
      if (room.clients.has(client.id)) {
        room.clients.delete(client.id);
        if (room.clients.size === 0) {
          this.scorecardRooms.delete(matchId);
        }
      }
    });
  }

  @SubscribeMessage("join-scorecard")
  async handleJoinScorecard(
    @MessageBody() data: { matchId: string },
    @ConnectedSocket() client: Socket
  ) {
    const { matchId } = data;

    // Join the socket room
    await client.join(`scorecard-${matchId}`);

    // Track client in our room management
    if (!this.scorecardRooms.has(matchId)) {
      this.scorecardRooms.set(matchId, {
        matchId,
        clients: new Set(),
      });
    }

    this.scorecardRooms.get(matchId)!.clients.add(client.id);

    console.log(
      `Client ${client.id} joined scorecard room for match ${matchId}`
    );

    // Send initial scorecard data
    try {
      const scorecard = await this.scorecardService.getScorecard(matchId);
      client.emit("scorecard-updated", scorecard);
    } catch (error) {
      console.error(
        `Error sending initial scorecard for match ${matchId}:`,
        error
      );
      client.emit("scorecard-error", { message: "Failed to load scorecard" });
    }
  }

  @SubscribeMessage("leave-scorecard")
  async handleLeaveScorecard(
    @MessageBody() data: { matchId: string },
    @ConnectedSocket() client: Socket
  ) {
    const { matchId } = data;

    // Leave the socket room
    await client.leave(`scorecard-${matchId}`);

    // Remove client from our room management
    const room = this.scorecardRooms.get(matchId);
    if (room) {
      room.clients.delete(client.id);
      if (room.clients.size === 0) {
        this.scorecardRooms.delete(matchId);
      }
    }

    console.log(`Client ${client.id} left scorecard room for match ${matchId}`);
  }

  @SubscribeMessage("get-scorecard")
  async handleGetScorecard(
    @MessageBody() data: { matchId: string },
    @ConnectedSocket() client: Socket
  ) {
    const { matchId } = data;

    try {
      const scorecard = await this.scorecardService.getScorecard(matchId);
      client.emit("scorecard-data", scorecard);
    } catch (error) {
      console.error(`Error getting scorecard for match ${matchId}:`, error);
      client.emit("scorecard-error", { message: "Failed to get scorecard" });
    }
  }

  @SubscribeMessage("get-live-scorecard")
  async handleGetLiveScorecard(
    @MessageBody() data: { matchId: string },
    @ConnectedSocket() client: Socket
  ) {
    const { matchId } = data;

    try {
      const scorecard = await this.scorecardService.getLiveScorecard(matchId);
      client.emit("live-scorecard-data", scorecard);
    } catch (error) {
      console.error(
        `Error getting live scorecard for match ${matchId}:`,
        error
      );
      client.emit("scorecard-error", {
        message: "Failed to get live scorecard",
      });
    }
  }

  /**
   * Broadcast scorecard updates to all clients in a match room
   */
  async broadcastScorecardUpdate(matchId: string, scorecard: any) {
    const room = this.scorecardRooms.get(matchId);
    if (room && room.clients.size > 0) {
      this.server
        .to(`scorecard-${matchId}`)
        .emit("scorecard-updated", scorecard);
      console.log(
        `Broadcasted scorecard update to ${room.clients.size} clients for match ${matchId}`
      );
    }
  }

  /**
   * Broadcast live scorecard updates
   */
  async broadcastLiveScorecardUpdate(matchId: string, scorecard: any) {
    const room = this.scorecardRooms.get(matchId);
    if (room && room.clients.size > 0) {
      this.server
        .to(`scorecard-${matchId}`)
        .emit("live-scorecard-updated", scorecard);
      console.log(
        `Broadcasted live scorecard update to ${room.clients.size} clients for match ${matchId}`
      );
    }
  }

  /**
   * Broadcast specific innings update
   */
  async broadcastInningsUpdate(
    matchId: string,
    inningsNumber: number,
    inningsData: any
  ) {
    const room = this.scorecardRooms.get(matchId);
    if (room && room.clients.size > 0) {
      this.server.to(`scorecard-${matchId}`).emit("innings-updated", {
        matchId,
        inningsNumber,
        data: inningsData,
      });
      console.log(
        `Broadcasted innings ${inningsNumber} update to ${room.clients.size} clients for match ${matchId}`
      );
    }
  }

  /**
   * Broadcast player performance update
   */
  async broadcastPlayerUpdate(
    matchId: string,
    playerId: string,
    playerData: any
  ) {
    const room = this.scorecardRooms.get(matchId);
    if (room && room.clients.size > 0) {
      this.server.to(`scorecard-${matchId}`).emit("player-updated", {
        matchId,
        playerId,
        data: playerData,
      });
      console.log(
        `Broadcasted player ${playerId} update to ${room.clients.size} clients for match ${matchId}`
      );
    }
  }

  /**
   * Get connected clients count for a match
   */
  getConnectedClientsCount(matchId: string): number {
    const room = this.scorecardRooms.get(matchId);
    return room ? room.clients.size : 0;
  }

  /**
   * Get all connected match IDs
   */
  getConnectedMatches(): string[] {
    return Array.from(this.scorecardRooms.keys());
  }
}
