import React, { useState, useEffect, useMemo } from 'react';
import { Student } from '../types';
import { X, CheckCircle, CreditCard, User, MessageSquare, Search, Sparkles, Receipt, Wallet, Banknote, Building, QrCode } from 'lucide-react';

interface PaymentModalProps {
  students: Student[];
  preselectedStudent?: Student;
  onClose: () => void;
  onSubmit: (data: {
    studentId: string;
    amountPaid: number;
    paymentMode: 'Cash' | 'UPI / GPay' | 'Bank Transfer' | 'Cheque';
    feeComponent: string;
    remarks?: string;
  }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  students,
  preselectedStudent,
  onClose,
  onSubmit,
}) => {
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    preselectedStudent ? preselectedStudent.id : students[0]?.id || ''
  );

  const currentStudent = students.find(s => s.id === selectedStudentId);

  const [feeComponent, setFeeComponent] = useState<string>('Tuition Fee');
  const [amountPaid, setAmountPaid] = useState<number>(currentStudent?.pendingBalance || 0);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI / GPay' | 'Bank Transfer' | 'Cheque'>('UPI / GPay');
  const [remarks, setRemarks] = useState<string>('');

  // Update amount paid whenever student selection changes
  useEffect(() => {
    if (currentStudent) {
      setAmountPaid(currentStudent.pendingBalance);
    }
  }, [selectedStudentId]);

  // Filter students for dropdown search
  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return students;
    return students.filter(s =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.parentPhone.includes(studentSearch) ||
      s.gradeClass.toLowerCase().includes(studentSearch.toLowerCase())
    );
  }, [students, studentSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || amountPaid <= 0) return;

    onSubmit({
      studentId: selectedStudentId,
      amountPaid: Number(amountPaid),
      paymentMode,
      feeComponent,
      remarks,
    });
  };

  const pendingBalance = currentStudent?.pendingBalance || 0;
  const remainingAfterPayment = Math.max(0, pendingBalance - (amountPaid || 0));

  const paymentMethods = [
    { id: 'UPI / GPay', label: 'UPI / GPay', icon: QrCode, desc: 'Instant QR / PhonePe / GPay' },
    { id: 'Cash', label: 'Cash', icon: Banknote, desc: 'Physical currency counter' },
    { id: 'Bank Transfer', label: 'Bank Transfer', icon: Building, desc: 'NEFT / RTGS / IMPS' },
    { id: 'Cheque', label: 'Cheque', icon: Wallet, desc: 'Bank cheque deposit' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-teal-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">Record Fee Collection</h3>
              <p className="text-[11px] text-slate-300">Generate printed voucher receipt & update ledger</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs">
          
          {/* Student Selector with Quick Search */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span>Select Enrolled Student</span>
              </span>
              <span className="text-[10px] text-slate-500 font-normal">
                {students.length} Total Students
              </span>
            </label>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Type to filter student name, roll number, class..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>

            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 cursor-pointer mt-1"
            >
              {filteredStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.gradeClass}) — Roll: {student.rollNumber} [Pending: ₹{student.pendingBalance.toLocaleString('en-IN')}]
                </option>
              ))}
            </select>
          </div>

          {/* Student Account Info Badge */}
          {currentStudent && (
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-slate-900 text-sm">{currentStudent.name}</span>
                  <span className="text-[10px] text-slate-500 ml-2 font-mono">Roll: {currentStudent.rollNumber}</span>
                </div>
                <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                  {currentStudent.gradeClass}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200">
                <div className="bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Billed</span>
                  <span className="font-bold text-slate-800 text-xs">₹{currentStudent.totalFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-emerald-50/50 p-2 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-emerald-600 uppercase font-bold block">Paid So Far</span>
                  <span className="font-bold text-emerald-700 text-xs">₹{currentStudent.paidFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-rose-50/50 p-2 rounded-xl border border-rose-100">
                  <span className="text-[10px] text-rose-600 uppercase font-bold block">Outstanding Dues</span>
                  <span className="font-extrabold text-rose-600 text-xs">₹{currentStudent.pendingBalance.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Fee Component Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Fee Component
            </label>
            <select
              value={feeComponent}
              onChange={(e) => setFeeComponent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
            >
              <option value="Tuition Fee">Tuition Fee</option>
              <option value="Transport">Transport Fee</option>
              <option value="Exam Fee">Exam Fee</option>
              <option value="Lab & Activity">Lab & Activity Charges</option>
              <option value="Annual Charges">Annual Charges</option>
            </select>
          </div>

          {/* Amount Paid with Preset Buttons */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Amount Being Collected (₹)
              </label>
              {pendingBalance > 0 && (
                <span className="text-[11px] text-slate-500">
                  Max Payable: <strong className="text-slate-800">₹{pendingBalance.toLocaleString('en-IN')}</strong>
                </span>
              )}
            </div>

            <div className="relative mb-2">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-base">₹</span>
              <input
                type="number"
                min={1}
                max={pendingBalance}
                value={amountPaid || ''}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2.5 text-slate-900 font-black text-base focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                required
              />
            </div>

            {/* Quick Amount Presets */}
            {pendingBalance > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setAmountPaid(pendingBalance)}
                  className="flex-1 py-1.5 px-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-bold rounded-lg border border-teal-200 transition-colors cursor-pointer text-center"
                >
                  Full Due (₹{pendingBalance.toLocaleString('en-IN')})
                </button>
                <button
                  type="button"
                  onClick={() => setAmountPaid(Math.round(pendingBalance / 2))}
                  className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 transition-colors cursor-pointer text-center"
                >
                  50% Partial (₹{Math.round(pendingBalance / 2).toLocaleString('en-IN')})
                </button>
              </div>
            )}
          </div>

          {/* Visual Payment Instrument Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Payment Instrument
            </label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((mode) => {
                const Icon = mode.icon;
                const isSelected = paymentMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPaymentMode(mode.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center space-x-2.5 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-teal-500/30'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-teal-500 text-slate-950' : 'bg-white text-slate-600 border border-slate-200'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs leading-none">{mode.label}</div>
                      <div className={`text-[9px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{mode.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>Remarks / Reference ID (Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., GPay Txn ID 92018401 or Cheque #004812"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            />
          </div>

          {/* Live Receipt Impact Summary */}
          <div className="bg-teal-50/60 p-3 rounded-xl border border-teal-200 text-[11px] flex items-center justify-between text-teal-900 font-medium">
            <div className="flex items-center space-x-1.5">
              <Receipt className="w-4 h-4 text-teal-600 shrink-0" />
              <span>New Pending Balance After Payment:</span>
            </div>
            <strong className="text-xs font-black text-slate-900">
              ₹{remainingAfterPayment.toLocaleString('en-IN')}
            </strong>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={amountPaid <= 0}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl shadow-md cursor-pointer transition-all flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirm & Print Receipt</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
