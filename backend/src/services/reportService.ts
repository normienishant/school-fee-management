import prisma from '../prisma/client';

export const getDailyCollectionReport = async (date: string) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const payments = await prisma.payment.findMany({
    where: {
      date: { gte: start, lte: end },
      isVoid: false,
    },
    include: { student: true, staff: true },
    orderBy: { date: 'asc' },
  });

  return payments;
};

export const getOutstandingReport = async () => {
  const students = await prisma.student.findMany({
    where: { pendingBalance: { gt: 0 } },
    orderBy: { pendingBalance: 'desc' },
  });
  return students;
};

export const convertToCSV = (data: any[]) => {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).join(','));
  return [headers, ...rows].join('\n');
};