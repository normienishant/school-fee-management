import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import prisma from '../prisma/client';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';

const router = express.Router();
router.use(authMiddleware);

router.get('/fee-structures', requireRole(['ADMIN']), async (req, res) => {
  const structures = await prisma.feeStructure.findMany({
    orderBy: { effectiveFrom: 'desc' },
  });
  res.json({ success: true, data: structures });
});

router.post(
  '/fee-structures',
  requireRole(['ADMIN']),
  validate([
    body('gradeClass').notEmpty(),
    body('feeHeads').isArray(),
  ]),
  async (req, res) => {
    try {
      const structure = await prisma.feeStructure.create({
        data: {
          gradeClass: req.body.gradeClass,
          feeHeads: req.body.feeHeads,
          discountRules: req.body.discountRules || {},
          lateFeeRules: req.body.lateFeeRules || {},
        },
      });
      res.status(201).json({ success: true, data: structure });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
);

export default router;