// src/server/server.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { Server } from 'socket.io';
import { FirebaseService } from '../firebase/firebase.service';

interface Player {
  username: string;
  inventory: number[];
  x: number;
  y: number;
}

interface ServerInterface {
  serverName: string;
  port: number;
  server: Server;
  players: Player[];
}

@Injectable()
export class ServerService {
  private servers: Map<string, ServerInterface> = new Map();
  private usedPorts: Set<number> = new Set();
  private readonly basePort = 3001;
  private readonly maxServers = 10;

  createServer(serverName: string): string {
    if (this.servers.size >= this.maxServers) {
      throw new BadRequestException('Cannot create more than 10 servers');
    }
    if (this.servers.has(serverName)) {
      return `Server ${serverName} already exists`;
    }

    // Find the next available port
    const port = this.getNextAvailablePort();
    if (!port) {
      throw new BadRequestException('No available ports');
    }

    const server = new Server(port, {
      cors: {
        origin: '*',
      },
    });

    this.servers.set(serverName, { serverName, port, server, players: [] });
    this.usedPorts.add(port);

    console.log(`Server ${serverName} created on port ${port}`);

    server.on('connection', (socket) => {
      console.log(`Client connected to ${serverName}`);

      /*this.servers.get(serverName).players.push({
        username: '',
        inventory: [],
        x: 0,
        y: 0,
      });*/

      socket.on('username', async (playerData: Player) => {
        this.servers.get(serverName).players.push({
          username: playerData.username,
          inventory: playerData.inventory,
          x: playerData.x,
          y: playerData.y,
        });
        console.log(socket.id);
        const playerString = JSON.stringify(playerData);
        console.log(playerString);
        console.log(server.emit('own', playerString));
        socket.broadcast.emit('newPlayer', playerData);
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected from ${serverName}`);
      });
    });

    return `Server ${serverName} created on port ${port}`;
  }

  private getNextAvailablePort(): number | null {
    for (
      let port = this.basePort;
      port < this.basePort + this.maxServers;
      port++
    ) {
      if (!this.usedPorts.has(port)) {
        return port;
      }
    }
    return null; // No available ports
  }

  getServerList(): string[] {
    return Array.from(this.servers.keys());
  }

  stopServer(serverName: string): string {
    if (!this.servers.has(serverName)) {
      throw new BadRequestException('Server not found');
    }

    const server = this.servers.get(serverName);
    const port = server.port;

    server.server.close(() => {
      console.log(`Server ${serverName} stopped`);
    });

    this.servers.delete(serverName);
    if (port) this.usedPorts.delete(port);

    return `Server ${serverName} on port ${port} stopped`;
  }

  getPort(serverName: string): number {
    if (!this.servers.has(serverName)) {
      throw new BadRequestException('Server not found');
    }

    return this.servers.get(serverName).port;
  }
}
