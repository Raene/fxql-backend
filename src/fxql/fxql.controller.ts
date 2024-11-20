import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Logger,
} from '@nestjs/common';
import { FxqlService } from './fxql.service';
import { Throttle } from '@nestjs/throttler';
import {
  CreateFxqlDTO,
  CreateFxqlResponse,
  ErrorMessageResponse,
} from 'src/interfaces/fxql.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('fxql')
@Controller('fxql')
export class FxqlController {
  private readonly logger = new Logger(FxqlController.name);
  constructor(private readonly fxqlService: FxqlService) {}

  @Post()
  @ApiOperation({ summary: 'Parse FXQL String' })
  @ApiResponse({
    status: 201,
    description: 'Successfully parsed the FXQL string',
    type: [CreateFxqlResponse],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid FXQL format or validation error',
    type: [ErrorMessageResponse],
  })
  @Throttle({})
  async create(@Body() body: CreateFxqlDTO) {
    try {
      const { FXQL } = body;
      if (!FXQL) {
        throw new BadRequestException('FXQL string is required');
      }

      const parsedData = await this.fxqlService.parseFxql(FXQL);

      const data = await this.fxqlService.create(parsedData);
      return {
        message: 'Fxql statement parsed successfully',
        data,
        status: 201,
      };
    } catch (error) {
      this.logger.error(error.message, error.stack, error.context);
      return {
        message: error.message,
        status: error.status || 500,
      };
    }
  }
}
