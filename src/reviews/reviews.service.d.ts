import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateReviewDto): Promise<{
        id: string;
        createdAt: Date;
        barberId: string;
        customerId: string;
        appointmentId: string;
        rating: number;
        comment: string | null;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        customer: {
            id: string;
            createdAt: Date;
            userId: string;
            favoriteBarberId: string | null;
        };
        barber: {
            id: string;
            createdAt: Date;
            userId: string;
            status: import("@prisma/client").$Enums.BarberStatus;
            photoUrl: string | null;
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
    findBarberReviews(barberId: string): import("@prisma/client").Prisma.PrismaPromise<({
        customer: {
            id: string;
            createdAt: Date;
            userId: string;
            favoriteBarberId: string | null;
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
}
