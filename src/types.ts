export type PaymentStatus = 'PAID' | 'PARTIAL' | 'OVERDUE' | 'UNPAID';

export type PaymentMode = 'Cash' | 'UPI / GPay' | 'Bank Transfer' | 'Cheque';

export type FeeCategory = 'Tuition Fee' | 'Transport' | 'Exam Fee' | 'Lab & Activity' | 'Uniform & Books' | 'Annual Charges';

export interface FeeBreakdown {
  tuitionFee: number;
  transportFee: number;
  examFee: number;
  activityFee: number;
  discount: number;
}

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  gradeClass: string; // e.g. "Grade 5-A", "Grade 8-B"
  section: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  totalFee: number;
  paidFee: number;
  pendingBalance: number;
  status: PaymentStatus;
  feeBreakdown: FeeBreakdown;
  dueDate: string;
  lastPaymentDate?: string;
  address?: string;
}

export interface PaymentTransaction {
  id: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  gradeClass: string;
  amount: number;
  date: string; // ISO date string or formatted date
  paymentMode: PaymentMode;
  transactionRef?: string; // UPI Ref # or Cheque #
  feeType: string; // e.g., "Q2 Tuition + Transport"
  receivedBy: string; // Staff member name
  notes?: string;
  parentPhone: string;
}

export interface NotificationLog {
  id: string;
  studentId: string;
  studentName: string;
  parentPhone: string;
  channel: 'WhatsApp' | 'SMS' | 'Email';
  type: 'Receipt' | 'Reminder' | 'Overdue Alert';
  message: string;
  sentAt: string;
  status: 'Delivered' | 'Pending' | 'Failed';
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Accountant' | 'Principal' | 'Admin Clerk' | 'Fee Collector';
  email: string;
  phone: string;
  active: boolean;
}

export interface ClassFeeStructure {
  gradeClass: string;
  tuitionFee: number;
  transportFee: number;
  examFee: number;
  activityFee: number;
  totalAnnualFee: number;
}

export interface SchoolInfo {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  academicYear: string;
  bankDetails: {
    bankName: string;
    accountNo: string;
    ifscCode: string;
    upiId: string;
  };
}
