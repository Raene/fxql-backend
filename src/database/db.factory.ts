import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FxqlDb } from './fxql-db.class';
import { FxqlDocument } from '../interfaces/fxql.interface'; // Define an interface for User

@Injectable()
export class DbFactory {
  constructor(
    @InjectModel('Fxql') private readonly fxqlModel: Model<FxqlDocument>, // Inject the UserModel here
  ) {}

  fetchDbClass(collectionName: string) {
    switch (collectionName) {
      case 'fxql':
        return new FxqlDb(this.fxqlModel); // Create and return UserDb class instance
      default:
        throw new Error('Invalid collection name');
    }
  }
}
