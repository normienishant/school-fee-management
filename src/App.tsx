import React, { useState, useEffect, useMemo } from 'react';
import { initialSchoolInfo, initialStaffMembers, initialStudents, initialTransactions } from './data/initialData';
import { SchoolInfo, StaffMember, Student, PaymentTransaction } from './types';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { StudentsList } from './components/StudentsList';
import { PaymentModal } from './components/PaymentModal';
import { ReceiptModal } from './components/ReceiptModal';
import { StudentLedgerModal } from './components/StudentLedgerModal';
import { RemindersCenter } from './components/RemindersCenter';
import { ReportsCenter } from './components/ReportsCenter';
import { SettingsModal } from './components/SettingsModal';
import { NewStudentModal } from './components/NewStudentModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { AuthScreen } from './components/AuthScreen';
import api from "./utils/api"
import { LayoutDashboard, Users, Send, BarChart3, Settings, UserPlus, ShieldCheck } from 'lucide-react';

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(initialSchoolInfo);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(initialStaffMembers);
  const [currentStaff, setCurrentStaff] = useState<StaffMember>(initialStaffMembers[0]);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(initialTransactions);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'reminders' | 'reports'>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Check token on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const staff = JSON.parse(localStorage.getItem('staff') || '{}');
      setSessionEmail(staff.email || 'admin@school.edu');
      fetchData();
    }
    setAuthLoading(false);
  }, []);

  // Data fetching
  const fetchData = async () => {
    try {
      const [studentsRes, txRes] = await Promise.all([
        api.get('/students'),
        api.get('/payments'),
      ]);
      setStudents(studentsRes.data.data);
      setTransactions(txRes.data.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  // Poll every 10 seconds
  useEffect(() => {
    if (!isLoggedIn) return;
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // Modal states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [preselectedStudentForPayment, setPreselectedStudentForPayment] = useState<Student | undefined>(undefined);

  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);
  const [selectedLedgerStudent, setSelectedLedgerStudent] = useState<Student | null>(null);

  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Overdue count
  const overdueStudents = useMemo(() => {
    return students.filter(s => s.pendingBalance > 0);
  }, [students]);

  // Record payment handler
  const handleRecordPayment = async (paymentData: {
    studentId: string;
    amountPaid: number;
    paymentMode: 'Cash' | 'UPI / GPay' | 'Bank Transfer' | 'Cheque';
    feeComponent: string;
    remarks?: string;
  }) => {
    try {
      let mode = paymentData.paymentMode;
      if (mode === 'UPI / GPay') mode = 'UPI' as any;
      else if (mode === 'Bank Transfer') mode = 'BANK_TRANSFER' as any;
      
      await api.post('/payments', {
        studentId: paymentData.studentId,
        amount: paymentData.amountPaid,
        paymentMode: mode,
        feeType: paymentData.feeComponent,
        transactionRef: paymentData.remarks || '',
      });

      await fetchData();
      setIsPaymentModalOpen(false);
      
      const txRes = await api.get('/payments');
      const allTxs = txRes.data.data;
      const newTx = allTxs[0];
      setSelectedReceipt(newTx);

      addToast(
        'success',
        'Payment Recorded!',
        `Receipt generated for ₹${paymentData.amountPaid.toLocaleString('en-IN')}`
      );
    } catch (err: any) {
      addToast('error', 'Payment failed', err.response?.data?.error || 'Server error');
    }
  };

  // Add student handler
  const handleAddStudent = async (newStudent: Student) => {
    try {
      await api.post('/students', {
        name: newStudent.name,
        gradeClass: newStudent.gradeClass,
        section: newStudent.section || 'A',
        parentName: newStudent.parentName,
        parentPhone: newStudent.parentPhone,
        parentEmail: newStudent.parentEmail || '',
        enrollmentDate: newStudent.enrollmentDate || new Date().toISOString().split('T')[0],
        siblings: [],
      });
      await fetchData();
      setIsNewStudentModalOpen(false);
      addToast('success', 'Student Enrolled', `${newStudent.name} added.`);
    } catch (err: any) {
      addToast('error', 'Failed to add student', err.response?.data?.error);
    }
  };

  const handleUpdateSchoolInfo = async (newInfo: SchoolInfo) => {
    setSchoolInfo(newInfo);
    addToast('success', 'School info updated', 'Changes saved locally.');
  };

  const openPaymentForStudent = (student?: Student) => {
    setPreselectedStudentForPayment(student);
    setIsPaymentModalOpen(true);
  };

  const isLoggedInFlag = !!localStorage.getItem('token');

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-mono">Initializing Secure Cloud Fee Portal...</p>
      </div>
    );
  }

  if (!isLoggedInFlag) {
    return (
      <AuthScreen 
        schoolName={schoolInfo.name} 
        onSessionLogin={(email) => {
          setSessionEmail(email);
          setIsLoggedIn(true);
        }}
      />
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Student Directory', icon: Users, badge: students.length },
    { id: 'reminders', label: 'Payment Reminders', icon: Send, badge: overdueStudents.length > 0 ? overdueStudents.length : undefined, badgeColor: 'bg-rose-500' },
    { id: 'reports', label: 'Reports & Audits', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased flex flex-col selection:bg-teal-500 selection:text-white">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <Header
        schoolInfo={schoolInfo}
        staffMembers={staffMembers}
        currentStaff={currentStaff}
        setCurrentStaff={setCurrentStaff}
        onOpenPaymentModal={openPaymentForStudent}
        onViewLedger={(student) => setSelectedLedgerStudent(student)}
        students={students}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        overdueCount={overdueStudents.length}
        onNavigateToReminders={() => setActiveTab('reminders')}
        onNavigateToStudents={() => setActiveTab('students')}
        onLogout={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('staff');
          setIsLoggedIn(false);
          setSessionEmail(null);
        }}
        userEmail={sessionEmail || 'admin@school.edu'}
      />

      <nav className="bg-white border-b border-slate-200 sticky top-[65px] z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 overflow-x-auto no-scrollbar gap-2">
            <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        item.badgeColor ? `${item.badgeColor} text-white` : isActive ? 'bg-slate-800 text-teal-300' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center space-x-2 shrink-0 pl-2 border-l border-slate-200">
              <button
                onClick={() => setIsNewStudentModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden sm:inline">Add Student</span>
              </button>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="School Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            students={students}
            transactions={transactions}
            onOpenPaymentModal={openPaymentForStudent}
            onViewLedger={(student) => setSelectedLedgerStudent(student)}
            onViewReceipt={(tx) => setSelectedReceipt(tx)}
            onNavigateToStudents={() => setActiveTab('students')}
            onNavigateToReminders={() => setActiveTab('reminders')}
          />
        )}

        {activeTab === 'students' && (
          <StudentsList
            students={students}
            searchTerm={searchTerm}
            onRecordPayment={openPaymentForStudent}
            onViewLedger={(student) => setSelectedLedgerStudent(student)}
            onAddNewStudent={() => setIsNewStudentModalOpen(true)}
          />
        )}

        {activeTab === 'reminders' && (
          <RemindersCenter
            students={students}
            schoolInfo={schoolInfo}
            onRecordPayment={openPaymentForStudent}
            onViewLedger={(student) => setSelectedLedgerStudent(student)}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsCenter
            students={students}
            transactions={transactions}
            schoolInfo={schoolInfo}
            onViewReceipt={(tx) => setSelectedReceipt(tx)}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <p>© {new Date().getFullYear()} {schoolInfo.name}. Secured by PostgreSQL & JWT Auth.</p>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span className="text-emerald-700 font-bold">API Connected ({sessionEmail || 'admin@school.edu'})</span>
            <span>•</span>
            <span>WhatsApp Gateway Ready</span>
            <span>•</span>
            <span>v2.5</span>
          </div>
        </div>
      </footer>

      {isPaymentModalOpen && (
        <PaymentModal
          students={students}
          preselectedStudent={preselectedStudentForPayment}
          onClose={() => setIsPaymentModalOpen(false)}
          onSubmit={handleRecordPayment}
        />
      )}

      {selectedReceipt && (
        <ReceiptModal
          transaction={selectedReceipt}
          schoolInfo={schoolInfo}
          student={students.find(s => s.id === selectedReceipt.studentId)}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

      {selectedLedgerStudent && (
        <StudentLedgerModal
          student={selectedLedgerStudent}
          transactions={transactions.filter(t => t.studentId === selectedLedgerStudent.id)}
          schoolInfo={schoolInfo}
          onClose={() => setSelectedLedgerStudent(null)}
          onRecordPayment={() => {
            const std = selectedLedgerStudent;
            setSelectedLedgerStudent(null);
            openPaymentForStudent(std);
          }}
          onViewReceipt={(tx) => {
            setSelectedReceipt(tx);
          }}
        />
      )}

      {isNewStudentModalOpen && (
        <NewStudentModal
          schoolInfo={schoolInfo}
          onClose={() => setIsNewStudentModalOpen(false)}
          onAddStudent={handleAddStudent}
        />
      )}

      {isSettingsModalOpen && (
        <SettingsModal
          schoolInfo={schoolInfo}
          setSchoolInfo={handleUpdateSchoolInfo}
          staffMembers={staffMembers}
          setStaffMembers={setStaffMembers}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;