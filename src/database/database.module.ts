import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DbFactory } from './db.factory';
import { FxqlSchema } from './fxql.schema'; // Import the UserSchema

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Fxql', schema: FxqlSchema }, // Register User model
    ]),
  ],
  providers: [DbFactory],
  exports: [DbFactory], // Export DbFactory to make it available in other modules
})
export class DatabaseModule {}
