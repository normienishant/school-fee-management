import prisma from '../prisma/client';
import logger from '../utils/logger';

export const createAuditLog = async (
  staffId: string,
  action: string,
  resource: string,
  recordId: string,
  changes?: any
) => {
  try {
    await prisma.auditLog.create({
      data: {
        staffId,
        action,
        resource,
        recordId,
        changes,
      },
    });
  } catch (err) {
    logger.error('Audit log creation failed:', err);
  }
};