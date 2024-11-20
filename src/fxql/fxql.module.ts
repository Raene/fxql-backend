import { Module } from '@nestjs/common';
import { FxqlController } from './fxql.controller';
import { FxqlService } from './fxql.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FxqlController],
  providers: [FxqlService],
})
export class FxqlModule {}
