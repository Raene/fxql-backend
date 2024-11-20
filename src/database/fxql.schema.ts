import { Schema, Types } from 'mongoose';
export const FxqlSchema = new Schema(
  {
    //unique mongoose id
    entryId: {
      type: Types.ObjectId,
      required: true,
      unique: true,
      index: true,
      auto: true,
    },
    sourceCurrency: {
      type: String,
      required: true,
    },
    destinationCurrency: {
      type: String,
      required: true,
    },
    sellPrice: {
      type: Number,
      required: true,
    },
    buyPrice: {
      type: Number,
      required: true,
    },
    capAmount: {
      type: Number,
      required: true,
    },
    archivedOn: {
      type: Date,
    },
  },
  {
    timestamps: true,
    _id: false,
  },
);
