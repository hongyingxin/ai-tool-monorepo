import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { requestContext } from '../context/request-context';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const apiKey = req.headers['x-gemini-api-key'] as string;
    const modelId = req.headers['x-gemini-model-id'] as string;
    
    requestContext.run({ apiKey, modelId }, () => {
      next();
    });
  }
}

