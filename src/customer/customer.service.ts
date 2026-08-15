import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomerService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findByUserId(userId: string) {
    if (!userId) {
      throw new NotFoundException(
        'User ID was not found',
      );
    }

    const customer =
      await this.prisma.customer.findUnique({
        where: {
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              phoneNumber: true,
              role: true,
            },
          },

          favoriteBarber: true,

          appointments: {
            orderBy: {
              appointmentDate: 'desc',
            },

            include: {
              barber: true,

              services: {
                include: {
                  service: true,
                },
              },
            },
          },
        },
      });

    if (!customer) {
      throw new NotFoundException(
        'Customer profile not found',
      );
    }

    return customer;
  }

  async getProfile(userId: string) {
    return this.findByUserId(userId);
  }
}