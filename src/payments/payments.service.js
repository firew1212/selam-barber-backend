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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentsService = class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const appointment = await this.prisma.appointment.findUnique({
            where: {
                id: dto.appointmentId,
            },
            include: {
                customer: true,
            },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        const customer = await this.prisma.customer.findUnique({
            where: {
                userId,
            },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer profile not found');
        }
        if (appointment.customerId !== customer.id) {
            throw new common_1.ForbiddenException('You cannot pay for this appointment');
        }
        if (appointment.status === 'CANCELLED') {
            throw new common_1.ForbiddenException('Cancelled appointments cannot receive payments');
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
    async findOne(id, userId, role) {
        const payment = await this.prisma.payment.findUnique({
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
            throw new common_1.NotFoundException('Payment not found');
        }
        if (role === 'ADMIN') {
            return payment;
        }
        const customer = await this.prisma.customer.findUnique({
            where: {
                userId,
            },
        });
        if (!customer ||
            payment.appointment.customerId !==
                customer.id) {
            throw new common_1.ForbiddenException('You cannot view this payment');
        }
        return payment;
    }
    async markAsPaid(id) {
        const payment = await this.prisma.payment.findUnique({
            where: {
                id,
            },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
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
    async remove(id) {
        const payment = await this.prisma.payment.findUnique({
            where: {
                id,
            },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return this.prisma.payment.delete({
            where: {
                id,
            },
        });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map