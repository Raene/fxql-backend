import { Types } from 'mongoose';

export interface FxqlI {
  entryId: Types.ObjectId;
  sourceCurrency: string;
  destinationCurrency: string;
  sellPrice: number;
  buyPrice: number;
  capAmount: number;
  archivedOn?: Date;
}

export interface FxqlDocument extends FxqlI {
  createdAt: Date;
  updatedAt: Date;
}
