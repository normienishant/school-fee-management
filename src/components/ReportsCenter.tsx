import React, { useState, useMemo } from 'react';
import { Student, PaymentTransaction, SchoolInfo } from '../types';
import { BarChart3, Download, Eye, Building2 } from 'lucide-react';

interface ReportsCenterProps {
  students: Student[];
  transactions: PaymentTransaction[];
  schoolInfo: SchoolInfo;
  onViewReceipt: (tx: PaymentTransaction) => void;
}

interface ClassStats {
  totalBilled: number;
  totalPaid: number;
  pending: number;
  count: number;
}

export const ReportsCenter: React.FC<ReportsCenterProps> = ({
  students,
  transactions,
  schoolInfo,
  onViewReceipt,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>('ALL');

  const grades = useMemo(() => {
    return Array.from(new Set(students.map(s => s.gradeClass))).sort();
  }, [students]);

  // Class-wise collection metrics
  const classBreakdown = useMemo(() => {
    const map: Record<string, ClassStats> = {};

    students.forEach(s => {
      if (!map[s.gradeClass]) {
        map[s.gradeClass] = { totalBilled: 0, totalPaid: 0, pending: 0, count: 0 };
      }
      map[s.gradeClass].totalBilled += s.totalFee;
      map[s.gradeClass].totalPaid += s.paidFee;
      map[s.gradeClass].pending += s.pendingBalance;
      map[s.gradeClass].count += 1;
    });

    return map;
  }, [students]);

  // Filtered transactions for audit log
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchGrade = selectedGrade === 'ALL' || tx.gradeClass === selectedGrade;
      const matchMode = selectedPaymentMode === 'ALL' || tx.paymentMode === selectedPaymentMode;
      return matchGrade && matchMode;
    });
  }, [transactions, selectedGrade, selectedPaymentMode]);

  const totalFilteredCollection = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Export CSV function
  const handleExportCSV = () => {
    const headers = ['Receipt No', 'Date', 'Student Name', 'Roll No', 'Class', 'Fee Component', 'Payment Mode', 'Amount Paid', 'Collected By'];
    const rows = filteredTransactions.map(t => [
      t.receiptNumber,
      t.date,
      `"${t.studentName}"`,
      t.rollNumber,
      `"${t.gradeClass}"`,
      `"${t.feeType}"`,
      t.paymentMode,
      t.amount,
      `"${t.receivedBy}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Fee_Collections_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Financial Audits & Analytics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Fee Collection Audit Reports
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Comprehensive audit logs, class-wise realization metrics, and CSV exports.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Class-wise Performance Grid */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-teal-600" />
          <span>Class-Wise Collection Realization</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.entries(classBreakdown) as [string, ClassStats][]).map(([gradeName, stats]) => {
            const percent = stats.totalBilled > 0 ? Math.round((stats.totalPaid / stats.totalBilled) * 100) : 0;
            return (
              <div key={gradeName} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900">{gradeName}</span>
                  <span className="text-[10px] bg-slate-200 font-bold px-2 py-0.5 rounded text-slate-700">
                    {stats.count} Students
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Collected:</span>
                    <strong className="text-emerald-600">₹{stats.totalPaid.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Pending:</span>
                    <strong className="text-rose-600">₹{stats.pending.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                {/* Realization Progress Bar */}
                <div className="pt-2 border-t border-slate-200/80">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>Realized</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction Filter & Detailed Audit Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Detailed Transaction Register</h3>
            <p className="text-[11px] text-slate-500">Filter receipt transactions by class or payment method</p>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
            >
              <option value="ALL">All Classes</option>
              {grades.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <select
              value={selectedPaymentMode}
              onChange={(e) => setSelectedPaymentMode(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
            >
              <option value="ALL">All Payment Modes</option>
              <option value="UPI / GPay">UPI / GPay</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-300 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Receipt #</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Component</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4">Collected By</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{tx.receiptNumber}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{tx.date}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{tx.studentName}</div>
                    <div className="text-[10px] text-slate-500">{tx.gradeClass}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{tx.feeType}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px] border border-slate-200">
                      {tx.paymentMode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{tx.receivedBy}</td>
                  <td className="py-3.5 px-4 text-right font-black text-emerald-600">
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => onViewReceipt(tx)}
                      className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg border border-slate-200 cursor-pointer transition-colors"
                      title="View & Print Receipt"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 font-bold text-xs border-t border-slate-200">
              <tr>
                <td colSpan={6} className="py-3 px-4 text-slate-800">
                  Filtered Total Realized:
                </td>
                <td className="py-3 px-4 text-right text-emerald-600 text-sm font-black">
                  ₹{totalFilteredCollection.toLocaleString('en-IN')}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

      </div>

    </div>
  );
};
