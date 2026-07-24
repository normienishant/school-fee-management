import prisma from '../prisma/client';
import { ReminderChannel } from '@prisma/client';
import logger from '../utils/logger';

export const sendReminder = async (studentId: string, channel: ReminderChannel, message: string) => {
  const reminder = await prisma.reminder.create({
    data: {
      studentId,
      channel,
      message,
      status: 'PENDING',
    },
  });

  try {
    logger.info(`Reminder sent to student ${studentId} via ${channel}`);
    await prisma.reminder.update({
      where: { id: reminder.id },
      data: { status: 'SENT', sentAt: new Date() },
    });
  } catch (err) {
    logger.error(`Reminder failed: ${err}`);
    await prisma.reminder.update({
      where: { id: reminder.id },
      data: { status: 'FAILED' },
    });
  }

  return reminder;
};