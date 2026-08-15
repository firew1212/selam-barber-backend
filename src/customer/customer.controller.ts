import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CustomerService } from './customer.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('customer')
@UseGuards(JwtGuard, RolesGuard)
@Roles('CUSTOMER')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
  ) {}

  @Get('me')
  async getMe(@Req() req: any) {
    return this.customerService.findByUserId(
      req.user.userId,
    );
  }
}