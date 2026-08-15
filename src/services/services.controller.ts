import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,

} from '@nestjs/common';

import { ServicesService } from './services.service';

import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';

@Controller('services')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
  ) {}

  @UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
@Post()
create(
  @Body() dto: CreateServiceDto,
) {
  return this.servicesService.create(dto);
}

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.servicesService.findOne(id);
  }

 @UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
@Patch(':id')
update(
  @Param('id') id: string,
  @Body() dto: UpdateServiceDto,
) {
  return this.servicesService.update(id, dto);
}

  @UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
@Delete(':id')
remove(
  @Param('id') id: string,
) {
  return this.servicesService.remove(id);
}
}