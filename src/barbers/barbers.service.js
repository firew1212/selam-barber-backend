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
exports.BarbersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BarbersService = class BarbersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.barber.findMany({
            include: {
                user: true,
            },
        });
    }
    async findOne(id) {
        const barber = await this.prisma.barber.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });
        if (!barber) {
            throw new common_1.NotFoundException('Barber not found');
        }
        return barber;
    }
    async updateStatus(id, dto) {
        await this.findOne(id);
        return this.prisma.barber.update({
            where: { id },
            data: {
                status: dto.status,
            },
        });
    }
    async createVacation(barberId, dto) {
        await this.findOne(barberId);
        return this.prisma.barberVacation.create({
            data: {
                barberId,
                startDate: new Date(dto.startDate),
                endDate: new Date(dto.endDate),
                reason: dto.reason,
            },
        });
    }
    getVacations(barberId) {
        return this.prisma.barberVacation.findMany({
            where: {
                barberId,
            },
            orderBy: {
                startDate: 'desc',
            },
        });
    }
};
exports.BarbersService = BarbersService;
exports.BarbersService = BarbersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BarbersService);
//# sourceMappingURL=barbers.service.js.map