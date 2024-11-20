import { Module } from '@nestjs/common';
import { FxqlModule } from './fxql/fxql.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FxqlModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
  ],
})
export class AppModule {}
