import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('debug')
export class DebugController {
  @Get('ping')
  ping() {
    return {
      message: 'pong123',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('info')
  getInfo() {
    return {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };
  }

  @Post('echo')
  echo(@Body() body: any, @Req() req: Request) {
    return {
      method: req.method,
      url: req.url,
      body,
      headers: req.headers,
    };
  }
}

