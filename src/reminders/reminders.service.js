"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemindersService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
let RemindersService = class RemindersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkAppointments() {
        const now = new Date();
        const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);
        const appointments = await this.prisma.appointment.findMany({
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
            console.log('[Reminder] No upcoming appointments');
            return;
        }
        for (const appointment of appointments) {
            console.log('');
            console.log('==========================');
            console.log('FIRE BARBER REMINDER');
            console.log('');
            console.log('Customer:', appointment.customer.user.fullName);
            console.log('Phone:', appointment.customer.user.phoneNumber);
            console.log('');
            console.log('Your appointment starts in 10 minutes.');
            console.log('Barber:', appointment.barber.user.fullName);
            console.log('Appointment:', appointment.appointmentDate);
            console.log('==========================');
            console.log('');
        }
    }
};
exports.RemindersService = RemindersService;
__decorate([
    (0, schedule_1.Cron)('* * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RemindersService.prototype, "checkAppointments", null);
exports.RemindersService = RemindersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RemindersService);
//# sourceMappingURL=reminders.service.js.map