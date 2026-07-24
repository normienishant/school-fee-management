import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@school.edu';
  const existingAdmin = await prisma.staff.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await prisma.staff.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'School Admin',
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin user created: admin@school.edu / Admin@123');
  }

  const counter = await prisma.receiptCounter.findUnique({
    where: { id: 'single' },
  });
  if (!counter) {
    await prisma.receiptCounter.create({
      data: { id: 'single', currentNumber: 0 },
    });
    console.log('✅ Receipt counter initialized');
  }

  console.log('🌱 Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });