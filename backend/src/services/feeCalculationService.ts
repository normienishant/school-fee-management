import prisma from '../prisma/client';
import { Student } from '@prisma/client';

export const computeStudentTotalFee = async (student: Pick<Student, 'gradeClass' | 'enrollmentDate'>): Promise<number> => {
  const feeStructure = await prisma.feeStructure.findFirst({
    where: { gradeClass: student.gradeClass },
    orderBy: { effectiveFrom: 'desc' },
  });

  if (!feeStructure) {
    throw new Error(`No fee structure found for grade ${student.gradeClass}`);
  }

  const feeHeads = feeStructure.feeHeads as Array<{ name: string; amount: number; isProratable: boolean }>;
  let total = 0;
  const enrollmentDate = new Date(student.enrollmentDate);
  const sessionEnd = new Date(enrollmentDate.getFullYear(), 11, 31);

  for (const head of feeHeads) {
    if (head.isProratable) {
      const totalDays = (sessionEnd.getTime() - new Date(enrollmentDate.getFullYear(), 3, 1).getTime()) / (1000 * 3600 * 24);
      const remainingDays = (sessionEnd.getTime() - enrollmentDate.getTime()) / (1000 * 3600 * 24);
      const prorated = (head.amount * remainingDays) / totalDays;
      total += prorated;
    } else {
      total += head.amount;
    }
  }

  return Math.round(total);
};