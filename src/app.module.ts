import { Module } from '@nestjs/common';
import { FxqlModule } from './fxql/fxql.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FxqlModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
})
export class AppModule {}
