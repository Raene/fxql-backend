import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class FxqlDto {
  @ApiProperty({
    description: 'Unique entry ID of the FXQL entry',
    example: '60d4f1f1b3f3d42f14a5bb5d',
  })
  entryId: Types.ObjectId;

  @ApiProperty({
    description: 'Source currency',
    example: 'USD',
  })
  sourceCurrency: string;

  @ApiProperty({
    description: 'Destination currency',
    example: 'GBP',
  })
  destinationCurrency: string;

  @ApiProperty({
    description: 'Sell price of the currency pair',
    example: 0.85,
  })
  sellPrice: number;

  @ApiProperty({
    description: 'Buy price of the currency pair',
    example: 0.9,
  })
  buyPrice: number;

  @ApiProperty({
    description: 'Cap amount for the transaction',
    example: 10000,
  })
  capAmount: number;

  @ApiProperty({
    description: 'Date when the entry was archived (optional)',
    example: '2024-11-20T00:00:00Z',
    required: false,
  })
  archivedOn?: Date;

  @ApiProperty({
    description:
      'Currency pair in the format source-destination (e.g., USD-GBP)',
    example: 'USD-GBP',
  })
  currencyPair: string;
}
export class FxqlDocumentDto extends FxqlDto {
  @ApiProperty({
    description: 'Timestamp of when the FXQL entry was created',
    example: '2024-11-20T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp of when the FXQL entry was last updated',
    example: '2024-11-20T00:00:00Z',
  })
  updatedAt: Date;
}

export class CreateFxqlDTO {
  @ApiProperty({
    description: `Fxql string in format "FXQL": "USD-GBP {\\n BUY 100\\n SELL 200\\n CAP 93800\\n}"`,
    example: '"USD-GBP {\\n BUY 100\\n SELL 200\\n CAP 93800\\n}',
  })
  FXQL: string;
}

export class CreateFxqlResponse {
  @ApiProperty({
    description: 'Response message',
    example: 'Fxql statement parsed successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Array of Fxql Document',
    example: [
      {
        entryId: '60d4f1f1b3f3d42f14a5bb5d',
        sourceCurrency: 'USD',
        destinationCurrency: 'GBP',
        sellPrice: 0.85,
        buyPrice: 0.9,
        capAmount: 10000,
        archivedOn: '2024-11-20T00:00:00Z',
        currencyPair: 'USD-GBP',
        createdAt: '2024-11-20T00:00:00Z',
        updatedAt: '2024-11-20T00:00:00Z',
      },
    ],
  })
  data: FxqlDocumentDto[];

  @ApiProperty({
    description: 'Status code, matches regular http status codes',
    example: '201',
  })
  status: number;
}

export class ErrorMessageResponse {
  @ApiProperty({
    description: 'Response message',
    example: 'Invalid value at line 5, position 6',
  })
  message: string;
  @ApiProperty({
    description: 'Status code, matches regular http status codes',
    example: '400',
  })
  status: number;
}
