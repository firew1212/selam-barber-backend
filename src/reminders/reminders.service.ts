import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RemindersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  @Cron('* * * * *')
  async checkAppointments() {
    const now = new Date();

    const tenMinutesLater = new Date(
      now.getTime() + 10 * 60 * 1000,
    );

    const appointments =
      await this.prisma.appointment.findMany({
        where: {
          appointmentDate: {
            gte: now,
            lte: tenMinutesLater,
          },

          status: 'CONFIRMED',
        },

        include: {
          customer: {
            include: {
              user: true,
            },
          },

          barber: {
            include: {
              user: true,
            },
          },
        },
      });

    if (appointments.length === 0) {
      console.log(
        '[Reminder] No upcoming appointments',
      );
      return;
    }

    for (const appointment of appointments) {
      console.log('');
      console.log(
        '==========================',
      );
      console.log('FIRE BARBER REMINDER');
      console.log('');

      console.log(
        'Customer:',
        appointment.customer.user.fullName,
      );

      console.log(
        'Phone:',
        appointment.customer.user.phoneNumber,
      );

      console.log('');

      console.log(
        'Your appointment starts in 10 minutes.',
      );

      console.log(
        'Barber:',
        appointment.barber.user.fullName,
      );

      console.log(
        'Appointment:',
        appointment.appointmentDate,
      );

      console.log(
        '==========================',
      );
      console.log('');
    }
  }
}