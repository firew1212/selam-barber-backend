import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { UpdateBarberStatusDto } from './dto/update-barber-status.dto';
import { CreateVacationDto } from './dto/create-vacation.dto';

@Injectable()
export class BarbersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  findAll() {
    return this.prisma.barber.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: string) {
    const barber =
      await this.prisma.barber.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });

    if (!barber) {
      throw new NotFoundException(
        'Barber not found',
      );
    }

    return barber;
  }

  async updateStatus(
    id: string,
    dto: UpdateBarberStatusDto,
  ) {
    await this.findOne(id);

    return this.prisma.barber.update({
      where: { id },
      data: {
        status: dto.status,
      },
    });
  }

  async createVacation(
    barberId: string,
    dto: CreateVacationDto,
  ) {
    await this.findOne(barberId);

    return this.prisma.barberVacation.create({
      data: {
        barberId,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        reason: dto.reason,
      },
    });
  }

  getVacations(barberId: string) {
    return this.prisma.barberVacation.findMany({
      where: {
        barberId,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }
}