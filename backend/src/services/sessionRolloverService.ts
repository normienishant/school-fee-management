import prisma from '../prisma/client';
import { createAuditLog } from './auditService';
import { computeStudentTotalFee } from './feeCalculationService';
import { Prisma } from '@prisma/client';

export const rolloverSession = async (newAcademicYear: string, staffId: string) => {
  return await prisma.$transaction(async (tx) => {
    const currentSession = await tx.session.findFirst({
      where: { isActive: true },
    });
    if (!currentSession) throw new Error('No active session found');

    const activeStudents = await tx.student.findMany({
      where: { status: 'ACTIVE' },
    });

    const archives = activeStudents.map((student) => ({
      studentId: student.id,
      name: student.name,
      rollNumber: student.rollNumber,
      gradeClass: student.gradeClass,
      totalFee: student.totalFee,
      paidFee: student.paidFee,
      pendingBalance: student.pendingBalance,
      openingBalance: student.openingBalance,
      feeBreakdown: student.feeBreakdown === null ? Prisma.JsonNull : student.feeBreakdown,
      sessionId: currentSession.id,
    }));

    await tx.studentArchive.createMany({
      data: archives,
    });

    const newSession = await tx.session.create({
      data: {
        academicYear: newAcademicYear,
        startDate: new Date(new Date().getFullYear(), 3, 1),
        endDate: new Date(new Date().getFullYear() + 1, 2, 31),
        isActive: true,
      },
    });

    await tx.session.update({
      where: { id: currentSession.id },
      data: { isActive: false },
    });

    for (const student of activeStudents) {
      const openingBalance = student.pendingBalance;
      const newTotalFee = await computeStudentTotalFee(student);
      await tx.student.update({
        where: { id: student.id },
        data: {
          totalFee: newTotalFee,
          paidFee: 0,
          pendingBalance: openingBalance,
          openingBalance: openingBalance,
          feeBreakdown: Prisma.JsonNull,
          status: 'ACTIVE',
        },
      });
    }

    await createAuditLog(staffId, 'ROLLOVER', 'Session', newSession.id, {
      from: currentSession.academicYear,
      to: newAcademicYear,
    });

    return newSession;
  });
};