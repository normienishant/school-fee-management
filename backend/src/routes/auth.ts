import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const staff = await prisma.staff.findUnique({ where: { email } });
      if (!staff) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, staff.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      const secret = process.env.JWT_SECRET || 'defaultSecretKey';
      
      // ✅ FINAL FIX: Cast options to any to bypass type strictness
      const token = jwt.sign(
        { staffId: staff.id, email: staff.email, role: staff.role },
        secret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
      );

      res.json({
        success: true,
        data: {
          token,
          staff: { id: staff.id, name: staff.name, email: staff.email, role: staff.role },
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  }
);

export default router;