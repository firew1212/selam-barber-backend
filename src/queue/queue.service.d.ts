import { PrismaService } from '../prisma/prisma.service';
import { UpdateQueueStatusDto } from './dto/update-queue-status.dto';
export declare class QueueService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getBarberQueue(barberId: string): Promise<({
        customer: {
            user: {
                fullName: string;
                phoneNumber: string;
                id: string;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            favoriteBarberId: string | null;
        };
        appointment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            barberId: string;
            appointmentDate: Date;
            notes: string | null;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            customerId: string;
        } | null;
    } & {
        id: string;
        status: import("@prisma/client").$Enums.QueueStatus;
        barberId: string;
        customerId: string;
        appointmentId: string | null;
        queuePosition: number;
        joinedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        customer: {
            user: {
                fullName: string;
                phoneNumber: string;
                id: string;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            favoriteBarberId: string | null;
        };
        barber: {
            user: {
                fullName: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            status: import("@prisma/client").$Enums.BarberStatus;
            photoUrl: string | null;
        };
        appointment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            barberId: string;
            appointmentDate: Date;
            notes: string | null;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            customerId: string;
        } | null;
    } & {
        id: string;
        status: import("@prisma/client").$Enums.QueueStatus;
        barberId: string;
        customerId: string;
        appointmentId: string | null;
        queuePosition: number;
        joinedAt: Date;
    }>;
    updateStatus(id: string, dto: UpdateQueueStatusDto): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.QueueStatus;
        barberId: string;
        customerId: string;
        appointmentId: string | null;
        queuePosition: number;
        joinedAt: Date;
    }>;
    getNextCustomer(barberId: string): Promise<{
        customer: {
            user: {
                fullName: string;
                phoneNumber: string;
                id: string;
                role: import("@prisma/client").$Enums.UserRole;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            favoriteBarberId: string | null;
        };
        appointment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            barberId: string;
            appointmentDate: Date;
            notes: string | null;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            customerId: string;
        } | null;
    } & {
        id: string;
        status: import("@prisma/client").$Enums.QueueStatus;
        barberId: string;
        customerId: string;
        appointmentId: string | null;
        queuePosition: number;
        joinedAt: Date;
    }>;
    getMyQueue(userId: string): Promise<({
        barber: {
            user: {
                fullName: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            status: import("@prisma/client").$Enums.BarberStatus;
            photoUrl: string | null;
        };
        appointment: {
            id: string;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            appointmentDate: Date;
        } | null;
    } & {
        id: string;
        status: import("@prisma/client").$Enums.QueueStatus;
        barberId: string;
        customerId: string;
        appointmentId: string | null;
        queuePosition: number;
        joinedAt: Date;
    })[]>;
}
