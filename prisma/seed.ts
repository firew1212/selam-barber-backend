import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

const services = [
  {
    name: 'Classic Haircut',
    description: 'A clean, tailored cut finished to your style.',
    price: 100,
  },
  {
    name: 'Beard Trim',
    description: 'Precise shaping and finishing for a sharper beard.',
    price: 80,
  },
  {
    name: 'Hair Wash',
    description: 'A refreshing wash before or after your service.',
    price: 70,
  },
  {
    name: 'Hair Coloring',
    description: 'Professional color work for a fresh new look.',
    price: 200,
  },
];

function required(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required seed variable: ${name}`);
  }

  return value;
}

async function main() {
  const adminName = required('SEED_ADMIN_NAME');
  const adminPhone = required('SEED_ADMIN_PHONE');
  const adminPassword = required('SEED_ADMIN_PASSWORD');
  const barberName = required('SEED_BARBER_NAME');
  const barberPhone = required('SEED_BARBER_PHONE');
  const barberPassword = required('SEED_BARBER_PASSWORD');

  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service.name },
      update: {
        description: service.description,
        price: service.price,
        isActive: true,
      },
      create: service,
    });
  }

  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);
  const barberPasswordHash = await bcrypt.hash(barberPassword, 12);

  await prisma.user.upsert({
    where: { phoneNumber: adminPhone },
    update: {
      fullName: adminName,
      role: UserRole.ADMIN,
      isActive: true,
    },
    create: {
      fullName: adminName,
      phoneNumber: adminPhone,
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  const barberUser = await prisma.user.upsert({
    where: { phoneNumber: barberPhone },
    update: {
      fullName: barberName,
      role: UserRole.BARBER,
      isActive: true,
    },
    create: {
      fullName: barberName,
      phoneNumber: barberPhone,
      passwordHash: barberPasswordHash,
      role: UserRole.BARBER,
      isActive: true,
    },
  });

  await prisma.barber.upsert({
    where: { userId: barberUser.id },
    update: {
      status: 'AVAILABLE',
    },
    create: {
      userId: barberUser.id,
      status: 'AVAILABLE',
    },
  });

  console.log('Seed complete: services, admin account, and barber account are ready.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
