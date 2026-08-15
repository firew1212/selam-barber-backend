import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    userId: string,
    dto: CreateAppointmentDto,
  ) {
    // --------------------------------------------------
    // 1. Find customer
    // --------------------------------------------------

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

    // --------------------------------------------------
    // 2. Find barber
    // --------------------------------------------------

    const barber =
      await this.prisma.barber.findUnique({
        where: {
          id: dto.barberId,
        },
      });

    if (!barber) {
      throw new NotFoundException(
        'Barber not found',
      );
    }

    if (
      barber.status === 'UNAVAILABLE' ||
      barber.status === 'VACATION'
    ) {
      throw new BadRequestException(
        'Barber is not available',
      );
    }

    // --------------------------------------------------
    // 3. Validate appointment date
    // --------------------------------------------------

    const appointmentDate =
      new Date(dto.appointmentDate);

    if (
      Number.isNaN(
        appointmentDate.getTime(),
      )
    ) {
      throw new BadRequestException(
        'Invalid appointment date',
      );
    }

    // Fire Barber working hours:
    // 01:00 AM - 01:00 PM Ethiopia time.

    const hour = Number(
      new Intl.DateTimeFormat('en-US', {
        timeZone: 'Africa/Addis_Ababa',
        hour: '2-digit',
        hourCycle: 'h23',
      }).format(appointmentDate),
    );

    if (hour < 1 || hour >= 13) {
      throw new BadRequestException(
        'Appointments are available between 1:00 AM and 1:00 PM',
      );
    }

    // --------------------------------------------------
    // 4. Check barber vacation
    // --------------------------------------------------

    const vacation =
      await this.prisma.barberVacation.findFirst({
        where: {
          barberId: dto.barberId,
          startDate: {
            lte: appointmentDate,
          },
          endDate: {
            gte: appointmentDate,
          },
        },
      });

    if (vacation) {
      throw new BadRequestException(
        'Barber is on vacation on this date',
      );
    }

    // --------------------------------------------------
    // 5. Validate services
    // --------------------------------------------------

    const services =
      await this.prisma.service.findMany({
        where: {
          id: {
            in: dto.serviceIds,
          },
          isActive: true,
        },
      });

    if (
      services.length !==
      dto.serviceIds.length
    ) {
      throw new BadRequestException(
        'One or more services are invalid or inactive',
      );
    }

    // --------------------------------------------------
    // 6. Calculate total
    // --------------------------------------------------

    const totalAmount =
      services.reduce(
        (sum, service) =>
          sum + Number(service.price),
        0,
      );

    // --------------------------------------------------
    // 7. Create appointment + queue entry
    // --------------------------------------------------

    const appointmentId =
      await this.prisma.$transaction(
        async (tx) => {
          // Check for an existing appointment
          // inside the transaction.

          const existingAppointment =
            await tx.appointment.findFirst({
              where: {
                barberId: dto.barberId,
                appointmentDate,
                status: {
                  not: 'CANCELLED',
                },
              },
              select: {
                id: true,
              },
            });

          if (existingAppointment) {
            throw new ConflictException(
              'This barber is already booked at this time',
            );
          }

          // Get current queue position.

          const queueCount =
            await tx.queueEntry.count({
              where: {
                barberId: dto.barberId,
                status: 'WAITING',
              },
            });

          // Create appointment.

          const created =
            await tx.appointment.create({
              data: {
                customerId: customer.id,
                barberId: dto.barberId,
                appointmentDate,
                notes: dto.notes,
                totalAmount,

                services: {
                  create: dto.serviceIds.map(
                    (serviceId) => ({
                      serviceId,
                    }),
                  ),
                },
              },

              select: {
                id: true,
              },
            });

          // Create queue entry.

          await tx.queueEntry.create({
            data: {
              customerId: customer.id,
              barberId: dto.barberId,
              appointmentId: created.id,
              queuePosition:
                queueCount + 1,
              status: 'WAITING',
            },
          });

          return created.id;
        },
        {
          timeout: 15000,
        },
      );

    // --------------------------------------------------
    // 8. Load complete appointment AFTER transaction
    // --------------------------------------------------

    return this.findOne(appointmentId);
  }

  // ==================================================
  // CUSTOMER APPOINTMENTS
  // ==================================================

  async getMyAppointments(
    userId: string,
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

    return this.prisma.appointment.findMany({
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

        services: {
          include: {
            service: true,
          },
        },

        queueEntry: true,
        payments: true,
        review: true,
      },

      orderBy: {
        appointmentDate: 'desc',
      },
    });
  }

  // ==================================================
  // ADMIN / BARBER
  // ==================================================

  async findAll() {
    return this.prisma.appointment.findMany({
      include: {
        customer: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                phoneNumber: true,
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

        services: {
          include: {
            service: true,
          },
        },

        queueEntry: true,
        payments: true,
        review: true,
      },

      orderBy: {
        appointmentDate: 'asc',
      },
    });
  }

  // ==================================================
  // FIND ONE
  // ==================================================

  async findOne(id: string) {
    const appointment =
      await this.prisma.appointment.findUnique({
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

          services: {
            include: {
              service: true,
            },
          },

          queueEntry: true,
          payments: true,
          review: true,
        },
      });

    if (!appointment) {
      throw new NotFoundException(
        'Appointment not found',
      );
    }

    return appointment;
  }

  // ==================================================
  // UPDATE STATUS
  // ==================================================

  async updateStatus(
    id: string,
    dto: UpdateAppointmentStatusDto,
  ) {
    const appointment =
      await this.findOne(id);

    const updated =
      await this.prisma.appointment.update({
        where: {
          id,
        },

        data: {
          status: dto.status,
        },
      });

    if (appointment.queueEntry) {
      const queueStatus =
        this.appointmentStatusToQueueStatus(
          dto.status,
        );

      if (queueStatus) {
        await this.prisma.queueEntry.update({
          where: {
            id: appointment.queueEntry.id,
          },

          data: {
            status: queueStatus,
          },
        });
      }
    }

    return updated;
  }

  // ==================================================
  // CUSTOMER CANCEL
  // ==================================================

  async cancelForCustomer(
    appointmentId: string,
    userId: string,
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
      await this.prisma.appointment.findFirst({
        where: {
          id: appointmentId,
          customerId: customer.id,
        },

        include: {
          queueEntry: true,
        },
      });

    if (!appointment) {
      throw new NotFoundException(
        'Appointment not found',
      );
    }

    if (
      appointment.status ===
        'COMPLETED' ||
      appointment.status ===
        'IN_SERVICE' ||
      appointment.status ===
        'CANCELLED'
    ) {
      throw new BadRequestException(
        'This appointment cannot be cancelled',
      );
    }

    await this.prisma.$transaction(
      async (tx) => {
        if (appointment.queueEntry) {
          await tx.queueEntry.delete({
            where: {
              id: appointment.queueEntry.id,
            },
          });
        }

        await tx.appointment.update({
          where: {
            id: appointmentId,
          },

          data: {
            status: 'CANCELLED',
          },
        });
      },
      {
        timeout: 10000,
      },
    );

    return this.findOne(appointmentId);
  }

  // ==================================================
  // STATUS MAPPING
  // ==================================================

  private appointmentStatusToQueueStatus(
    status:
      UpdateAppointmentStatusDto['status'],
  ) {
    switch (status) {
      case 'IN_QUEUE':
        return 'WAITING';

      case 'IN_SERVICE':
        return 'IN_SERVICE';

      case 'COMPLETED':
        return 'COMPLETED';

      case 'NO_SHOW':
        return 'NO_SHOW';

      default:
        return null;
    }
  }
}