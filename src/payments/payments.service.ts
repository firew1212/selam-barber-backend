import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    userId: string,
    dto: CreatePaymentDto,
  ) {
    const appointment =
      await this.prisma.appointment.findUnique({
        where: {
          id: dto.appointmentId,
        },

        include: {
          customer: true,
        },
      });

    if (!appointment) {
      throw new NotFoundException(
        'Appointment not found',
      );
    }

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

    if (
      appointment.customerId !== customer.id
    ) {
      throw new ForbiddenException(
        'You cannot pay for this appointment',
      );
    }

    if (
      appointment.status === 'CANCELLED'
    ) {
      throw new ForbiddenException(
        'Cancelled appointments cannot receive payments',
      );
    }

    return this.prisma.payment.create({
      data: {
        appointmentId: dto.appointmentId,
        amount: dto.amount,
        paymentType: dto.paymentType,
        paymentMethod: dto.paymentMethod,
        status: 'PENDING',
      },
    });
  }

  findAll() {
    return this.prisma.payment.findMany({
      include: {
        appointment: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(
    id: string,
    userId: string,
    role: string,
  ) {
    const payment =
      await this.prisma.payment.findUnique({
        where: {
          id,
        },

        include: {
          appointment: {
            include: {
              customer: true,
            },
          },
        },
      });

    if (!payment) {
      throw new NotFoundException(
        'Payment not found',
      );
    }

    if (role === 'ADMIN') {
      return payment;
    }

    const customer =
      await this.prisma.customer.findUnique({
        where: {
          userId,
        },
      });

    if (
      !customer ||
      payment.appointment.customerId !==
        customer.id
    ) {
      throw new ForbiddenException(
        'You cannot view this payment',
      );
    }

    return payment;
  }

  async markAsPaid(id: string) {
    const payment =
      await this.prisma.payment.findUnique({
        where: {
          id,
        },
      });

    if (!payment) {
      throw new NotFoundException(
        'Payment not found',
      );
    }

    return this.prisma.payment.update({
      where: {
        id,
      },

      data: {
        status: 'PAID',
        paidAt: new Date(),
      },
    });
  }

  async remove(id: string) {
    const payment =
      await this.prisma.payment.findUnique({
        where: {
          id,
        },
      });

    if (!payment) {
      throw new NotFoundException(
        'Payment not found',
      );
    }

    return this.prisma.payment.delete({
      where: {
        id,
      },
    });
  }
}