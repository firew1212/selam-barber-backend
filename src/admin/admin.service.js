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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard() {
        const [totalUsers, totalCustomers, totalBarbers, activeBarbers, totalServices, activeServices, totalAppointments, todayAppointments, pendingPayments, totalRevenue, totalReviews,] = await Promise.all([
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
    async getUser(id) {
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
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async setUserActive(id, isActive) {
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
    async getBarber(id) {
        const barber = await this.prisma.barber.findUnique({
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
            throw new common_1.NotFoundException('Barber not found');
        }
        return barber;
    }
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
    async getServices() {
        return this.prisma.service.findMany({
            orderBy: {
                name: 'asc',
            },
        });
    }
    startOfToday() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
    startOfTomorrow() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map