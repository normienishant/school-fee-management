import React, { useState } from 'react';
import { PaymentTransaction, PaymentMode } from '../types';
import { Search, Filter, Printer, FileText, Calendar, CreditCard, Download } from 'lucide-react';

interface TransactionsListProps {
  transactions: PaymentTransaction[];
  onOpenReceipt: (txn: PaymentTransaction) => void;
  onOpenPaymentModal: () => void;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  onOpenReceipt,
  onOpenPaymentModal,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<string>('ALL');

  const filteredTxns = transactions.filter((txn) => {
    const matchesSearch = 
      txn.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.receivedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMode = selectedMode === 'ALL' || txn.paymentMode === selectedMode;

    return matchesSearch && matchesMode;
  });

  const totalCollectedInList = filteredTxns.reduce((sum, t) => sum + t.amount, 0);

  const exportCSV = () => {
    const headers = ["Receipt No", "Date", "Student Name", "Roll No", "Class", "Amount Paid", "Payment Mode", "Ref / Cheque", "Fee Type", "Received By"];
    const rows = filteredTxns.map(t => [
      t.receiptNumber,
      t.date,
      `"${t.studentName}"`,
      t.rollNumber,
      t.gradeClass,
      t.amount,
      t.paymentMode,
      `"${t.transactionRef || ''}"`,
      `"${t.feeType}"`,
      `"${t.receivedBy}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Fee_Collections_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Receipts & Payment Ledger</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {filteredTxns.length} payment records • Total Collection: <strong className="text-emerald-700">₹{totalCollectedInList.toLocaleString()}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search receipt #, student, staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Payment Mode Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="bg-transparent font-medium text-slate-900 focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL">All Payment Modes</option>
              <option value="UPI / GPay">UPI / GPay</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Receipt # & Date</th>
                <th className="py-3 px-4">Student & Roll No</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Fee Particulars</th>
                <th className="py-3 px-4">Mode & Ref</th>
                <th className="py-3 px-4 text-right">Amount Paid</th>
                <th className="py-3 px-4">Collected By</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No transactions found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredTxns.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900">{txn.receiptNumber}</div>
                      <div className="text-[10px] text-slate-400 flex items-center space-x-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-300" />
                        <span>{txn.date}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{txn.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{txn.rollNumber}</div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {txn.gradeClass}
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {txn.feeType}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">{txn.paymentMode}</span>
                      <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px] block">
                        {txn.transactionRef || 'N/A'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="font-extrabold text-emerald-600 text-sm">
                        ₹{txn.amount.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {txn.receivedBy}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onOpenReceipt(txn)}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs transition-colors flex items-center space-x-1 mx-auto cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
