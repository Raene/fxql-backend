import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function LoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const logger = new Logger('HTTP');
  const { method, originalUrl } = req;
  const startTime = Date.now();

  logger.log(`Incoming request: ${method} ${originalUrl}`);

  res.on('finish', () => {
    const { statusCode } = res;
    const duration = Date.now() - startTime;

    logger.log(
      `Response: ${method} ${originalUrl} ${statusCode} - ${duration}ms`,
    );
  });

  next();
}
