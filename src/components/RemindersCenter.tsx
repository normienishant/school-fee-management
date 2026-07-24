import React, { useState, useMemo } from 'react';
import { Student, SchoolInfo } from '../types';
import { Send, Phone, CheckSquare, Square, CreditCard, Mail, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RemindersCenterProps {
  students: Student[];
  schoolInfo: SchoolInfo;
  onRecordPayment: (student: Student) => void;
  onViewLedger: (student: Student) => void;
}

export const RemindersCenter: React.FC<RemindersCenterProps> = ({
  students,
  schoolInfo,
  onRecordPayment,
  onViewLedger,
}) => {
  const defaulters = useMemo(() => {
    return students.filter(s => s.pendingBalance > 0);
  }, [students]);

  const [selectedIds, setSelectedIds] = useState<string[]>(defaulters.map(s => s.id));
  const [gradeFilter, setGradeFilter] = useState<string>('ALL');
  const [demoOnly, setDemoOnly] = useState<boolean>(false);
  const [sentCount, setSentCount] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const grades = useMemo(() => {
    return Array.from(new Set(defaulters.map(s => s.gradeClass))).sort();
  }, [defaulters]);

  const filteredDefaulters = useMemo(() => {
    return defaulters.filter(s => {
      const matchGrade = gradeFilter === 'ALL' || s.gradeClass === gradeFilter;
      if (!matchGrade) return false;
      if (demoOnly) {
        const p = s.parentPhone.replace(/\D/g, '');
        const e = (s.parentEmail || '').toLowerCase();
        return p.includes('9871610154') || p.includes('9625784184') || e.includes('yashsaini');
      }
      return true;
    });
  }, [defaulters, gradeFilter, demoOnly]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredDefaulters.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDefaulters.map(s => s.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const generateWhatsAppText = (student: Student) => {
    return `*FEE PAYMENT REMINDER - ${schoolInfo.name.toUpperCase()}*\n` +
      `Dear Parent of *${student.name}* (${student.gradeClass}, Roll No: ${student.rollNumber}),\n` +
      `This is a gentle reminder that an outstanding fee balance of *₹${student.pendingBalance.toLocaleString('en-IN')}* is pending for Academic Year ${schoolInfo.academicYear}.\n\n` +
      `*Fee Breakdown:* Total ₹${student.totalFee.toLocaleString('en-IN')} | Paid ₹${student.paidFee.toLocaleString('en-IN')} | *Balance Due: ₹${student.pendingBalance.toLocaleString('en-IN')}*\n\n` +
      `Bank UPI ID: ${schoolInfo.bankDetails.upiId}\n` +
      `Bank Account: ${schoolInfo.bankDetails.accountNo} (${schoolInfo.bankDetails.ifscCode})\n\n` +
      `Please clear the pending balance at your earliest convenience or pay at the school accounts counter. Thank you!`;
  };

  const handleSendSingleWhatsApp = (student: Student) => {
    const rawPhone = student.parentPhone.replace(/\D/g, '');
    const text = generateWhatsAppText(student);
    const url = `https://wa.me/91${rawPhone.slice(-10)}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setSentCount(prev => prev + 1);
    setStatusMessage(`WhatsApp reminder link generated for ${student.name} (${student.parentPhone})`);
  };

  const handleSendSingleEmail = (student: Student) => {
    const subject = `Fee Payment Reminder - ${student.name} (${student.gradeClass}) - ${schoolInfo.name}`;
    const body = `Dear ${student.parentName},\n\n` +
      `This is an official communication from ${schoolInfo.name}.\n\n` +
      `Student Name: ${student.name}\n` +
      `Roll / Admission Number: ${student.rollNumber}\n` +
      `Class: ${student.gradeClass}\n` +
      `Pending Fee Balance: ₹${student.pendingBalance.toLocaleString('en-IN')}\n\n` +
      `Kindly arrange payment via Bank Transfer or UPI ID (${schoolInfo.bankDetails.upiId}) at your earliest convenience.\n\n` +
      `Regards,\n` +
      `Accounts & Billing Department\n` +
      `${schoolInfo.name}\n` +
      `Phone: ${schoolInfo.phone}`;

    window.open(`mailto:${student.parentEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    setStatusMessage(`Email dispatch initialized for ${student.parentEmail}`);
  };

  const handleBulkWhatsApp = () => {
    const selectedStudents = defaulters.filter(s => selectedIds.includes(s.id));
    if (selectedStudents.length === 0) return;

    // Open first student's WhatsApp directly
    selectedStudents.forEach((student, idx) => {
      setTimeout(() => {
        const rawPhone = student.parentPhone.replace(/\D/g, '');
        const text = generateWhatsAppText(student);
        window.open(`https://wa.me/91${rawPhone.slice(-10)}?text=${encodeURIComponent(text)}`, '_blank');
      }, idx * 600);
    });

    setSentCount(prev => prev + selectedStudents.length);
    setStatusMessage(`Bulk WhatsApp reminder queue started for ${selectedStudents.length} parent contacts!`);
  };

  const handleBulkEmail = () => {
    const selectedStudents = defaulters.filter(s => selectedIds.includes(s.id));
    if (selectedStudents.length === 0) return;

    const emails = selectedStudents.map(s => s.parentEmail).filter(Boolean).join(',');
    const subject = `Fee Payment Reminder - ${schoolInfo.name} (${selectedStudents.length} Students)`;
    const body = `Dear Parents,\n\nThis is a consolidated fee payment reminder from ${schoolInfo.name}.\n\nPlease review your student fee ledger and settle outstanding balances.\n\nThank you,\nAccounts Dept.`;

    window.open(`mailto:${emails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    setStatusMessage(`Bulk email compose window opened for ${selectedStudents.length} recipients!`);
  };

  const totalSelectedDue = useMemo(() => {
    return defaulters
      .filter(s => selectedIds.includes(s.id))
      .reduce((sum, s) => sum + s.pendingBalance, 0);
  }, [defaulters, selectedIds]);

  return (
    <div className="space-y-5">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Send className="w-4 h-4" />
            <span>Automated Parent Communication Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>WhatsApp & Email Fee Reminders</span>
            <span className="text-xs bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full font-mono">Live Sync</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Dispatch instant 1-click WhatsApp messages & email statements to parents for outstanding fee balances.
          </p>
        </div>

        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-right shrink-0 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Selected Defaulters Dues</span>
          <span className="text-xl sm:text-2xl font-black text-rose-400">
            ₹{totalSelectedDue.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400 block">{selectedIds.length} Parents Selected</span>
        </div>
      </div>

      {statusMessage && (
        <div className="bg-teal-500/10 border border-teal-500/30 text-teal-300 p-3 rounded-2xl text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span className="font-medium">{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage('')} className="text-teal-400 font-bold hover:underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Demo Contact Preset Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-500/30 rounded-2xl p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-teal-500/20 text-teal-300 rounded-xl shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
              <span>Live Presentation Demo Numbers</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md">9871610154 / 9625784184</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Click below to view students pre-configured with your test numbers (<strong>+91 9871610154</strong> & <strong>+91 9625784184</strong>) to receive live WhatsApp reminders directly on your phone!
            </p>
          </div>
        </div>

        <button
          onClick={() => setDemoOnly(!demoOnly)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
            demoOnly
              ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md'
              : 'bg-slate-800 hover:bg-slate-700 text-teal-300 border-teal-500/30'
          }`}
        >
          {demoOnly ? 'Show All Students' : 'Filter Demo Contacts Only'}
        </button>
      </div>

      {/* Filter & Batch Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <button
            onClick={toggleSelectAll}
            className="flex items-center space-x-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer transition-colors whitespace-nowrap"
          >
            {selectedIds.length === filteredDefaulters.length ? (
              <CheckSquare className="w-4 h-4 text-teal-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>Select All ({filteredDefaulters.length})</span>
          </button>

          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
          >
            <option value="ALL">All Defaulter Grades</option>
            {grades.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* BULK ACTION BUTTONS */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleBulkWhatsApp}
            disabled={selectedIds.length === 0}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
            <span>Bulk WhatsApp ({selectedIds.length})</span>
          </button>

          <button
            onClick={handleBulkEmail}
            disabled={selectedIds.length === 0}
            className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition-all disabled:opacity-40"
          >
            <Mail className="w-4 h-4" />
            <span>Bulk Email ({selectedIds.length})</span>
          </button>
        </div>
      </div>

      {/* Defaulter List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-300 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 w-10">Select</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Class</th>
                <th className="py-3.5 px-4">Parent Contact Info</th>
                <th className="py-3.5 px-4 text-right">Pending Balance</th>
                <th className="py-3.5 px-4 text-center">Live Dispatch Reminders</th>
                <th className="py-3.5 px-4 text-center">Collect Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDefaulters.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No defaulters found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDefaulters.map((student) => {
                  const isSelected = selectedIds.includes(student.id);
                  const isTestContact = student.parentPhone.includes('9871610154') || student.parentPhone.includes('9625784184');

                  return (
                    <tr key={student.id} className={`hover:bg-slate-50 transition-colors ${isTestContact ? 'bg-teal-50/50' : ''}`}>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toggleSelect(student.id)}
                          className="cursor-pointer text-slate-600 hover:text-slate-900"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-teal-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300" />
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                          <span>{student.name}</span>
                          {isTestContact && (
                            <span className="bg-teal-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">LIVE DEMO</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">Roll: {student.rollNumber}</div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {student.gradeClass}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{student.parentName}</div>
                        <div className="text-[10px] text-slate-600 flex items-center space-x-1.5 mt-0.5 font-mono">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span className="font-bold text-slate-900">{student.parentPhone}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center space-x-1.5 mt-0.5 font-mono">
                          <Mail className="w-3 h-3 text-sky-600" />
                          <span>{student.parentEmail}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-black text-rose-600 text-sm">
                        ₹{student.pendingBalance.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => handleSendSingleWhatsApp(student)}
                            className="inline-flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-xl shadow-xs cursor-pointer transition-colors"
                            title="Send WhatsApp Message"
                          >
                            <Send className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </button>

                          <button
                            onClick={() => handleSendSingleEmail(student)}
                            className="inline-flex items-center space-x-1 bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-xl shadow-xs cursor-pointer transition-colors"
                            title="Send Email Statement"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Email</span>
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onRecordPayment(student)}
                          className="inline-flex items-center space-x-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[11px] px-3 py-1.5 rounded-xl shadow-xs cursor-pointer transition-colors"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Pay</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
