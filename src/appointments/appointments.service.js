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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AppointmentsService = class AppointmentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const customer = await this.prisma.customer.findUnique({
            where: {
                userId,
            },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer profile not found');
        }
        const barber = await this.prisma.barber.findUnique({
            where: {
                id: dto.barberId,
            },
        });
        if (!barber) {
            throw new common_1.NotFoundException('Barber not found');
        }
        if (barber.status === 'UNAVAILABLE' ||
            barber.status === 'VACATION') {
            throw new common_1.BadRequestException('Barber is not available');
        }
        const appointmentDate = new Date(dto.appointmentDate);
        if (Number.isNaN(appointmentDate.getTime())) {
            throw new common_1.BadRequestException('Invalid appointment date');
        }
        const hour = Number(new Intl.DateTimeFormat('en-US', {
            timeZone: 'Africa/Addis_Ababa',
            hour: '2-digit',
            hourCycle: 'h23',
        }).format(appointmentDate));
        if (hour < 1 || hour >= 13) {
            throw new common_1.BadRequestException('Appointments are available between 1:00 AM and 1:00 PM');
        }
        const vacation = await this.prisma.barberVacation.findFirst({
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
            throw new common_1.BadRequestException('Barber is on vacation on this date');
        }
        const services = await this.prisma.service.findMany({
            where: {
                id: {
                    in: dto.serviceIds,
                },
                isActive: true,
            },
        });
        if (services.length !==
            dto.serviceIds.length) {
            throw new common_1.BadRequestException('One or more services are invalid or inactive');
        }
        const totalAmount = services.reduce((sum, service) => sum + Number(service.price), 0);
        const appointmentId = await this.prisma.$transaction(async (tx) => {
            const existingAppointment = await tx.appointment.findFirst({
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
                throw new common_1.ConflictException('This barber is already booked at this time');
            }
            const queueCount = await tx.queueEntry.count({
                where: {
                    barberId: dto.barberId,
                    status: 'WAITING',
                },
            });
            const created = await tx.appointment.create({
                data: {
                    customerId: customer.id,
                    barberId: dto.barberId,
                    appointmentDate,
                    notes: dto.notes,
                    totalAmount,
                    services: {
                        create: dto.serviceIds.map((serviceId) => ({
                            serviceId,
                        })),
                    },
                },
                select: {
                    id: true,
                },
            });
            await tx.queueEntry.create({
                data: {
                    customerId: customer.id,
                    barberId: dto.barberId,
                    appointmentId: created.id,
                    queuePosition: queueCount + 1,
                    status: 'WAITING',
                },
            });
            return created.id;
        }, {
            timeout: 15000,
        });
        return this.findOne(appointmentId);
    }
    async getMyAppointments(userId) {
        const customer = await this.prisma.customer.findUnique({
            where: {
                userId,
            },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer profile not found');
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
    async findOne(id) {
        const appointment = await this.prisma.appointment.findUnique({
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
            throw new common_1.NotFoundException('Appointment not found');
        }
        return appointment;
    }
    async updateStatus(id, dto) {
        const appointment = await this.findOne(id);
        const updated = await this.prisma.appointment.update({
            where: {
                id,
            },
            data: {
                status: dto.status,
            },
        });
        if (appointment.queueEntry) {
            const queueStatus = this.appointmentStatusToQueueStatus(dto.status);
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
    async cancelForCustomer(appointmentId, userId) {
        const customer = await this.prisma.customer.findUnique({
            where: {
                userId,
            },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer profile not found');
        }
        const appointment = await this.prisma.appointment.findFirst({
            where: {
                id: appointmentId,
                customerId: customer.id,
            },
            include: {
                queueEntry: true,
            },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.status ===
            'COMPLETED' ||
            appointment.status ===
                'IN_SERVICE' ||
            appointment.status ===
                'CANCELLED') {
            throw new common_1.BadRequestException('This appointment cannot be cancelled');
        }
        await this.prisma.$transaction(async (tx) => {
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
        }, {
            timeout: 10000,
        });
        return this.findOne(appointmentId);
    }
    appointmentStatusToQueueStatus(status) {
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
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map