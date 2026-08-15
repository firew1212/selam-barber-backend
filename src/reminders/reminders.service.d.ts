import { PrismaService } from '../prisma/prisma.service';
export declare class RemindersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    checkAppointments(): Promise<void>;
}
