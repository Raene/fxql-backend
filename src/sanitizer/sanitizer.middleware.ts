import { NestMiddleware, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mongoSanitize = require('mongo-sanitize');

@Injectable()
export class SanitizeMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    req.body = mongoSanitize(req.body);
    req.query = mongoSanitize(req.query);
    req.params = mongoSanitize(req.params);
    next();
  }
}
