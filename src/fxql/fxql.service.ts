import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { DbFactory } from 'src/database/db.factory';
import { FxqlDb } from 'src/database/fxql-db.class';
import { NumberConsts } from 'src/enums/constants.enum';
import { Currency } from 'src/enums/currencies.enum';
import { FxqlDto } from 'src/interfaces/fxql.interface';

@Injectable()
export class FxqlService {
  private fxqlDBClass: FxqlDb;

  constructor(
    private dbFactory: DbFactory,
    private configService: ConfigService,
  ) {
    this.fxqlDBClass = this.dbFactory.fetchDbClass('fxql');
  }

  async create(input: FxqlDto[]) {
    //before inserting many, we check if a currency pair already exists, if it does, we archive it
    //we loop through the array of fxqli and check if the same currency pair appears 2 times in the input
    const currencyPairs: string[] = [];
    for (let index = 0; index < input.length; index++) {
      const i = input[index];
      currencyPairs.push(i.currencyPair);
    }

    //update all currency pairs in the input to archived
    await this.fxqlDBClass.updateMany(
      {
        currencyPair: {
          $in: currencyPairs,
        },
        archivedOn: {
          $exists: false,
        },
      },
      {
        archivedOn: new Date(),
      },
    );
    return await this.fxqlDBClass.insertMany(input);
  }

  async getAll(query: any) {
    return await this.fxqlDBClass.findAll({
      archivedOn: {
        $exists: false,
      },
      ...query,
    });
  }

  async parseFxql(input: string) {
    input = input.replace(/\\n/g, '\n');
    const regex =
      /(\w{3})-(\w{3})\s*{\s*BUY\s+([a-zA-Z\d.-]+)\s+SELL\s+([a-zA-Z\d.-]+)\s+CAP\s+([a-zA-Z\d.-]+)\s*}/g;
    const parsedData: FxqlDto[] = [];

    const multipleNewlinesRegex = /\n{2,}/;
    if (multipleNewlinesRegex.test(input)) {
      throw new Error(
        'Invalid format: FXQL statements should be separated by a single newline character within and new FXQL statements should be separated by a single newline characters.',
      );
    }

    let match: RegExpExecArray;
    const MAX_FXQL = Number(
      this.configService.get<string>(NumberConsts.MAX_FXQL),
    );
    const MIN_VALUE = Number(
      this.configService.get<string>(NumberConsts.MIN_VALUE),
    );
    const kVCurrencyPairs: Record<
      string,
      {
        lineNumber: number;
        charPosition: number;
      }
    > = {};
    while ((match = regex.exec(input)) !== null) {
      const [_, curr1, curr2, buy, sell, cap] = match;
      const matchIndex = match.index;

      // Calculate line and character position for error tracking
      const { lineNumber, charPosition } = this.getPositionFromIndex(
        input,
        matchIndex,
      );

      const currencyPair = `${curr1}-${curr2}`;
      if (kVCurrencyPairs[currencyPair] !== undefined) {
        throw new BadRequestException(
          `Duplicate currency pair found in your input: ${currencyPair} at line ${lineNumber}. position ${charPosition}, previously found at line ${kVCurrencyPairs[currencyPair].lineNumber} and position ${kVCurrencyPairs[currencyPair].charPosition} `,
        );
      }
      kVCurrencyPairs[currencyPair] = {
        lineNumber,
        charPosition,
      };

      if (parsedData.length > MAX_FXQL) {
        throw new BadRequestException(
          'Maximum limit of 1000 currency pairs exceeded',
        );
      }

      if (!/\w{3}-\w{3}\s/.test(_)) {
        throw new BadRequestException(
          `Invalid format: Missing single space after currency pair at line ${lineNumber}. position ${charPosition}`,
        );
      }

      //validate currency pair
      if (!validateCurrency(curr1) || !validateCurrency(curr2)) {
        throw new BadRequestException(
          `Invalid currency pair: ${curr1}-${curr2} at line ${lineNumber}`,
        );
      }
      const parsedBuy = parseFloat(buy);
      const parsedSell = parseFloat(sell);
      const parsedCap = parseFloat(cap);
      //check if buy or sell are numbers
      if (isNaN(parsedBuy) || isNaN(parsedSell) || isNaN(parsedCap)) {
        console.log(
          `Invalid buy or sell value: ${buy}-${sell} at line ${lineNumber} position ${charPosition}`,
        );
        throw new BadRequestException(
          `Invalid buy or sell value: ${buy}-${sell} at line ${lineNumber} position ${charPosition}`,
        );
      }

      //check if buy or sell are lesser than zero and
      if (parsedBuy <= MIN_VALUE || parsedSell <= MIN_VALUE) {
        throw new BadRequestException(
          `Invalid buy or sell value: ${buy}-${sell} at line ${lineNumber} position ${charPosition}`,
        );
      }
      //check if cap is within rang
      //cap must be a whole number

      if (isNaN(parsedCap) || parsedCap < 0 || !Number.isInteger(parsedCap)) {
        throw new BadRequestException(
          `Invalid CAP value for ${curr1}-${curr2} at line ${lineNumber} position ${charPosition}`,
        );
      }
      parsedData.push({
        sourceCurrency: curr1,
        destinationCurrency: curr2,
        buyPrice: parsedBuy,
        sellPrice: parsedSell,
        capAmount: parsedCap,
        currencyPair,
        entryId: new Types.ObjectId(),
      });
    }

    // If no matches, check for invalid FXQL blocks
    if (parsedData.length === 0) {
      throw new BadRequestException('No valid FXQL statements found.');
    }
    return parsedData;
  }

  /**
   * Get the line number and character position in the original string
   * @param input The original FXQL string
   * @param index The index position in the string
   */
  private getPositionFromIndex(
    input: string,
    index: number,
  ): { lineNumber: number; charPosition: number } {
    const lines = input.substring(0, index).split('\n'); //split the string from zero to the current index, the length of the array will be the current line number
    const lineNumber = lines.length;
    const charPosition = lines[lines.length - 1].length + 1; // +1 for character position
    return { lineNumber, charPosition };
  }
}

function validateCurrency(currency) {
  return Currency[currency];
}
