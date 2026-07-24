import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export const requireRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const staff = (req as any).staff;
    if (!staff) {
      return res.status(401).json({ success: false, error: 'Unauthenticated' });
    }
    if (!allowedRoles.includes(staff.role)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }
    next();
  };
};