import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import { rolloverSession } from '../services/sessionRolloverService';
import prisma from '../prisma/client';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';

const router = express.Router();
router.use(authMiddleware);

router.get('/active', async (req, res) => {
  const session = await prisma.session.findFirst({
    where: { isActive: true },
  });
  res.json({ success: true, data: session });
});

router.post(
  '/rollover',
  requireRole(['ADMIN']),
  validate([
    body('newAcademicYear').notEmpty(),
  ]),
  async (req, res) => {
    try {
      const result = await rolloverSession(req.body.newAcademicYear, req.staff.staffId);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
);

export default router;