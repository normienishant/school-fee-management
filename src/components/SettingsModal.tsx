import React, { useState } from 'react';
import { SchoolInfo, StaffMember } from '../types';
import { X, Building2, Save, Plus, Check } from 'lucide-react';

interface SettingsModalProps {
  schoolInfo: SchoolInfo;
  setSchoolInfo: (info: SchoolInfo) => void;
  staffMembers: StaffMember[];
  setStaffMembers: (staff: StaffMember[]) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  schoolInfo,
  setSchoolInfo,
  staffMembers,
  setStaffMembers,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'school' | 'staff'>('school');

  // School form
  const [name, setName] = useState(schoolInfo.name);
  const [tagline, setTagline] = useState(schoolInfo.tagline);
  const [address, setAddress] = useState(schoolInfo.address);
  const [phone, setPhone] = useState(schoolInfo.phone);
  const [email, setEmail] = useState(schoolInfo.email);
  const [academicYear, setAcademicYear] = useState(schoolInfo.academicYear);

  // New staff form
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'Accountant' | 'Principal' | 'Admin Clerk' | 'Fee Collector'>('Fee Collector');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSchool = (e: React.FormEvent) => {
    e.preventDefault();
    setSchoolInfo({
      ...schoolInfo,
      name,
      tagline,
      address,
      phone,
      email,
      academicYear,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;

    const newStaff: StaffMember = {
      id: `STF-${Date.now()}`,
      name: newStaffName.trim(),
      role: newStaffRole,
      email: `${newStaffName.toLowerCase().replace(/\s+/g, '.')}@stjudeschool.edu`,
      phone: "+91 98765 00099",
      active: true,
    };

    setStaffMembers([...staffMembers, newStaff]);
    setNewStaffName('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <Building2 className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-sm sm:text-base text-white">School Configuration & Staff Accounts</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-3">
          <button
            onClick={() => setActiveTab('school')}
            className={`px-4 py-2 font-bold text-xs border-b-2 transition-colors cursor-pointer ${
              activeTab === 'school'
                ? 'border-teal-500 text-slate-900 bg-white rounded-t-xl border-x border-t border-slate-200'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            School Profile
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-2 font-bold text-xs border-b-2 transition-colors cursor-pointer ${
              activeTab === 'staff'
                ? 'border-teal-500 text-slate-900 bg-white rounded-t-xl border-x border-t border-slate-200'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Staff & Cashiers ({staffMembers.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 text-xs space-y-4">
          
          {activeTab === 'school' && (
            <form onSubmit={handleSaveSchool} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">School Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tagline / Motto</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Academic Session</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                {savedSuccess ? (
                  <span className="text-emerald-600 font-bold flex items-center space-x-1">
                    <Check className="w-4 h-4" />
                    <span>Settings Updated Successfully!</span>
                  </span>
                ) : <span></span>}

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md cursor-pointer transition-colors flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4 text-teal-400" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'staff' && (
            <div className="space-y-4">
              
              {/* Existing Staff List */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-700 text-xs">Active Cashiers & Administrators</h4>
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                  {staffMembers.map((staff) => (
                    <div key={staff.id} className="p-3 bg-slate-50 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{staff.name}</div>
                        <div className="text-[10px] text-slate-500">{staff.email}</div>
                      </div>
                      <span className="bg-slate-200 text-slate-800 font-bold px-2.5 py-0.5 rounded text-[10px]">
                        {staff.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Staff Form */}
              <form onSubmit={handleAddStaff} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs flex items-center space-x-1">
                  <Plus className="w-4 h-4 text-teal-600" />
                  <span>Add New Staff Account</span>
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Staff Full Name"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    required
                  />

                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value as any)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
                  >
                    <option value="Fee Collector">Fee Collector</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Principal">Principal</option>
                    <option value="Admin Clerk">Admin Clerk</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
                >
                  Create Staff Account
                </button>
              </form>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
