import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    userId: string,
    dto: CreateReviewDto,
  ) {
    const customer =
      await this.prisma.customer.findUnique({
        where: {
          userId,
        },
      });

    if (!customer) {
      throw new NotFoundException(
        'Customer profile not found',
      );
    }

    const appointment =
      await this.prisma.appointment.findUnique({
        where: {
          id: dto.appointmentId,
        },

        include: {
          review: true,
        },
      });

    if (!appointment) {
      throw new NotFoundException(
        'Appointment not found',
      );
    }

    if (
      appointment.customerId !== customer.id
    ) {
      throw new BadRequestException(
        'You can only review your own appointment',
      );
    }

    if (
      appointment.status !== 'COMPLETED'
    ) {
      throw new BadRequestException(
        'Appointment not completed',
      );
    }

    if (appointment.review) {
      throw new BadRequestException(
        'Review already exists',
      );
    }

    return this.prisma.review.create({
      data: {
        customerId: customer.id,
        barberId: appointment.barberId,
        appointmentId: appointment.id,
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }

  findAll() {
    return this.prisma.review.findMany({
      include: {
        customer: true,
        barber: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findBarberReviews(barberId: string) {
    return this.prisma.review.findMany({
      where: {
        barberId,
      },

      include: {
        customer: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}