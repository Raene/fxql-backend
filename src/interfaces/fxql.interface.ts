import { Types } from 'mongoose';

export interface FxqlI {
  entryId: Types.ObjectId;
  sourceCurrency: string;
  destinationCurrency: string;
  sellPrice: number;
  buyPrice: number;
  capAmount: number;
  archivedOn?: Date;
  currencyPair: string;
}

export interface FxqlDocument extends FxqlI {
  createdAt: Date;
  updatedAt: Date;
}
