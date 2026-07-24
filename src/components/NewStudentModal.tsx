import React, { useState } from 'react';
import { Student, SchoolInfo } from '../types';
import { X, UserPlus, CheckCircle, Calculator } from 'lucide-react';

interface NewStudentModalProps {
  schoolInfo: SchoolInfo;
  onClose: () => void;
  onAddStudent: (student: Student) => void;
}

export const NewStudentModal: React.FC<NewStudentModalProps> = ({
  schoolInfo,
  onClose,
  onAddStudent,
}) => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState(`STU-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [gradeClass, setGradeClass] = useState('Grade 10-A');
  const [section, setSection] = useState('A');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');

  // Custom fee structure setup
  const [tuitionFee, setTuitionFee] = useState<number>(30000);
  const [transportFee, setTransportFee] = useState<number>(6000);
  const [examFee, setExamFee] = useState<number>(3000);
  const [activityFee, setActivityFee] = useState<number>(4000);
  const [discount, setDiscount] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !parentPhone.trim()) return;

    const totalFee = tuitionFee + transportFee + examFee + activityFee - discount;

    const newStudent: Student = {
      id: `STU-${Date.now()}`,
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      gradeClass,
      section,
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      parentEmail: parentEmail.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      totalFee,
      paidFee: 0,
      pendingBalance: totalFee,
      status: 'UNPAID',
      feeBreakdown: {
        tuitionFee,
        transportFee,
        examFee,
        activityFee,
        discount,
      },
      dueDate: "2026-07-31",
      address: "Metro City"
    };

    onAddStudent(newStudent);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <UserPlus className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">New Student Enrollment</h3>
              <p className="text-[11px] text-slate-400">Add student & automatically calculate fee ledger</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name</label>
              <input
                type="text"
                placeholder="e.g. Aarav Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Roll / Admission #</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Grade & Section</label>
              <select
                value={gradeClass}
                onChange={(e) => setGradeClass(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
              >
                {['Grade 1-A', 'Grade 2-A', 'Grade 3-A', 'Grade 4-A', 'Grade 5-A', 'Grade 6-A', 'Grade 7-A', 'Grade 8-A', 'Grade 9-A', 'Grade 10-A'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Parent Email (Optional)</label>
              <input
                type="email"
                placeholder="parent@gmail.com"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Parent / Guardian Name</label>
              <input
                type="text"
                placeholder="e.g. Rajesh Sharma"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Phone Number</label>
              <input
                type="text"
                placeholder="+91 9876543210"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                required
              />
              <div className="flex items-center space-x-1.5 mt-1">
                <span className="text-[10px] text-slate-400">Demo Fill:</span>
                <button
                  type="button"
                  onClick={() => {
                    setParentPhone('+91 9871610154');
                    setParentEmail('yashsaini1919@gmail.com');
                  }}
                  className="text-[10px] font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-1.5 py-0.5 rounded cursor-pointer"
                >
                  9871610154
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setParentPhone('+91 9625784184');
                    setParentEmail('yashsaini@8vdigital.com');
                  }}
                  className="text-[10px] font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-1.5 py-0.5 rounded cursor-pointer"
                >
                  9625784184
                </button>
              </div>
            </div>
          </div>

          {/* Fee Structure Customizer */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-800 text-xs flex items-center space-x-1">
              <Calculator className="w-3.5 h-3.5 text-teal-600" />
              <span>Base Fee Structure Setup (AY {schoolInfo.academicYear})</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 block">Tuition Fee (₹)</span>
                <input
                  type="number"
                  value={tuitionFee}
                  onChange={(e) => setTuitionFee(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">Transport Fee (₹)</span>
                <input
                  type="number"
                  value={transportFee}
                  onChange={(e) => setTransportFee(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">Exam Fee (₹)</span>
                <input
                  type="number"
                  value={examFee}
                  onChange={(e) => setExamFee(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">Activity & Lab (₹)</span>
                <input
                  type="number"
                  value={activityFee}
                  onChange={(e) => setActivityFee(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                />
              </div>

              <div className="col-span-2">
                <span className="text-[10px] text-slate-500 block">Scholarship / Discount (₹)</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-emerald-600"
                />
              </div>
            </div>
          </div>

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
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl shadow-md cursor-pointer transition-all flex items-center space-x-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Enroll Student</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
