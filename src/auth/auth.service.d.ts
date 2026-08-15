import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            fullName: string;
            phoneNumber: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    getProfile(userId: string): Promise<{
        fullName: string;
        phoneNumber: string;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
    }>;
}
