import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(req: any, dto: CreatePaymentDto): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        appointmentId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import("@prisma/client").$Enums.PaymentType;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paidAt: Date | null;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
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
        status: import("@prisma/client").$Enums.PaymentStatus;
        appointmentId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import("@prisma/client").$Enums.PaymentType;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paidAt: Date | null;
    })[]>;
    findOne(req: any, id: string): Promise<{
        appointment: {
            customer: {
                id: string;
                createdAt: Date;
                userId: string;
                favoriteBarberId: string | null;
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
    }>;
    markAsPaid(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        appointmentId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import("@prisma/client").$Enums.PaymentType;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paidAt: Date | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.PaymentStatus;
        appointmentId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentType: import("@prisma/client").$Enums.PaymentType;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paidAt: Date | null;
    }>;
}
