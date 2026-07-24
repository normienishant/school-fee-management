import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import { recordPayment, voidPayment } from '../services/paymentService';
import prisma from '../prisma/client';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';

const router = express.Router();
router.use(authMiddleware);

router.post(
  '/',
  requireRole(['CLERK', 'ADMIN']),
  validate([
    body('studentId').notEmpty(),
    body('amount').isFloat({ gt: 0 }),
    body('paymentMode').isIn(['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'REFUND']),
    body('feeType').notEmpty(),
    body('transactionRef').optional().isString(),
  ]),
  async (req, res) => {
    try {
      const payment = await recordPayment(
        {
          studentId: req.body.studentId,
          amount: req.body.amount,
          paymentMode: req.body.paymentMode,
          feeType: req.body.feeType,
          receivedBy: req.staff.staffId,
          transactionRef: req.body.transactionRef,
          notes: req.body.notes,
        },
        req.staff.staffId
      );
      res.status(201).json({ success: true, data: payment });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
);

router.post('/:id/void', requireRole(['ADMIN']), validate([
  body('reason').notEmpty(),
]), async (req, res) => {
  try {
    const result = await voidPayment(req.params.id, req.body.reason, req.staff.staffId);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/student/:studentId', async (req, res) => {
  const payments = await prisma.payment.findMany({
    where: {
      studentId: req.params.studentId,
      isVoid: false,
    },
    orderBy: { date: 'desc' },
  });
  res.json({ success: true, data: payments });
});

export default router;