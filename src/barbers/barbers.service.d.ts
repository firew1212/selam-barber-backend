import { PrismaService } from '../prisma/prisma.service';
import { UpdateBarberStatusDto } from './dto/update-barber-status.dto';
import { CreateVacationDto } from './dto/create-vacation.dto';
export declare class BarbersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        user: {
            fullName: string;
            phoneNumber: string;
            id: string;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.BarberStatus;
        photoUrl: string | null;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            fullName: string;
            phoneNumber: string;
            id: string;
            passwordHash: string;
            role: import("@prisma/client").$Enums.UserRole;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.BarberStatus;
        photoUrl: string | null;
    }>;
    updateStatus(id: string, dto: UpdateBarberStatusDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.BarberStatus;
        photoUrl: string | null;
    }>;
    createVacation(barberId: string, dto: CreateVacationDto): Promise<{
        id: string;
        createdAt: Date;
        startDate: Date;
        endDate: Date;
        reason: string | null;
        barberId: string;
    }>;
    getVacations(barberId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        startDate: Date;
        endDate: Date;
        reason: string | null;
        barberId: string;
    }[]>;
}
