import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { BarbersService } from './barbers.service';

import { UpdateBarberStatusDto } from './dto/update-barber-status.dto';
import { CreateVacationDto } from './dto/create-vacation.dto';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('barbers')
export class BarbersController {
  constructor(
    private readonly barbersService: BarbersService,
  ) {}

  @Get()
  findAll() {
    return this.barbersService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.barbersService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'BARBER')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBarberStatusDto,
  ) {
    return this.barbersService.updateStatus(
      id,
      dto,
    );
  }

  @Post(':id/vacations')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN', 'BARBER')
  createVacation(
    @Param('id') id: string,
    @Body() dto: CreateVacationDto,
  ) {
    return this.barbersService.createVacation(
      id,
      dto,
    );
  }

  @Get(':id/vacations')
  getVacations(
    @Param('id') id: string,
  ) {
    return this.barbersService.getVacations(id);
  }
}