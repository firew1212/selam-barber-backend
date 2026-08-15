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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewsService = class ReviewsService {
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
        const appointment = await this.prisma.appointment.findUnique({
            where: {
                id: dto.appointmentId,
            },
            include: {
                review: true,
            },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.customerId !== customer.id) {
            throw new common_1.BadRequestException('You can only review your own appointment');
        }
        if (appointment.status !== 'COMPLETED') {
            throw new common_1.BadRequestException('Appointment not completed');
        }
        if (appointment.review) {
            throw new common_1.BadRequestException('Review already exists');
        }
        return this.prisma.review.create({
            data: {
                customerId: customer.id,
                barberId: appointment.barberId,
                appointmentId: appointment.id,
                rating: dto.rating,
                comment: dto.comment,
            },
        });
    }
    findAll() {
        return this.prisma.review.findMany({
            include: {
                customer: true,
                barber: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    findBarberReviews(barberId) {
        return this.prisma.review.findMany({
            where: {
                barberId,
            },
            include: {
                customer: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map