import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { PaymentsService } from './payments.service';

import { CreatePaymentDto } from './dto/create-payment.dto';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('payments')
@UseGuards(JwtGuard, RolesGuard)
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @Post()
  @Roles('CUSTOMER')
  create(
    @Req() req: any,
    @Body() dto: CreatePaymentDto,
  ) {
    return this.paymentsService.create(
      req.user.userId,
      dto,
    );
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'CUSTOMER')
  findOne(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return this.paymentsService.findOne(
      id,
      req.user.userId,
      req.user.role,
    );
  }

  @Patch(':id/pay')
  @Roles('ADMIN')
  markAsPaid(
    @Param('id') id: string,
  ) {
    return this.paymentsService.markAsPaid(id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(
    @Param('id') id: string,
  ) {
    return this.paymentsService.remove(id);
  }
}