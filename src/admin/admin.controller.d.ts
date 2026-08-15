import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
        users: {
            total: number;
            customers: number;
            barbers: number;
        };
        barbers: {
            total: number;
            available: number;
        };
        services: {
            total: number;
            active: number;
        };
        appointments: {
            total: number;
            today: number;
        };
        payments: {
            pending: number;
            revenue: number | import("@prisma/client/runtime/library").Decimal;
        };
        reviews: {
            total: number;
        };
    }>;
    getUsers(): Promise<{
        fullName: string;
        phoneNumber: string;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getUser(id: string): Promise<{
        customer: {
            id: string;
        } | null;
        barber: {
            id: string;
            status: import("@prisma/client").$Enums.BarberStatus;
            photoUrl: string | null;
        } | null;
        fullName: string;
        phoneNumber: string;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    setUserActive(id: string, isActive: boolean): Promise<{
        fullName: string;
        phoneNumber: string;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
    }>;
    getBarbers(): Promise<({
        user: {
            fullName: string;
            phoneNumber: string;
            id: string;
            role: import("@prisma/client").$Enums.UserRole;
            isActive: boolean;
        };
        vacations: {
            id: string;
            createdAt: Date;
            startDate: Date;
            endDate: Date;
            reason: string | null;
            barberId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.BarberStatus;
        photoUrl: string | null;
    })[]>;
    getBarber(id: string): Promise<{
        user: {
            fullName: string;
            phoneNumber: string;
            id: string;
            role: import("@prisma/client").$Enums.UserRole;
            isActive: boolean;
        };
        vacations: {
            id: string;
            createdAt: Date;
            startDate: Date;
            endDate: Date;
            reason: string | null;
            barberId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.BarberStatus;
        photoUrl: string | null;
    }>;
    getCustomers(): Promise<({
        user: {
            fullName: string;
            phoneNumber: string;
            id: string;
            role: import("@prisma/client").$Enums.UserRole;
            isActive: boolean;
            createdAt: Date;
        };
        favoriteBarber: ({
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
        }) | null;
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        favoriteBarberId: string | null;
    })[]>;
    getAppointments(): Promise<({
        customer: {
            user: {
                fullName: string;
                phoneNumber: string;
                id: string;
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
                phoneNumber: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            status: import("@prisma/client").$Enums.BarberStatus;
            photoUrl: string | null;
        };
        queueEntry: {
            id: string;
            status: import("@prisma/client").$Enums.QueueStatus;
            barberId: string;
            customerId: string;
            appointmentId: string | null;
            queuePosition: number;
            joinedAt: Date;
        } | null;
        review: {
            id: string;
            createdAt: Date;
            barberId: string;
            customerId: string;
            appointmentId: string;
            rating: number;
            comment: string | null;
        } | null;
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
        payments: {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            appointmentId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentType: import("@prisma/client").$Enums.PaymentType;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            paidAt: Date | null;
        }[];
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
    })[]>;
    getQueue(): Promise<({
        customer: {
            user: {
                fullName: string;
                phoneNumber: string;
                id: string;
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
    })[]>;
    getPayments(): Promise<({
        appointment: {
            customer: {
                user: {
                    fullName: string;
                    phoneNumber: string;
                    id: string;
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
        };
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        appointmentId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import("@prisma/client").$Enums.PaymentType;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paidAt: Date | null;
    })[]>;
    getReviews(): Promise<({
        customer: {
            user: {
                fullName: string;
                phoneNumber: string;
                id: string;
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
        };
    } & {
        id: string;
        createdAt: Date;
        barberId: string;
        customerId: string;
        appointmentId: string;
        rating: number;
        comment: string | null;
    })[]>;
    getServices(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
    }[]>;
}
