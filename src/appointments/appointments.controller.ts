import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AppointmentsService } from './appointments.service';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
  ) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('CUSTOMER')
  create(
    @Req() req: any,
    @Body() dto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.create(
      req.user.userId,
      dto,
    );
  }

  @Get('my')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('CUSTOMER')
  getMyAppointments(@Req() req: any) {
    return this.appointmentsService.getMyAppointments(
      req.user.userId,
    );
  }

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'BARBER')
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'BARBER')
  findOne(
    @Param('id') id: string,
  ) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'BARBER')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentStatusDto,
  ) {
    return this.appointmentsService.updateStatus(
      id,
      dto,
    );
  }

  @Patch(':id/cancel')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('CUSTOMER')
  cancel(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    return this.appointmentsService.cancelForCustomer(
      id,
      req.user.userId,
    );
  }
}