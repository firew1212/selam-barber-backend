import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { AdminService } from './admin.service';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  // ==========================================================
  // DASHBOARD
  // ==========================================================

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  // ==========================================================
  // USERS
  // ==========================================================

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @Patch('users/:id/active')
  setUserActive(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.adminService.setUserActive(
      id,
      isActive,
    );
  }

  // ==========================================================
  // BARBERS
  // ==========================================================

  @Get('barbers')
  getBarbers() {
    return this.adminService.getBarbers();
  }

  @Get('barbers/:id')
  getBarber(@Param('id') id: string) {
    return this.adminService.getBarber(id);
  }

  // ==========================================================
  // CUSTOMERS
  // ==========================================================

  @Get('customers')
  getCustomers() {
    return this.adminService.getCustomers();
  }

  // ==========================================================
  // APPOINTMENTS
  // ==========================================================

  @Get('appointments')
  getAppointments() {
    return this.adminService.getAppointments();
  }

  // ==========================================================
  // QUEUE
  // ==========================================================

  @Get('queue')
  getQueue() {
    return this.adminService.getQueue();
  }

  // ==========================================================
  // PAYMENTS
  // ==========================================================

  @Get('payments')
  getPayments() {
    return this.adminService.getPayments();
  }

  // ==========================================================
  // REVIEWS
  // ==========================================================

  @Get('reviews')
  getReviews() {
    return this.adminService.getReviews();
  }

  // ==========================================================
  // SERVICES
  // ==========================================================

  @Get('services')
  getServices() {
    return this.adminService.getServices();
  }
}