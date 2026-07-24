import React, { useState, useMemo } from 'react';
import { Student } from '../types';
import { 
  Users, 
  Search, 
  Plus, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Phone,
  MessageCircle,
  ArrowUpDown,
  Filter
} from 'lucide-react';

interface StudentsListProps {
  students: Student[];
  searchTerm: string;
  onRecordPayment: (student: Student) => void;
  onViewLedger: (student: Student) => void;
  onAddNewStudent: () => void;
}

export const StudentsList: React.FC<StudentsListProps> = ({
  students,
  searchTerm,
  onRecordPayment,
  onViewLedger,
  onAddNewStudent,
}) => {
  const [gradeFilter, setGradeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CLEAR' | 'PENDING' | 'HIGH_DUES'>('ALL');
  const [sortBy, setSortBy] = useState<'DUES_DESC' | 'NAME_ASC' | 'ROLL_ASC' | 'CLASS_ASC'>('DUES_DESC');
  const [localSearch, setLocalSearch] = useState<string>('');

  const activeSearch = searchTerm || localSearch;

  // Available grades
  const grades = useMemo(() => {
    const list = Array.from(new Set(students.map(s => s.gradeClass)));
    return list.sort();
  }, [students]);

  // Filtered & Sorted list
  const filteredStudents = useMemo(() => {
    const result = students.filter(student => {
      // Search
      const matchesSearch = 
        student.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(activeSearch.toLowerCase()) ||
        student.parentPhone.includes(activeSearch) ||
        student.parentName.toLowerCase().includes(activeSearch.toLowerCase());

      // Grade
      const matchesGrade = gradeFilter === 'ALL' || student.gradeClass === gradeFilter;

      // Status
      const matchesStatus = 
        statusFilter === 'ALL' ||
        (statusFilter === 'CLEAR' && student.pendingBalance === 0) ||
        (statusFilter === 'PENDING' && student.pendingBalance > 0) ||
        (statusFilter === 'HIGH_DUES' && student.pendingBalance >= 10000);

      return matchesSearch && matchesGrade && matchesStatus;
    });

    // Sort
    return result.sort((a, b) => {
      if (sortBy === 'DUES_DESC') return b.pendingBalance - a.pendingBalance;
      if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
      if (sortBy === 'ROLL_ASC') return a.rollNumber.localeCompare(b.rollNumber, undefined, { numeric: true });
      if (sortBy === 'CLASS_ASC') return a.gradeClass.localeCompare(b.gradeClass);
      return 0;
    });
  }, [students, activeSearch, gradeFilter, statusFilter, sortBy]);

  // WhatsApp quick text builder
  const openWhatsApp = (student: Student) => {
    const msg = `Respected Parent, greeting from School Fee Office. This is a gentle reminder regarding pending fee balance of Rs.${student.pendingBalance.toLocaleString('en-IN')} for ${student.name} (${student.gradeClass}). Kindly clear the dues at your earliest. Thank you!`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/91${student.parentPhone.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-5">
      
      {/* Header & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Student Fee Registry</h2>
            <span className="bg-slate-100 text-slate-700 font-semibold text-xs px-2.5 py-0.5 rounded-full border border-slate-200">
              {filteredStudents.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time directory for quick fee collection, student ledgers, and parent reminders.
          </p>
        </div>

        <button
          onClick={onAddNewStudent}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center justify-center space-x-2 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4 text-teal-400" />
          <span>New Student Admission</span>
        </button>
      </div>

      {/* Filter Controls & Sort Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          
          {/* Local Search */}
          <div className="relative col-span-1 sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search name, roll, phone..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
            />
          </div>

          {/* Grade Selector */}
          <div>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
            >
              <option value="ALL">All Grades / Classes</option>
              {grades.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Fee Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="PENDING">Pending Dues Only</option>
              <option value="HIGH_DUES">High Dues (≥ ₹10,000)</option>
              <option value="CLEAR">Fully Paid (Nil Due)</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
            >
              <option value="DUES_DESC">Sort: Highest Dues First</option>
              <option value="NAME_ASC">Sort: Name (A to Z)</option>
              <option value="ROLL_ASC">Sort: Roll Number</option>
              <option value="CLASS_ASC">Sort: Class</option>
            </select>
          </div>

        </div>

        {/* Quick Filter Tag Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
          <span className="text-slate-400 font-medium mr-1 flex items-center space-x-1">
            <Filter className="w-3 h-3" />
            <span>Quick View:</span>
          </span>
          <button
            onClick={() => { setStatusFilter('ALL'); setGradeFilter('ALL'); }}
            className={`px-2.5 py-1 rounded-lg border font-bold cursor-pointer ${statusFilter === 'ALL' && gradeFilter === 'ALL' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
          >
            All ({students.length})
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-2.5 py-1 rounded-lg border font-bold cursor-pointer ${statusFilter === 'PENDING' ? 'bg-rose-600 text-white border-rose-600' : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'}`}
          >
            Dues Pending ({students.filter(s => s.pendingBalance > 0).length})
          </button>
          <button
            onClick={() => setStatusFilter('HIGH_DUES')}
            className={`px-2.5 py-1 rounded-lg border font-bold cursor-pointer ${statusFilter === 'HIGH_DUES' ? 'bg-amber-600 text-white border-amber-600' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'}`}
          >
            High Defaulters ({students.filter(s => s.pendingBalance >= 10000).length})
          </button>
          <button
            onClick={() => setStatusFilter('CLEAR')}
            className={`px-2.5 py-1 rounded-lg border font-bold cursor-pointer ${statusFilter === 'CLEAR' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}
          >
            Nil Due ({students.filter(s => s.pendingBalance === 0).length})
          </button>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-300 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Student & Roll</th>
                <th className="py-3.5 px-4">Class</th>
                <th className="py-3.5 px-4">Parent Contact</th>
                <th className="py-3.5 px-4 text-right">Fee Status & Progress</th>
                <th className="py-3.5 px-4 text-right">Pending Balance</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No matching student records found. Try clearing filter terms.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isClear = student.pendingBalance === 0;
                  const percentPaid = student.totalFee > 0 ? Math.min(100, Math.round((student.paidFee / student.totalFee) * 100)) : 100;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Roll */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-xs">{student.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          Roll: {student.rollNumber}
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-3.5 px-4 font-bold text-slate-700">
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200">
                          {student.gradeClass}
                        </span>
                      </td>

                      {/* Contact + WhatsApp */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-bold">{student.parentName}</div>
                        <div className="text-[10px] text-slate-500 flex items-center space-x-2 mt-0.5">
                          <span className="flex items-center space-x-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{student.parentPhone}</span>
                          </span>
                          {!isClear && (
                            <button
                              onClick={() => openWhatsApp(student)}
                              className="inline-flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 cursor-pointer"
                              title="Send WhatsApp Fee Notice"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Realization Progress */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2 text-[11px] font-bold">
                          <span className="text-slate-900">₹{student.paidFee.toLocaleString('en-IN')}</span>
                          <span className="text-slate-400 font-normal">/ ₹{student.totalFee.toLocaleString('en-IN')}</span>
                          <span className="text-emerald-600 font-extrabold text-[10px]">({percentPaid}%)</span>
                        </div>
                        <div className="w-32 ml-auto bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full transition-all rounded-full ${isClear ? 'bg-emerald-500' : 'bg-teal-500'}`}
                            style={{ width: `${percentPaid}%` }}
                          />
                        </div>
                      </td>

                      {/* Pending Amount */}
                      <td className="py-3.5 px-4 text-right">
                        {isClear ? (
                          <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Fully Paid</span>
                          </span>
                        ) : (
                          <div>
                            <span className="font-black text-rose-600 text-sm">
                              ₹{student.pendingBalance.toLocaleString('en-IN')}
                            </span>
                            <span className="block text-[9px] text-rose-500 font-semibold uppercase">
                              Due Outstanding
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => onViewLedger(student)}
                            className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer transition-colors"
                            title="View Student Ledger"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => onRecordPayment(student)}
                            disabled={isClear}
                            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1 ${
                              isClear
                                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-sm'
                            }`}
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Collect</span>
                          </button>
                        </div>
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
