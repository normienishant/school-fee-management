import prisma from '../prisma/client';

export const getNextReceiptNumber = async (): Promise<string> => {
  const result = await prisma.$transaction(async (tx) => {
    const counter = await tx.receiptCounter.findUnique({
      where: { id: 'single' },
    });
    if (!counter) {
      throw new Error('Receipt counter not initialized');
    }
    const nextNumber = counter.currentNumber + 1;
    await tx.receiptCounter.update({
      where: { id: 'single' },
      data: { currentNumber: nextNumber },
    });
    return nextNumber;
  });

  const year = new Date().getFullYear();
  const padded = String(result).padStart(6, '0');
  return `REC-${year}-${padded}`;
};