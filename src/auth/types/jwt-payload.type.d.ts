import { UserRole } from '@prisma/client';
export type JwtPayload = {
    sub: string;
    phoneNumber: string;
    role: UserRole;
};
