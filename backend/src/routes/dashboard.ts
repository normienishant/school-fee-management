import express from 'express';
import prisma from '../prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
router.use(authMiddleware);

router.get('/summary', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const totalStudents = await prisma.student.count();
  const totalDefaulters = await prisma.student.count({
    where: { pendingBalance: { gt: 0 } },
  });

  const todayPayments = await prisma.payment.aggregate({
    where: {
      date: { gte: today, lt: tomorrow },
      isVoid: false,
    },
    _sum: { amount: true },
  });

  const totalBilled = await prisma.student.aggregate({
    _sum: { totalFee: true },
  });

  const totalCollected = await prisma.student.aggregate({
    _sum: { paidFee: true },
  });

  const totalOutstanding = await prisma.student.aggregate({
    _sum: { pendingBalance: true },
  });

  res.json({
    success: true,
    data: {
      totalStudents,
      totalDefaulters,
      todayCollection: todayPayments._sum.amount || 0,
      totalBilled: totalBilled._sum.totalFee || 0,
      totalCollected: totalCollected._sum.paidFee || 0,
      totalOutstanding: totalOutstanding._sum.pendingBalance || 0,
    },
  });
});

export default router;