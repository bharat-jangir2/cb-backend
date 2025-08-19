import { CanActivate, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: any): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      const token = this.extractToken(client);
      
      if (!token) {
        throw new WsException('Authentication token not found');
      }

      const payload = this.jwtService.verify(token);
      client.data.user = payload;
      
      return true;
    } catch (err) {
      throw new WsException('Invalid authentication token');
    }
  }

  private extractToken(client: Socket): string | undefined {
    const auth = client.handshake.auth?.token || client.handshake.headers?.authorization;
    
    if (auth && typeof auth === 'string') {
      if (auth.startsWith('Bearer ')) {
        return auth.substring(7);
      }
      return auth;
    }
    
    return undefined;
  }
} 