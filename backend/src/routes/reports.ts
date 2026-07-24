import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { getDailyCollectionReport, getOutstandingReport, convertToCSV } from '../services/reportService';
import prisma from '../prisma/client';

const router = express.Router();
router.use(authMiddleware);

router.get('/daily', async (req, res) => {
  const date = req.query.date as string || new Date().toISOString().split('T')[0];
  const data = await getDailyCollectionReport(date);
  res.json({ success: true, data });
});

router.get('/outstanding', async (req, res) => {
  const data = await getOutstandingReport();
  res.json({ success: true, data });
});

router.get('/export/daily', async (req, res) => {
  const date = req.query.date as string || new Date().toISOString().split('T')[0];
  const data = await getDailyCollectionReport(date);
  const csv = convertToCSV(data);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=daily-collection-${date}.csv`);
  res.send(csv);
});

export default router;