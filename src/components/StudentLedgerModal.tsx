import React from 'react';
import { Student, PaymentTransaction, SchoolInfo } from '../types';
import { X, FileText, CreditCard, Send, Printer, Phone } from 'lucide-react';

interface StudentLedgerModalProps {
  student: Student;
  transactions: PaymentTransaction[];
  schoolInfo: SchoolInfo;
  onClose: () => void;
  onRecordPayment: () => void;
  onViewReceipt: (tx: PaymentTransaction) => void;
}

export const StudentLedgerModal: React.FC<StudentLedgerModalProps> = ({
  student,
  transactions,
  schoolInfo,
  onClose,
  onRecordPayment,
  onViewReceipt,
}) => {
  const isClear = student.pendingBalance === 0;

  const handlePrintLedger = () => {
    window.print();
  };

  const handleSendWhatsAppReminder = () => {
    const text = `*FEE DUE NOTICE - ${schoolInfo.name}*\n` +
      `Dear Parent of *${student.name}* (${student.gradeClass}, Roll: ${student.rollNumber}),\n` +
      `This is a gentle reminder that an outstanding fee balance of *₹${student.pendingBalance.toLocaleString('en-IN')}* is pending for AY ${schoolInfo.academicYear}.\n\n` +
      `Please deposit the fee at the school accounts counter or via UPI. Thank you!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/91${student.parentPhone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">Student Account Ledger & Statement</h3>
              <p className="text-[11px] text-slate-400">{student.name} • Roll #{student.rollNumber}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isClear && (
              <button
                onClick={handleSendWhatsAppReminder}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <Send className="w-3 h-3" />
                <span className="hidden sm:inline">WhatsApp Notice</span>
              </button>
            )}

            <button
              onClick={handlePrintLedger}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Ledger</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ledger Scrollable Content */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 text-xs printable-receipt">
          
          {/* Student Profile Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Student Name</span>
              <span className="text-base font-extrabold text-slate-900">{student.name}</span>
              <span className="text-xs text-slate-500 block mt-0.5">{student.gradeClass} • Roll #{student.rollNumber}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Parent Info</span>
              <span className="text-xs font-bold text-slate-800">{student.parentName}</span>
              <span className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{student.parentPhone}</span>
              </span>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Financial Summary</span>
              <div className="mt-1 space-y-0.5">
                <div className="text-xs text-slate-600">Total Billed: <strong>₹{student.totalFee.toLocaleString('en-IN')}</strong></div>
                <div className="text-xs text-emerald-600 font-bold">Total Paid: ₹{student.paidFee.toLocaleString('en-IN')}</div>
                <div className="text-xs text-rose-600 font-extrabold">Pending Dues: ₹{student.pendingBalance.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>

          {/* Component Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Fee Structure Breakdown</h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-white text-[10px] uppercase font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Component</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-800">Tuition Fee</td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-700">₹{student.feeBreakdown.tuitionFee.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-800">Transport Fee</td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-700">₹{student.feeBreakdown.transportFee.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-800">Exam Fee</td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-700">₹{student.feeBreakdown.examFee.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-800">Activity & Lab Fee</td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-700">₹{student.feeBreakdown.activityFee.toLocaleString('en-IN')}</td>
                  </tr>
                  {student.feeBreakdown.discount > 0 && (
                    <tr className="hover:bg-slate-50 bg-emerald-50/50">
                      <td className="py-2.5 px-3 font-bold text-emerald-800">Concession / Scholarship Discount</td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-600">-₹{student.feeBreakdown.discount.toLocaleString('en-IN')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment History Timeline */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Transaction History</h4>
            {transactions.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
                No fee payments recorded for this student yet.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 text-[10px] uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Receipt #</th>
                      <th className="py-2.5 px-3">Component</th>
                      <th className="py-2.5 px-3">Mode</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-3 text-center print:hidden">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-medium text-slate-600">{tx.date}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{tx.receiptNumber}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">{tx.feeType}</td>
                        <td className="py-2.5 px-3">
                          <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px] border border-slate-200">
                            {tx.paymentMode}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-emerald-600">
                          ₹{tx.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-center print:hidden">
                          <button
                            onClick={() => onViewReceipt(tx)}
                            className="text-xs text-teal-700 hover:underline font-semibold cursor-pointer"
                          >
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Actions Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between shrink-0 print:hidden">
          <div className="text-xs font-semibold text-slate-600">
            Current Status: {isClear ? (
              <span className="text-emerald-700 font-bold">Nil Dues (Fully Paid)</span>
            ) : (
              <span className="text-rose-600 font-bold">Outstanding ₹{student.pendingBalance.toLocaleString('en-IN')}</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 cursor-pointer transition-colors text-xs"
            >
              Close
            </button>
            {!isClear && (
              <button
                onClick={onRecordPayment}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl shadow-xs cursor-pointer transition-all text-xs flex items-center space-x-1"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Collect Fee Now</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
