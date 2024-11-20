import { Model } from 'mongoose';
import { FxqlDocument, FxqlI } from 'src/interfaces/fxql.interface';

export class FxqlDb {
  constructor(private readonly fxqlModel: Model<FxqlDocument>) {}

  async create(input: FxqlI): Promise<FxqlDocument> {
    const newUser = new this.fxqlModel(input);
    return newUser.save();
  }

  async insertMany(input: FxqlI[]): Promise<FxqlDocument[]> {
    return this.fxqlModel.insertMany(input);
  }

  async findAll(query: unknown): Promise<FxqlDocument[]> {
    return this.fxqlModel.find(query).exec();
  }

  async findById(id: string): Promise<FxqlDocument> {
    return this.fxqlModel.findById(id).exec();
  }

  async updateById(
    query: Partial<FxqlI>,
    updates: Partial<FxqlI>,
  ): Promise<FxqlDocument | null> {
    return this.fxqlModel
      .findOneAndUpdate(query, updates, { new: true })
      .exec();
  }
}
