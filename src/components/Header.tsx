import React, { useState, useRef, useEffect } from 'react';
import { SchoolInfo, StaffMember, Student } from '../types';
import { School, PlusCircle, Bell, Search, ShieldCheck, CreditCard, FileText, X, ChevronRight, LogOut } from 'lucide-react';

interface HeaderProps {
  schoolInfo: SchoolInfo;
  staffMembers: StaffMember[];
  currentStaff: StaffMember;
  setCurrentStaff: (staff: StaffMember) => void;
  onOpenPaymentModal: (student?: Student) => void;
  onViewLedger?: (student: Student) => void;
  students: Student[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  overdueCount: number;
  onNavigateToReminders: () => void;
  onNavigateToStudents: () => void;
  onLogout?: () => void;
  userEmail?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  schoolInfo,
  staffMembers,
  currentStaff,
  setCurrentStaff,
  onOpenPaymentModal,
  onViewLedger,
  students,
  searchTerm,
  setSearchTerm,
  overdueCount,
  onNavigateToReminders,
  onNavigateToStudents,
  onLogout,
  userEmail,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter students for spotlight dropdown
  const matchingStudents = searchTerm.trim().length > 0 
    ? students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.parentPhone.includes(searchTerm) ||
        s.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.gradeClass.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  // Keyboard shortcut listener for Ctrl+K or '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Brand Identity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/10 shrink-0">
                <School className="w-5 h-5 text-slate-950 font-bold" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white leading-snug">
                    {schoolInfo.name}
                  </h1>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded-md border border-teal-500/30 shrink-0">
                    AY {schoolInfo.academicYear}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Fee Management Portal & Ledger</p>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={onNavigateToReminders}
                className="relative p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800"
                title="Alerts"
              >
                <Bell className="w-4 h-4" />
                {overdueCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {overdueCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => onOpenPaymentModal()}
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl shadow-sm cursor-pointer whitespace-nowrap flex items-center space-x-1"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Pay Fee</span>
              </button>
            </div>
          </div>

          {/* Search Bar with Spotlight Dropdown */}
          <div className="w-full md:flex-1 md:max-w-md md:mx-4 relative">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search student, roll #, phone... (Ctrl + K)"
                value={searchTerm}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearchFocused(true);
                }}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Spotlight Dropdown Popup */}
            {isSearchFocused && searchTerm.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs divide-y divide-slate-800">
                <div className="p-2.5 bg-slate-950 text-[10px] font-bold uppercase tracking-wider text-teal-400 flex justify-between items-center">
                  <span>Quick Student Search Results ({matchingStudents.length})</span>
                  <span className="text-slate-500 font-normal">ESC to close</span>
                </div>

                {matchingStudents.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">
                    No matching student found for "{searchTerm}".
                  </div>
                ) : (
                  matchingStudents.map((student) => {
                    const isDue = student.pendingBalance > 0;
                    return (
                      <div
                        key={student.id}
                        className="p-3 hover:bg-slate-800/80 transition-colors flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-bold text-white text-xs flex items-center space-x-1.5">
                            <span>{student.name}</span>
                            <span className="text-[10px] bg-slate-800 text-slate-300 font-normal px-1.5 py-0.2 rounded">
                              {student.gradeClass}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Roll #{student.rollNumber} • Parent: {student.parentName} ({student.parentPhone})
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                          {isDue ? (
                            <span className="text-[10px] font-extrabold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 mr-1">
                              Due ₹{student.pendingBalance.toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 mr-1">
                              Nil Due
                            </span>
                          )}

                          {onViewLedger && (
                            <button
                              onClick={() => {
                                setIsSearchFocused(false);
                                onViewLedger(student);
                              }}
                              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg"
                              title="View Fee Ledger"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {isDue && (
                            <button
                              onClick={() => {
                                setIsSearchFocused(false);
                                onOpenPaymentModal(student);
                              }}
                              className="px-2.5 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[11px] rounded-lg flex items-center space-x-1 cursor-pointer shadow-xs"
                            >
                              <CreditCard className="w-3 h-3" />
                              <span>Pay</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                <button
                  onClick={() => {
                    setIsSearchFocused(false);
                    onNavigateToStudents();
                  }}
                  className="w-full p-2.5 text-center text-teal-400 hover:bg-slate-800 font-bold text-[11px] flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>View All In Student Directory</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Desktop Right Controls */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Staff Switcher */}
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <div className="text-left">
                <span className="text-slate-400 text-[10px] block leading-none font-medium">Active Staff</span>
                <select
                  value={currentStaff.id}
                  onChange={(e) => {
                    const selected = staffMembers.find((s) => s.id === e.target.value);
                    if (selected) setCurrentStaff(selected);
                  }}
                  className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-xs pr-1"
                >
                  {staffMembers.map((staff) => (
                    <option key={staff.id} value={staff.id} className="bg-slate-900 text-white">
                      {staff.name} ({staff.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Overdue Alert Bell */}
            <button
              onClick={onNavigateToReminders}
              className="relative p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-colors cursor-pointer"
              title="View Overdue Fee Alerts"
            >
              <Bell className="w-4 h-4" />
              {overdueCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {overdueCount}
                </span>
              )}
            </button>

            {/* Record Payment Button */}
            <button
              onClick={() => onOpenPaymentModal()}
              className="flex items-center space-x-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-teal-500/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Fee Payment</span>
            </button>

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2.5 bg-slate-900 hover:bg-rose-950/80 hover:text-rose-400 text-slate-400 rounded-xl border border-slate-800 transition-colors cursor-pointer"
                title="Sign Out / Lock Portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
