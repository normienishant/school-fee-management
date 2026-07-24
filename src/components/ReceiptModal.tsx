import React from 'react';
import { PaymentTransaction, SchoolInfo, Student } from '../types';
import { X, Printer, Share2, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  transaction: PaymentTransaction;
  schoolInfo: SchoolInfo;
  student?: Student;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  schoolInfo,
  student,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    if (!student) return;
    const message = `*FEE PAYMENT RECEIPT - ${schoolInfo.name}*\n` +
      `Receipt No: *${transaction.receiptNumber}*\n` +
      `Student Name: *${transaction.studentName}* (${transaction.gradeClass})\n` +
      `Roll No: ${transaction.rollNumber}\n` +
      `Amount Paid: *₹${transaction.amount.toLocaleString('en-IN')}*\n` +
      `Payment Mode: ${transaction.paymentMode}\n` +
      `Fee Component: ${transaction.feeType}\n` +
      `Date: ${transaction.date}\n\n` +
      `Thank you for the prompt fee submission!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/91${student.parentPhone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Controls Bar */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-sm sm:text-base text-white">Fee Payment Receipt</h3>
          </div>

          <div className="flex items-center space-x-2">
            {student && (
              <button
                onClick={handleWhatsAppShare}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1 transition-colors cursor-pointer"
                title="Send Receipt via WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CANVAS */}
        <div className="p-6 sm:p-8 bg-white text-slate-900 text-xs space-y-6 printable-receipt">
          
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center relative">
            <div className="text-[10px] uppercase font-bold tracking-widest text-teal-700">Official Payment Voucher</div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">{schoolInfo.name}</h1>
            <p className="text-slate-500 text-[11px]">{schoolInfo.address} • Phone: {schoolInfo.phone}</p>
            <p className="text-slate-500 text-[10px] mt-0.5">Academic Session: <strong>{schoolInfo.academicYear}</strong></p>
          </div>

          {/* Receipt Meta */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 text-[10px] block font-medium uppercase tracking-wider">Receipt Number</span>
              <span className="text-sm font-mono font-black text-slate-900">{transaction.receiptNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 text-[10px] block font-medium uppercase tracking-wider">Date</span>
              <span className="text-xs font-bold text-slate-800">{transaction.date}</span>
            </div>
          </div>

          {/* Student Information Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-200 text-xs">
                <tr>
                  <td className="py-2.5 px-3 bg-slate-100 font-bold text-slate-700 w-1/3">Student Name</td>
                  <td className="py-2.5 px-3 font-extrabold text-slate-900 text-sm">{transaction.studentName}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 bg-slate-100 font-bold text-slate-700">Class & Section</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{transaction.gradeClass}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 bg-slate-100 font-bold text-slate-700">Roll Number</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{transaction.rollNumber}</td>
                </tr>
                {student && (
                  <tr>
                    <td className="py-2.5 px-3 bg-slate-100 font-bold text-slate-700">Parent Name & Contact</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{student.parentName} ({student.parentPhone})</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Payment Details Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-white text-[10px] uppercase font-bold">
                <tr>
                  <th className="py-2.5 px-3">Fee Component</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3 text-right">Amount Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                <tr>
                  <td className="py-3 px-3 font-bold text-slate-900">{transaction.feeType}</td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{transaction.paymentMode}</td>
                  <td className="py-3 px-3 text-right font-black text-sm text-emerald-600">
                    ₹{transaction.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold text-xs border-t border-slate-200">
                <tr>
                  <td colSpan={2} className="py-2.5 px-3 text-slate-700">Total Received (in INR)</td>
                  <td className="py-2.5 px-3 text-right text-base text-slate-900 font-black">
                    ₹{transaction.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Remaining Balance Summary */}
          {student && (
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
              <span className="font-semibold text-amber-900">Remaining Balance Dues:</span>
              <span className="font-extrabold text-amber-900 text-sm">₹{student.pendingBalance.toLocaleString('en-IN')}</span>
            </div>
          )}

          {transaction.notes && (
            <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <strong>Remarks:</strong> {transaction.notes}
            </div>
          )}

          {/* Footer & Signatures */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 items-end">
            <div>
              <p className="text-[10px] text-slate-500">Collected By: <strong>{transaction.receivedBy}</strong></p>
              <div className="flex items-center space-x-1 text-[10px] text-emerald-600 font-semibold mt-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified System Stamp</span>
              </div>
            </div>

            <div className="text-right">
              <div className="h-10 border-b border-slate-400 w-36 ml-auto"></div>
              <p className="text-[10px] font-bold text-slate-700 mt-1">Authorized Cashier Seal</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
