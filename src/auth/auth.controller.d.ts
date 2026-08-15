import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    profile(user: any): Promise<{
        fullName: string;
        phoneNumber: string;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        isActive: boolean;
    }>;
}
