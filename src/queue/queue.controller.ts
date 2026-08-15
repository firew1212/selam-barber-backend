import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  
} from '@nestjs/common';

import { QueueService } from './queue.service';
import { UpdateQueueStatusDto } from './dto/update-queue-status.dto';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('queue')
@UseGuards(JwtGuard, RolesGuard)
export class QueueController {
  constructor(
    private readonly queueService: QueueService,
  ) {}

  // CUSTOMER
  @Get('my')
  @Roles('CUSTOMER')
  getMyQueue(@Req() req: any) {
    return this.queueService.getMyQueue(
      req.user.userId,
    );
  }

  // BARBER / ADMIN
  @Get('barber/:barberId')
  @Roles('ADMIN', 'BARBER')
  getBarberQueue(
    @Param('barberId') barberId: string,
  ) {
    return this.queueService.getBarberQueue(
      barberId,
    );
  }

  @Get('next/:barberId')
  @Roles('ADMIN', 'BARBER')
  getNextCustomer(
    @Param('barberId') barberId: string,
  ) {
    return this.queueService.getNextCustomer(
      barberId,
    );
  }

  @Get(':id')
  @Roles('ADMIN', 'BARBER')
  findOne(
    @Param('id') id: string,
  ) {
    return this.queueService.findOne(id);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'BARBER')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateQueueStatusDto,
  ) {
    return this.queueService.updateStatus(
      id,
      dto,
    );
  }
}