import { Role } from '@prisma/client';
import { Request } from 'express';

export interface JwtPayload {
  staffId: string;
  email: string;
  role: Role;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthRequest extends Request {
  staff: JwtPayload;
}