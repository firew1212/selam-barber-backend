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
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QueueService = class QueueService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getBarberQueue(barberId) {
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
    async findOne(id) {
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
            throw new common_1.NotFoundException('Queue entry not found');
        }
        return queue;
    }
    async updateStatus(id, dto) {
        const queue = await this.findOne(id);
        const appointmentStatusMap = {
            WAITING: 'IN_QUEUE',
            CALLED: 'IN_QUEUE',
            IN_SERVICE: 'IN_SERVICE',
            COMPLETED: 'COMPLETED',
            NO_SHOW: 'NO_SHOW',
        };
        const appointmentStatus = appointmentStatusMap[dto.status];
        if (!appointmentStatus) {
            throw new common_1.BadRequestException('Invalid queue status');
        }
        const updatedQueue = await this.prisma.$transaction(async (tx) => {
            const updatedQueue = await tx.queueEntry.update({
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
    async getNextCustomer(barberId) {
        const nextCustomer = await this.prisma.queueEntry.findFirst({
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
            throw new common_1.NotFoundException('No waiting customer in the queue');
        }
        return nextCustomer;
    }
    async getMyQueue(userId) {
        const customer = await this.prisma.customer.findUnique({
            where: {
                userId,
            },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer profile not found');
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
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QueueService);
//# sourceMappingURL=queue.service.js.map