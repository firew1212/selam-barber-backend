import { PrismaService } from '../prisma/prisma.service';
export declare class CustomerService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByUserId(userId: string): Promise<{
        user: {
            fullName: string;
            phoneNumber: string;
            id: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
        appointments: ({
            barber: {
                id: string;
                createdAt: Date;
                userId: string;
                status: import("@prisma/client").$Enums.BarberStatus;
                photoUrl: string | null;
            };
            services: ({
                service: {
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    price: import("@prisma/client/runtime/library").Decimal;
                };
            } & {
                serviceId: string;
                appointmentId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            barberId: string;
            appointmentDate: Date;
            notes: string | null;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            customerId: string;
        })[];
        favoriteBarber: {
            id: string;
            createdAt: Date;
            userId: string;
            status: import("@prisma/client").$Enums.BarberStatus;
            photoUrl: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        favoriteBarberId: string | null;
    }>;
    getProfile(userId: string): Promise<{
        user: {
            fullName: string;
            phoneNumber: string;
            id: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
        appointments: ({
            barber: {
                id: string;
                createdAt: Date;
                userId: string;
                status: import("@prisma/client").$Enums.BarberStatus;
                photoUrl: string | null;
            };
            services: ({
                service: {
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    price: import("@prisma/client/runtime/library").Decimal;
                };
            } & {
                serviceId: string;
                appointmentId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.AppointmentStatus;
            barberId: string;
            appointmentDate: Date;
            notes: string | null;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            customerId: string;
        })[];
        favoriteBarber: {
            id: string;
            createdAt: Date;
            userId: string;
            status: import("@prisma/client").$Enums.BarberStatus;
            photoUrl: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        favoriteBarberId: string | null;
    }>;
}
