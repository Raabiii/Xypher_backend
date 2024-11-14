// src/gateways/template.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

let serverNameTemp = 'template';

@WebSocketGateway({ namespace: serverNameTemp }) // Namespace will be dynamic
export class TemplateGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private serverName: string;
  private serverPort: number;

  constructor(serverName: string, port: number) {
    console.log(`Creating gateway for ${serverName}`);
    serverNameTemp = serverName;
    this.serverName = serverName;
    this.serverPort = port;
  }

  afterInit(server: Server) {
    console.log(`Socket server initialized for ${this.serverName}`);
  }

  handleConnection(client: any) {
    console.log(`Client connected to server ${this.serverName}: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(
      `Client disconnected from server ${this.serverName}: ${client.id}`,
    );
  }
}
