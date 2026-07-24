import React from 'react';
import { Student, PaymentTransaction } from '../types';
import { 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  CreditCard, 
  Receipt, 
  ChevronRight, 
  Eye, 
  PlusCircle,
  TrendingUp,
  MessageCircle,
  HelpCircle
} from 'lucide-react';

interface DashboardProps {
  students: Student[];
  transactions: PaymentTransaction[];
  onOpenPaymentModal: (student?: Student) => void;
  onViewLedger: (student: Student) => void;
  onViewReceipt: (tx: PaymentTransaction) => void;
  onNavigateToStudents: () => void;
  onNavigateToReminders: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  students,
  transactions,
  onOpenPaymentModal,
  onViewLedger,
  onViewReceipt,
  onNavigateToStudents,
  onNavigateToReminders,
}) => {
  // Financial Analytics
  const totalBilled = students.reduce((sum, s) => sum + s.totalFee, 0);
  const totalCollected = students.reduce((sum, s) => sum + s.paidFee, 0);
  const totalOutstanding = students.reduce((sum, s) => sum + s.pendingBalance, 0);
  const collectionPercentage = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  const totalDefaulters = students.filter(s => s.pendingBalance > 0).length;

  // Breakdown by mode
  const modeTotals = transactions.reduce((acc, tx) => {
    acc[tx.paymentMode] = (acc[tx.paymentMode] || 0) + tx.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Banner & Quick Action Helper */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>School Dues & Accounting Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Fee Management Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time tracking of cash flow, outstanding dues, cashier receipt vouchers, and parent notification alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onNavigateToReminders}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Send Notices ({totalDefaulters})</span>
          </button>

          <button
            onClick={() => onOpenPaymentModal()}
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Collect Fee Payment</span>
          </button>
        </div>
      </div>

      {/* Quick Assist Hint Box */}
      <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-3.5 text-xs text-teal-900 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-teal-500 text-slate-950 rounded-lg shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <strong className="font-bold text-slate-900">Non-Technical Staff Guide:</strong> Press <kbd className="bg-white border border-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shadow-2xs">Ctrl + K</kbd> anywhere to search students instantly by name, roll number, or phone!
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Billed */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Fee Billed</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              ₹{totalBilled.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block font-medium">Academic Year Expected</span>
          </div>
        </div>

        {/* Total Collected */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Total Collected</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
              ₹{totalCollected.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] font-bold text-emerald-700">{collectionPercentage}% Realized</span>
              <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(100, collectionPercentage)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Total Outstanding */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Outstanding Dues</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight">
              ₹{totalOutstanding.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] font-bold text-rose-500 mt-1 block">
              {totalDefaulters} Student{totalDefaulters === 1 ? '' : 's'} Pending
            </span>
          </div>
        </div>

        {/* Total Students */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enrolled Students</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {students.length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block font-medium">Active School Roll</span>
          </div>
        </div>

      </div>

      {/* Payment Mode Collection Breakdown */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center space-x-2">
          <CreditCard className="w-4 h-4 text-teal-600" />
          <span>Collections by Payment Instrument</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['UPI / GPay', 'Cash', 'Bank Transfer', 'Cheque'].map((mode) => {
            const amount = modeTotals[mode] || 0;
            return (
              <div key={mode} className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                <span className="text-[11px] font-bold text-slate-500 block">{mode}</span>
                <span className="text-sm sm:text-base font-black text-slate-900 block mt-0.5">
                  ₹{amount.toLocaleString('en-IN')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions & Outstanding Dues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-teal-600" />
                <span>Recent Payment Transactions</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Latest receipts issued at counter</p>
            </div>
            <button
              onClick={onNavigateToStudents}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Receipt #</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Fee Component</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.slice(0, 6).map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{tx.receiptNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{tx.studentName}</div>
                      <div className="text-[10px] text-slate-500 font-medium">Roll: {tx.rollNumber} • {tx.gradeClass}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-semibold">{tx.feeType}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
                        {tx.paymentMode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-emerald-600">
                      +₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onViewReceipt(tx)}
                        className="inline-flex items-center space-x-1 text-slate-700 hover:text-teal-800 hover:bg-teal-50 px-2 py-1 rounded-lg border border-slate-200 text-[11px] font-bold cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Fee Dues Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <span>Pending Fee Dues</span>
              </h3>
              <p className="text-[11px] text-slate-500">Students requiring fee collection</p>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              {totalDefaulters}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px] pr-1">
            {students.filter(s => s.pendingBalance > 0).slice(0, 5).map((student) => (
              <div 
                key={student.id} 
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-colors flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 truncate">{student.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{student.gradeClass} • Roll #{student.rollNumber}</div>
                  <div className="text-[10px] text-rose-600 font-extrabold mt-0.5">
                    Due: ₹{student.pendingBalance.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => onViewLedger(student)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-slate-200 cursor-pointer"
                    title="View Ledger"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onOpenPaymentModal(student)}
                    className="px-2.5 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[11px] rounded-lg shadow-xs cursor-pointer"
                  >
                    Collect
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onNavigateToStudents}
            className="w-full mt-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 text-center transition-colors cursor-pointer"
          >
            Manage All Students ({students.length})
          </button>
        </div>

      </div>
    </div>
  );
};
