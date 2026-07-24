import express from 'express';
import prisma from '../prisma/client';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import { computeStudentTotalFee } from '../services/feeCalculationService';
import { createAuditLog } from '../services/auditService';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';

const router = express.Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { grade, status, search } = req.query;
  const where: any = {};
  if (grade) where.gradeClass = grade as string;
  if (status) where.status = status as string;
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { rollNumber: { contains: search as string, mode: 'insensitive' } },
      { parentPhone: { contains: search as string } },
    ];
  }

  const students = await prisma.student.findMany({
    where,
    orderBy: { name: 'asc' },
  });
  res.json({ success: true, data: students });
});

router.get('/:id', async (req, res) => {
  const student = await prisma.student.findUnique({
    where: { id: req.params.id },
    include: { transactions: true, instalments: true },
  });
  if (!student) {
    return res.status(404).json({ success: false, error: 'Student not found' });
  }
  res.json({ success: true, data: student });
});

router.post(
  '/',
  requireRole(['ADMIN']),
  validate([
    body('name').notEmpty(),
    body('gradeClass').notEmpty(),
    body('parentName').notEmpty(),
    body('parentPhone').notEmpty(),
    body('enrollmentDate').isISO8601().toDate(),
  ]),
  async (req, res) => {
    const { name, gradeClass, section, parentName, parentPhone, parentEmail, enrollmentDate, siblings } = req.body;

    try {
      const count = await prisma.student.count({ where: { gradeClass } });
      const rollNumber = `${gradeClass.replace(/\s/g, '')}-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

      const totalFee = await computeStudentTotalFee({ gradeClass, enrollmentDate } as any);

      const student = await prisma.student.create({
        data: {
          rollNumber,
          name,
          gradeClass,
          section: section || 'A',
          parentName,
          parentPhone,
          parentEmail,
          enrollmentDate: new Date(enrollmentDate),
          totalFee,
          paidFee: 0,
          pendingBalance: totalFee,
          status: 'ACTIVE',
          siblings: siblings || [],
        },
      });

      await createAuditLog(req.staff.staffId, 'CREATE', 'Student', student.id, { student });

      res.status(201).json({ success: true, data: student });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
);

router.put('/:id', requireRole(['ADMIN']), async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  delete updates.id;

  try {
    const student = await prisma.student.update({
      where: { id },
      data: updates,
    });
    await createAuditLog(req.staff.staffId, 'UPDATE', 'Student', id, { updates });
    res.json({ success: true, data: student });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/:id', requireRole(['ADMIN']), async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.student.update({
      where: { id },
      data: { status: 'WITHDRAWN' },
    });
    await createAuditLog(req.staff.staffId, 'DELETE', 'Student', id, { action: 'soft_delete' });
    res.json({ success: true, message: 'Student withdrawn' });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;