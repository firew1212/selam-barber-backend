import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const phoneNumber = dto.phoneNumber.trim();

    const existingUser =
      await this.prisma.user.findUnique({
        where: {
          phoneNumber,
        },
      });

    if (existingUser) {
      throw new BadRequestException(
        'Phone number already exists',
      );
    }

    const hashedPassword =
      await bcrypt.hash(dto.password, 10);

    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullName: dto.fullName.trim(),
          phoneNumber,
          passwordHash: hashedPassword,
          role: 'CUSTOMER',
        },
      });

      await tx.customer.create({
        data: {
          userId: user.id,
        },
      });
    });

    return {
      message: 'Registration successful',
    };
  }

  async login(dto: LoginDto) {
    const phoneNumber = dto.phoneNumber.trim();

    const user =
      await this.prisma.user.findUnique({
        where: {
          phoneNumber,
        },
      });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'This account is inactive',
      );
    }

    const passwordMatch =
      await bcrypt.compare(
        dto.password,
        user.passwordHash,
      );

    if (!passwordMatch) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const accessToken =
      await this.jwtService.signAsync({
        sub: user.id,
        phoneNumber: user.phoneNumber,
        role: user.role,
      });

    return {
      accessToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    };
  }
async getProfile(userId: string) {
  const user = await this.prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      fullName: true,
      phoneNumber: true,
      role: true,
      isActive: true,
    },
  });

  if (!user) {
    throw new UnauthorizedException(
      'User account not found',
    );
  }

  return user;
}

}