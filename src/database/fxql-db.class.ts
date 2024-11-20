import { Model } from 'mongoose';
import { FxqlDocumentDto, FxqlDto } from 'src/interfaces/fxql.interface';

export class FxqlDb {
  constructor(private readonly fxqlModel: Model<FxqlDocumentDto>) {}

  async create(input: FxqlDto): Promise<FxqlDocumentDto> {
    const newUser = new this.fxqlModel(input);
    return newUser.save();
  }

  async insertMany(input: FxqlDto[]): Promise<FxqlDocumentDto[]> {
    return this.fxqlModel.insertMany(input);
  }

  async findAll(query: unknown): Promise<FxqlDocumentDto[]> {
    return this.fxqlModel.find(query).exec();
  }

  async findById(id: string): Promise<FxqlDocumentDto> {
    return this.fxqlModel.findById(id).exec();
  }

  async updateById(
    query: Partial<FxqlDto>,
    updates: Partial<FxqlDto>,
  ): Promise<FxqlDocumentDto | null> {
    return this.fxqlModel
      .findOneAndUpdate(query, updates, { new: true })
      .exec();
  }

  async updateMany(query: unknown, update: Partial<FxqlDocumentDto>) {
    return this.fxqlModel.updateMany(query, update).lean().exec();
  }
}
