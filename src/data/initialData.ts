import { Student, PaymentTransaction, StaffMember, ClassFeeStructure, SchoolInfo, NotificationLog } from '../types';

export const initialSchoolInfo: SchoolInfo = {
  name: "St. Jude Public School",
  tagline: "Excellence in Education & Character",
  address: "42 Knowledge Park Road, Sector 12, Metro City",
  phone: "+91 98765 43210 / 011-25539011",
  email: "accounts@stjudeschool.edu",
  academicYear: "2026-2027",
  bankDetails: {
    bankName: "State Bank of India",
    accountNo: "30891234567",
    ifscCode: "SBIN0004521",
    upiId: "stjude.school@sbi"
  }
};

export const initialStaffMembers: StaffMember[] = [
  { id: "STF-01", name: "Sarah Jenkins", role: "Accountant", email: "sarah.j@stjudeschool.edu", phone: "+91 98765 00001", active: true },
  { id: "STF-02", name: "Robert Vance", role: "Principal", email: "principal@stjudeschool.edu", phone: "+91 98765 00002", active: true },
  { id: "STF-03", name: "Meera Sharma", role: "Fee Collector", email: "meera.s@stjudeschool.edu", phone: "+91 98765 00003", active: true },
  { id: "STF-04", name: "David Ross", role: "Admin Clerk", email: "david.r@stjudeschool.edu", phone: "+91 98765 00004", active: true },
  { id: "STF-05", name: "Anita Roy", role: "Accountant", email: "anita.r@stjudeschool.edu", phone: "+91 98765 00005", active: true },
  { id: "STF-06", name: "Karan Patel", role: "Admin Clerk", email: "karan.p@stjudeschool.edu", phone: "+91 98765 00006", active: true }
];

export const initialFeeStructures: ClassFeeStructure[] = [
  { gradeClass: "Grade 1", tuitionFee: 24000, transportFee: 6000, examFee: 2000, activityFee: 3000, totalAnnualFee: 35000 },
  { gradeClass: "Grade 2", tuitionFee: 24000, transportFee: 6000, examFee: 2000, activityFee: 3000, totalAnnualFee: 35000 },
  { gradeClass: "Grade 3", tuitionFee: 26000, transportFee: 6000, examFee: 2500, activityFee: 3500, totalAnnualFee: 38000 },
  { gradeClass: "Grade 4", tuitionFee: 26000, transportFee: 6000, examFee: 2500, activityFee: 3500, totalAnnualFee: 38000 },
  { gradeClass: "Grade 5", tuitionFee: 28000, transportFee: 7000, examFee: 3000, activityFee: 4000, totalAnnualFee: 42000 },
  { gradeClass: "Grade 6", tuitionFee: 30000, transportFee: 7000, examFee: 3000, activityFee: 4000, totalAnnualFee: 44000 },
  { gradeClass: "Grade 7", tuitionFee: 32000, transportFee: 8000, examFee: 3500, activityFee: 4500, totalAnnualFee: 48000 },
  { gradeClass: "Grade 8", tuitionFee: 34000, transportFee: 8000, examFee: 3500, activityFee: 4500, totalAnnualFee: 50000 },
  { gradeClass: "Grade 9", tuitionFee: 38000, transportFee: 9000, examFee: 4000, activityFee: 5000, totalAnnualFee: 56000 },
  { gradeClass: "Grade 10", tuitionFee: 42000, transportFee: 9000, examFee: 5000, activityFee: 5000, totalAnnualFee: 61000 },
];

const studentFirstNames = [
  "Aarav", "Ananya", "Vihaan", "Aditi", "Reyansh", "Diya", "Arjun", "Saisha", "Dhruv", "Isha",
  "Kabir", "Riya", "Ayaan", "Pari", "Krishna", "Kiara", "Ishaan", "Avani", "Rohan", "Sanya",
  "Dev", "Myra", "Atharv", "Anvi", "Aditya", "Tanvi", "Yash", "Kavya", "Rahul", "Prisha",
  "Kunal", "Meera", "Siddharth", "Aharva", "Samaira", "Nikhil", "Shreya", "Aryan", "Pooja", "Vikram",
  "Zara", "Neel", "Tanya", "Harsh", "Sneha", "Karan", "Kavita", "Gaurav", "Nisha", "Manav"
];

const studentLastNames = [
  "Sharma", "Verma", "Gupta", "Patel", "Singh", "Kumar", "Reddy", "Joshi", "Mehta", "Shah",
  "Nair", "Rao", "Chopra", "Malhotra", "Bhatia", "Deshmukh", "Pillai", "Agarwal", "Bansal", "Saxena"
];

// Helper to generate 120 realistic student records
export const generateStudents = (): Student[] => {
  const students: Student[] = [];
  let count = 1;

  const grades = [
    { name: "Grade 1-A", total: 35000, tuition: 24000, transport: 6000, exam: 2000, activity: 3000 },
    { name: "Grade 2-A", total: 35000, tuition: 24000, transport: 6000, exam: 2000, activity: 3000 },
    { name: "Grade 3-A", total: 38000, tuition: 26000, transport: 6000, exam: 2500, activity: 3500 },
    { name: "Grade 4-A", total: 38000, tuition: 26000, transport: 6000, exam: 2500, activity: 3500 },
    { name: "Grade 5-A", total: 42000, tuition: 28000, transport: 7000, exam: 3000, activity: 4000 },
    { name: "Grade 6-A", total: 44000, tuition: 30000, transport: 7000, exam: 3000, activity: 4000 },
    { name: "Grade 7-A", total: 48000, tuition: 32000, transport: 8000, exam: 3500, activity: 4500 },
    { name: "Grade 8-A", total: 50000, tuition: 34000, transport: 8000, exam: 3500, activity: 4500 },
    { name: "Grade 9-A", total: 56000, tuition: 38000, transport: 9000, exam: 4000, activity: 5000 },
    { name: "Grade 10-A", total: 61000, tuition: 42000, transport: 9000, exam: 5000, activity: 5000 }
  ];

  for (const grade of grades) {
    for (let i = 1; i <= 12; i++) {
      const fn = studentFirstNames[(count * 7) % studentFirstNames.length];
      const ln = studentLastNames[(count * 11) % studentLastNames.length];
      const name = `${fn} ${ln}`;
      const parentFn = studentFirstNames[(count * 3) % studentFirstNames.length];
      const parentName = `${parentFn} ${ln}`;
      const rollNo = `STU-2026-${String(count).padStart(3, '0')}`;
      const phoneDigits = 9800000000 + (count * 12345) % 899999999;
      let parentPhone = `+91 ${phoneDigits}`;
      let parentEmail = `${parentFn.toLowerCase()}.${ln.toLowerCase()}@gmail.com`;

      let paid = 0;
      let status: Student['status'] = 'UNPAID';
      const rand = (count * 17) % 100;
      let discount = 0;

      if (count % 15 === 0) {
        discount = 5000;
      }

      // Preset demo numbers & emails for live presentation testing
      if (count === 1) {
        parentPhone = "+91 9871610154";
        parentEmail = "yashsaini1919@gmail.com";
        status = 'OVERDUE';
        paid = 13000;
      } else if (count === 2) {
        parentPhone = "+91 9625784184";
        parentEmail = "yashsaini@8vdigital.com";
        status = 'OVERDUE';
        paid = 16500;
      } else if (count === 3) {
        parentPhone = "+91 9871610154";
        parentEmail = "yashsaini1919@gmail.com";
        status = 'UNPAID';
        paid = 0;
      } else if (count === 4) {
        parentPhone = "+91 9625784184";
        parentEmail = "yashsaini@8vdigital.com";
        status = 'PARTIAL';
        paid = 20000;
      }

      const totalEffective = grade.total - discount;

      if (rand < 60) {
        paid = totalEffective;
        status = 'PAID';
      } else if (rand < 85) {
        paid = Math.round(totalEffective * 0.5 / 1000) * 1000;
        status = 'PARTIAL';
      } else if (rand < 95) {
        paid = Math.round(totalEffective * 0.2 / 1000) * 1000;
        status = 'OVERDUE';
      } else {
        paid = 0;
        status = 'UNPAID';
      }

      const pending = Math.max(0, totalEffective - paid);
      const daysAgo = (count * 3) % 45 + 1;
      const lastPaymentDate = paid > 0 
        ? new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : undefined;

      students.push({
        id: `STU-${count}`,
        rollNumber: rollNo,
        name,
        gradeClass: grade.name,
        section: "A",
        parentName,
        parentPhone,
        parentEmail,
        totalFee: totalEffective,
        paidFee: paid,
        pendingBalance: pending,
        status,
        feeBreakdown: {
          tuitionFee: grade.tuition,
          transportFee: grade.transport,
          examFee: grade.exam,
          activityFee: grade.activity,
          discount
        },
        dueDate: "2026-07-15",
        lastPaymentDate,
        address: `${10 + (count % 80)} Park Avenue, Block ${String.fromCharCode(65 + (count % 6))}, Metro City`
      });

      count++;
    }
  }

  return students;
};

export const initialStudents: Student[] = generateStudents();

export const initialTransactions: PaymentTransaction[] = [
  {
    id: "TXN-1001",
    receiptNumber: "REC-2026-001",
    studentId: "STU-1",
    studentName: "Aarav Sharma",
    rollNumber: "STU-2026-001",
    gradeClass: "Grade 1-A",
    amount: 35000,
    date: "2026-07-02",
    paymentMode: "UPI / GPay",
    transactionRef: "UPI/31920841290",
    feeType: "Full Annual Tuition + Transport",
    receivedBy: "Sarah Jenkins",
    notes: "Paid via GPay. Full year settlement.",
    parentPhone: "+91 9812345678"
  },
  {
    id: "TXN-1002",
    receiptNumber: "REC-2026-002",
    studentId: "STU-13",
    studentName: "Kabir Gupta",
    rollNumber: "STU-2026-013",
    gradeClass: "Grade 2-A",
    amount: 17500,
    date: "2026-07-05",
    paymentMode: "Cash",
    feeType: "Term 1 Fee (50%)",
    receivedBy: "Meera Sharma",
    notes: "Cash received at desk. Remaining due Sept 30.",
    parentPhone: "+91 9823456789"
  },
  {
    id: "TXN-1003",
    receiptNumber: "REC-2026-003",
    studentId: "STU-25",
    studentName: "Aditya Singh",
    rollNumber: "STU-2026-025",
    gradeClass: "Grade 3-A",
    amount: 38000,
    date: "2026-07-08",
    paymentMode: "Bank Transfer",
    transactionRef: "NEFT-N32019401",
    feeType: "Full Fee Payment",
    receivedBy: "Sarah Jenkins",
    notes: "NEFT transfer directly into SBI account.",
    parentPhone: "+91 9834567890"
  },
  {
    id: "TXN-1004",
    receiptNumber: "REC-2026-004",
    studentId: "STU-49",
    studentName: "Zara Patel",
    rollNumber: "STU-2026-049",
    gradeClass: "Grade 5-A",
    amount: 21000,
    date: "2026-07-10",
    paymentMode: "Cheque",
    transactionRef: "CHQ #002914 - HDFC Bank",
    feeType: "Term 1 Fee",
    receivedBy: "Anita Roy",
    notes: "Cheque cleared on July 12.",
    parentPhone: "+91 9845678901"
  },
  {
    id: "TXN-1005",
    receiptNumber: "REC-2026-005",
    studentId: "STU-61",
    studentName: "Ayaan Malhotra",
    rollNumber: "STU-2026-061",
    gradeClass: "Grade 6-A",
    amount: 44000,
    date: "2026-07-14",
    paymentMode: "UPI / GPay",
    transactionRef: "UPI/31980291012",
    feeType: "Full Fee Payment",
    receivedBy: "Sarah Jenkins",
    notes: "Online UPI payment via Parent Portal link.",
    parentPhone: "+91 9856789012"
  },
  {
    id: "TXN-1006",
    receiptNumber: "REC-2026-006",
    studentId: "STU-109",
    studentName: "Aryan Saxena",
    rollNumber: "STU-2026-109",
    gradeClass: "Grade 10-A",
    amount: 30000,
    date: "2026-07-20",
    paymentMode: "Cash",
    feeType: "Partial Tuition & Exam Fee",
    receivedBy: "Meera Sharma",
    notes: "Cash collected at counter. Receipt handed over.",
    parentPhone: "+91 9867890123"
  }
];

export const initialNotifications: NotificationLog[] = [
  {
    id: "NOTIF-01",
    studentId: "STU-13",
    studentName: "Kabir Gupta",
    parentPhone: "+91 9823456789",
    channel: "WhatsApp",
    type: "Receipt",
    message: "Dear Parent, thank you for paying ₹17,500 towards Kabir Gupta's fee. Receipt #REC-2026-002 generated.",
    sentAt: "2026-07-05 11:30 AM",
    status: "Delivered"
  },
  {
    id: "NOTIF-02",
    studentId: "STU-109",
    studentName: "Aryan Saxena",
    parentPhone: "+91 9867890123",
    channel: "SMS",
    type: "Reminder",
    message: "St. Jude School Fee Alert: ₹31,000 pending for Aryan Saxena (Grade 10-A). Due date was 15th July.",
    sentAt: "2026-07-18 04:15 PM",
    status: "Delivered"
  }
];
