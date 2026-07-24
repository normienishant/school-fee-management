import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { sendReminder } from '../services/reminderService';
import prisma from '../prisma/client';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';

const router = express.Router();
router.use(authMiddleware);

router.post(
  '/send',
  validate([
    body('studentId').notEmpty(),
    body('channel').isIn(['WHATSAPP', 'SMS', 'EMAIL']),
    body('message').notEmpty(),
  ]),
  async (req, res) => {
    try {
      const reminder = await sendReminder(req.body.studentId, req.body.channel, req.body.message);
      res.json({ success: true, data: reminder });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
);

router.get('/student/:studentId', async (req, res) => {
  const reminders = await prisma.reminder.findMany({
    where: { studentId: req.params.studentId },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: reminders });
});

export default router;