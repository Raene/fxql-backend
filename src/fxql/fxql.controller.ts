import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { FxqlService } from './fxql.service';

@Controller('fxql')
export class FxqlController {
  constructor(private readonly fxqlService: FxqlService) {}

  @Post()
  async create(@Body() body: { FXQL: string }) {
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
      return {
        message: error.message,
        status: error.status || 500,
      };
    }
  }
}
