// src/server/server.controller.ts
import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { ServerService } from './server.service';

@Controller('server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Post('create')
  create(@Body() body: { serverName: string }) {
    const { serverName } = body;
    return this.serverService.createServer(serverName);
  }

  @Get('list')
  getList() {
    return this.serverService.getServerList();
  }

  @Delete('stop/:serverName')
  stop(@Param('serverName') serverName: string) {
    return this.serverService.stopServer(serverName);
  }

  @Post('getPort')
  getPort(@Body() body: { serverName: string }) {
    const { serverName } = body;
    return this.serverService.getPort(serverName);
  }
}
