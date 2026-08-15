import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // ============================================================
  // DASHBOARD
  // ============================================================

  async getDashboard() {
    const [
      totalUsers,
      totalCustomers,
      totalBarbers,
      activeBarbers,
      totalServices,
      activeServices,
      totalAppointments,
      todayAppointments,
      pendingPayments,
      totalRevenue,
      totalReviews,
    ] = await Promise.all([
      this.prisma.user.count(),

      this.prisma.customer.count(),

      this.prisma.barber.count(),

      this.prisma.barber.count({
        where: {
          status: 'AVAILABLE',
        },
      }),

      this.prisma.service.count(),

      this.prisma.service.count({
        where: {
          isActive: true,
        },
      }),

      this.prisma.appointment.count(),

      this.prisma.appointment.count({
        where: {
          appointmentDate: {
            gte: this.startOfToday(),
            lt: this.startOfTomorrow(),
          },
        },
      }),

      this.prisma.payment.count({
        where: {
          status: 'PENDING',
        },
      }),

      this.prisma.payment.aggregate({
        where: {
          status: 'PAID',
        },
        _sum: {
          amount: true,
        },
      }),

      this.prisma.review.count(),
    ]);

    return {
      users: {
        total: totalUsers,
        customers: totalCustomers,
        barbers: totalBarbers,
      },

      barbers: {
        total: totalBarbers,
        available: activeBarbers,
      },

      services: {
        total: totalServices,
        active: activeServices,
      },

      appointments: {
        total: totalAppointments,
        today: todayAppointments,
      },

      payments: {
        pending: pendingPayments,
        revenue: totalRevenue._sum.amount ?? 0,
      },

      reviews: {
        total: totalReviews,
      },
    };
  }

  // ============================================================
  // USERS
  // ============================================================

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,

        customer: {
          select: {
            id: true,
          },
        },

        barber: {
          select: {
            id: true,
            status: true,
            photoUrl: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    return user;
  }

  async setUserActive(
    id: string,
    isActive: boolean,
  ) {
    await this.getUser(id);

    return this.prisma.user.update({
      where: {
        id,
      },

      data: {
        isActive,
      },

      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        isActive: true,
      },
    });
  }

  // ============================================================
  // BARBERS
  // ============================================================

  async getBarbers() {
    return this.prisma.barber.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            role: true,
            isActive: true,
          },
        },

        vacations: {
          orderBy: {
            startDate: 'desc',
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getBarber(id: string) {
    const barber =
      await this.prisma.barber.findUnique({
        where: {
          id,
        },

        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              phoneNumber: true,
              role: true,
              isActive: true,
            },
          },

          vacations: {
            orderBy: {
              startDate: 'desc',
            },
          },
        },
      });

    if (!barber) {
      throw new NotFoundException(
        'Barber not found',
      );
    }

    return barber;
  }

  // ============================================================
  // CUSTOMERS
  // ============================================================

  async getCustomers() {
    return this.prisma.customer.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
        },

        favoriteBarber: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },

      orderBy: {
        user: {
          createdAt: 'desc',
        },
      },
    });
  }

  // ============================================================
  // APPOINTMENTS
  // ============================================================

  async getAppointments() {
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
                phoneNumber: true,
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

  // ============================================================
  // QUEUE
  // ============================================================

  async getQueue() {
    return this.prisma.queueEntry.findMany({
      where: {
        status: {
          in: [
            'WAITING',
            'CALLED',
            'IN_SERVICE',
          ],
        },
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

        appointment: true,
      },

      orderBy: [
        {
          barberId: 'asc',
        },
        {
          queuePosition: 'asc',
        },
      ],
    });
  }

  // ============================================================
  // PAYMENTS
  // ============================================================

  async getPayments() {
    return this.prisma.payment.findMany({
      include: {
        appointment: {
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
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // ============================================================
  // REVIEWS
  // ============================================================

  async getReviews() {
    return this.prisma.review.findMany({
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

        appointment: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // ============================================================
  // SERVICES
  // ============================================================

  async getServices() {
    return this.prisma.service.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  // ============================================================
  // HELPERS
  // ============================================================

  private startOfToday() {
    const now = new Date();

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
  }

  private startOfTomorrow() {
    const now = new Date();

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );
  }
}