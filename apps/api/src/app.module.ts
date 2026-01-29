import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, GeminiController],
  providers: [AppService, GeminiService],
})
export class AppModule {}
