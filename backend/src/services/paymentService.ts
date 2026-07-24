import prisma from '../prisma/client';
import { getNextReceiptNumber } from './receiptService';
import { createAuditLog } from './auditService';
import { PaymentMode } from '@prisma/client';

interface RecordPaymentInput {
  studentId: string;
  amount: number;
  paymentMode: PaymentMode;
  feeType: string;
  receivedBy: string;
  transactionRef?: string;
  notes?: string;
}

export const recordPayment = async (data: RecordPaymentInput, staffId: string) => {
  return await prisma.$transaction(async (tx) => {
    const student = await tx.student.findUnique({
      where: { id: data.studentId },
    });
    if (!student) throw new Error('Student not found');

    if (data.amount <= 0) throw new Error('Amount must be positive');
    if (data.amount > student.pendingBalance + student.openingBalance) {
      throw new Error('Amount exceeds total pending balance');
    }

    const receiptNumber = await getNextReceiptNumber();

    const payment = await tx.payment.create({
      data: {
        receiptNumber,
        studentId: data.studentId,
        amount: data.amount,
        paymentMode: data.paymentMode,
        transactionRef: data.transactionRef,
        feeType: data.feeType,
        receivedBy: data.receivedBy,
        notes: data.notes,
      },
    });

    const newPaid = student.paidFee + data.amount;
    const newPending = Math.max(0, student.pendingBalance - data.amount);
    await tx.student.update({
      where: { id: data.studentId },
      data: {
        paidFee: newPaid,
        pendingBalance: newPending,
        status: newPending === 0 ? 'PAID' : 'PARTIAL',
        updatedAt: new Date(),
      },
    });

    await createAuditLog(staffId, 'CREATE', 'Payment', payment.id, { payment });

    return payment;
  });
};

export const voidPayment = async (paymentId: string, reason: string, staffId: string) => {
  return await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { id: paymentId },
      include: { student: true },
    });
    if (!payment) throw new Error('Payment not found');
    if (payment.isVoid) throw new Error('Payment already void');

    const student = payment.student;
    const newPaid = student.paidFee - payment.amount;
    const newPending = student.pendingBalance + payment.amount;

    await tx.student.update({
      where: { id: student.id },
      data: {
        paidFee: newPaid,
        pendingBalance: newPending,
        status: newPending === 0 ? 'PAID' : 'PARTIAL',
      },
    });

    await tx.payment.update({
      where: { id: paymentId },
      data: {
        isVoid: true,
        voidReason: reason,
      },
    });

    await createAuditLog(staffId, 'VOID_PAYMENT', 'Payment', paymentId, { reason });

    return payment;
  });
};