import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
export declare class AppointmentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateAppointmentDto): Promise<{
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
    }>;
    getMyAppointments(userId: string): Promise<({
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
    findAll(): Promise<({
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
    findOne(id: string): Promise<{
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
    }>;
    updateStatus(id: string, dto: UpdateAppointmentStatusDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        barberId: string;
        appointmentDate: Date;
        notes: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        customerId: string;
    }>;
    cancelForCustomer(appointmentId: string, userId: string): Promise<{
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
    }>;
    private appointmentStatusToQueueStatus;
}
