import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { UpdateQueueStatusDto } from './dto/update-queue-status.dto';

@Injectable()
export class QueueService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================================
  // GET BARBER QUEUE
  // ============================================================

  async getBarberQueue(barberId: string) {
    return this.prisma.queueEntry.findMany({
      where: {
        barberId,
        status: {
          in: ['WAITING', 'CALLED', 'IN_SERVICE'],
        },
      },

      orderBy: {
        queuePosition: 'asc',
      },

      include: {
        customer: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                phoneNumber: true,
                role: true,
              },
            },
          },
        },

        appointment: true,
      },
    });
  }

  // ============================================================
  // GET ONE QUEUE ENTRY
  // ============================================================

  async findOne(id: string) {
    const queue = await this.prisma.queueEntry.findUnique({
      where: {
        id,
      },

      include: {
        customer: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                phoneNumber: true,
                role: true,
              },
            },
          },
        },

        barber: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },

        appointment: true,
      },
    });

    if (!queue) {
      throw new NotFoundException('Queue entry not found');
    }

    return queue;
  }

  // ============================================================
  // UPDATE QUEUE STATUS
  // ============================================================

  async updateStatus(
    id: string,
    dto: UpdateQueueStatusDto,
  ) {
    const queue = await this.findOne(id);

    const appointmentStatusMap = {
      WAITING: 'IN_QUEUE',
      CALLED: 'IN_QUEUE',
      IN_SERVICE: 'IN_SERVICE',
      COMPLETED: 'COMPLETED',
      NO_SHOW: 'NO_SHOW',
    } as const;

    const appointmentStatus =
      appointmentStatusMap[dto.status];

    if (!appointmentStatus) {
      throw new BadRequestException(
        'Invalid queue status',
      );
    }

    const updatedQueue =
      await this.prisma.$transaction(async (tx) => {
        const updatedQueue =
          await tx.queueEntry.update({
            where: {
              id,
            },

            data: {
              status: dto.status,
            },
          });

        if (queue.appointmentId) {
          await tx.appointment.update({
            where: {
              id: queue.appointmentId,
            },

            data: {
              status: appointmentStatus,
            },
          });
        }

        return updatedQueue;
      });

    return updatedQueue;
  }

  // ============================================================
  // GET NEXT WAITING CUSTOMER
  // ============================================================

  async getNextCustomer(barberId: string) {
    const nextCustomer =
      await this.prisma.queueEntry.findFirst({
        where: {
          barberId,
          status: 'WAITING',
        },

        orderBy: {
          queuePosition: 'asc',
        },

        include: {
          customer: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  phoneNumber: true,
                  role: true,
                },
              },
            },
          },

          appointment: true,
        },
      });

    if (!nextCustomer) {
      throw new NotFoundException(
        'No waiting customer in the queue',
      );
    }

    return nextCustomer;
  }
  async getMyQueue(userId: string) {
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

  return this.prisma.queueEntry.findMany({
    where: {
      customerId: customer.id,
    },
    include: {
      barber: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
      },
      appointment: {
        select: {
          id: true,
          appointmentDate: true,
          status: true,
        },
      },
    },
    orderBy: {
      queuePosition: 'asc',
    },
  });
}
}