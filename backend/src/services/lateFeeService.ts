import prisma from '../prisma/client';
import { DEFAULT_LATE_FEE_RULES } from '../utils/constants';
import logger from '../utils/logger';

export const applyLateFees = async () => {
  const today = new Date();
  const instalments = await prisma.instalment.findMany({
    where: {
      paid: false,
      dueDate: { lt: today },
      lateFee: 0,
    },
    include: { student: true },
  });

  for (const inst of instalments) {
    const graceDays = DEFAULT_LATE_FEE_RULES.graceDays;
    const dueDate = new Date(inst.dueDate);
    const daysLate = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24)) - graceDays);
    if (daysLate > 0) {
      const lateFeeAmount = DEFAULT_LATE_FEE_RULES.flatFee * daysLate;
      await prisma.instalment.update({
        where: { id: inst.id },
        data: { lateFee: lateFeeAmount },
      });
      logger.info(`Applied late fee of ₹${lateFeeAmount} for student ${inst.studentId}`);
    }
  }
};