export const generateRollNumber = (grade: string, count: number): string => {
  const year = new Date().getFullYear();
  const padded = String(count).padStart(4, '0');
  return `${grade.replace(/\s/g, '')}-${year}-${padded}`;
};

export const calculateProratedFee = (totalAnnualFee: number, enrollmentDate: Date, academicEndDate: Date): number => {
  const totalDays = (academicEndDate.getTime() - new Date(enrollmentDate.getFullYear(), 3, 1).getTime()) / (1000 * 3600 * 24);
  const remainingDays = (academicEndDate.getTime() - enrollmentDate.getTime()) / (1000 * 3600 * 24);
  return Math.round((totalAnnualFee * remainingDays) / totalDays);
};