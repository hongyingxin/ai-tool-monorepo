import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from './modules/ai/ai.module';
import { InterviewModule } from './modules/interview/interview.module';
import { DebugModule } from './modules/debug/debug.module';
import { ResumeModule } from './modules/resume/resume.module';
import { ContextMiddleware } from './common/middleware/context.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AiModule,
    InterviewModule,
    DebugModule,
    ResumeModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ContextMiddleware)
      .forRoutes('*');
  }
}
