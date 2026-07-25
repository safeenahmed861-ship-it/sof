import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Employee, Department, Role } from '../types';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Building,
  Phone,
  Mail,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Eye,
  Briefcase,
  DollarSign,
  Calendar,
  CreditCard,
} from 'lucide-react';

export const EmployeeManagement: React.FC = () => {
  const {
    employees,
    activeRole,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    deleteAllEmployees,
  } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Add Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'EMPLOYEE' as Role,
    department: 'تقنية المعلومات' as Department,
    jobTitle: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    joinDate: new Date().toISOString().split('T')[0],
    salary: 15000,
    status: 'active' as 'active' | 'on_leave' | 'inactive',
    workHoursPerDay: 8,
    monthlyLeaveDays: 2,
    nationalId: '10987654321',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('يرجى كتابة اسم الموظف والبريد الإلكتروني.');
      return;
    }
    addEmployee({
      ...formData,
      leaveBalance: {
        annual: formData.monthlyLeaveDays * 12,
        sick: 12,
        emergency: 5,
      },
    });
    setShowAddModal(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'EMPLOYEE',
      department: 'تقنية المعلومات',
      jobTitle: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      joinDate: new Date().toISOString().split('T')[0],
      salary: 15000,
      status: 'active',
      workHoursPerDay: 8,
      monthlyLeaveDays: 2,
      nationalId: '10987654321',
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;
    updateEmployee(editingEmployee.id, editingEmployee);
    setEditingEmployee(null);
  };

  const handleClearAll = () => {
    if (
      confirm(
        'هل أنت تأكد من مسح جميع الموظفين؟ ستتمكن بعدها من إضافة الموظفين الجدد بنفسك وتحديد عدد ساعات العمل وأيام الإجازات الشهرية.'
      )
    ) {
      deleteAllEmployees();
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'ALL' || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-extrabold">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>سجل ملفات الموظفين والهيكل التنظيمي</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            إدارة بيانات الموظفين والكادر الوظيفي
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-xl">
            سجل موحد شامل للبيانات الوظيفية، ساعات العمل اليومية، الإجازات الشهرية والرواتب.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 flex-wrap shrink-0">
          {activeRole === 'ADMIN' && (
            <>
              {employees.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 border border-slate-700 text-slate-300 font-extrabold text-xs shadow-lg transition flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>مسح جميع الموظفين</span>
                </button>
              )}

              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-black text-xs shadow-lg shadow-indigo-500/25 transition flex items-center gap-2 active:scale-95"
              >
                <UserPlus className="w-4 h-4 text-amber-300" />
                <span>إضافة موظف جديد</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
            <input
              type="text"
              placeholder="ابحث بالاسم، المسمى، أو الرقم الوظيفي..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-3 py-2.5 text-xs bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
            >
              <option value="ALL">جميع الأقسام الإدارية</option>
              <option value="تقنية المعلومات">تقنية المعلومات</option>
              <option value="الموارد البشرية">الموارد البشرية</option>
              <option value="التسويق والمبيعات">التسويق والمبيعات</option>
              <option value="المالية والحسابات">المالية والحسابات</option>
              <option value="العمليات والتشغيل">العمليات والتشغيل</option>
              <option value="التصميم والإبداع">التصميم والإبداع</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
            >
              <option value="ALL">جميع الحالات الوظيفية</option>
              <option value="active">نشط (على رأس العمل)</option>
              <option value="on_leave">في إجازة</option>
              <option value="inactive">غير نشط</option>
            </select>
          </div>

        </div>
      </div>

      {/* Employees Grid Cards or Empty State */}
      {filteredEmployees.length === 0 ? (
        <div className="bg-slate-900/90 rounded-3xl border border-dashed border-slate-800 p-12 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto shadow-inner">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">لا يوجد موظفون مسجلون حالياً</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 font-medium leading-relaxed">
              قم بإضافة موظفيك الجدد وتحديد عدد ساعات العمل اليومية وأيام الإجازة الشهرية المستحقة لكل موظف.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-black text-xs shadow-lg shadow-indigo-500/25 transition inline-flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-amber-300" />
            <span>إضافة أول موظف الآن</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl hover:border-slate-700 transition flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/30 shadow-md"
                    />
                    <div>
                      <h3 className="text-sm font-black text-white">{emp.name}</h3>
                      <p className="text-xs text-indigo-300 font-extrabold">{emp.jobTitle}</p>
                      <span className="text-[10px] font-mono text-slate-400">{emp.code}</span>
                    </div>
                  </div>

                  {emp.role === 'ADMIN' ? (
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      مدير
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      موظف
                    </span>
                  )}
                </div>

                {/* Info Snippets */}
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">القسم:</span>
                    <span className="font-extrabold text-white">{emp.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">ساعات العمل اليومية:</span>
                    <span className="font-black text-emerald-400 font-mono">
                      {emp.workHoursPerDay || 8} ساعات/يوم
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">الإجازة الشهرية:</span>
                    <span className="font-black text-indigo-400 font-mono">
                      {emp.monthlyLeaveDays || 2} أيام/شهر
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">البريد:</span>
                    <span className="font-mono text-slate-300 font-semibold truncate max-w-[150px]">{emp.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">الهاتف:</span>
                    <span className="font-mono text-slate-300 font-semibold dir-ltr">{emp.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">الحالة:</span>
                    {emp.status === 'active' && (
                      <span className="text-emerald-300 font-extrabold bg-emerald-500/10 px-2.5 py-0.5 rounded-full text-[10px] border border-emerald-500/30">
                        نشط
                      </span>
                    )}
                    {emp.status === 'on_leave' && (
                      <span className="text-indigo-300 font-extrabold bg-indigo-500/10 px-2.5 py-0.5 rounded-full text-[10px] border border-indigo-500/30">
                        في إجازة
                      </span>
                    )}
                    {emp.status === 'inactive' && (
                      <span className="text-slate-400 font-extrabold bg-slate-800 px-2.5 py-0.5 rounded-full text-[10px] border border-slate-700">
                        غير نشط
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setViewingEmployee(emp)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>عرض الملف</span>
                </button>

                {activeRole === 'ADMIN' && (
                  <>
                    <button
                      onClick={() => setEditingEmployee(emp)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                      title="تعديل الموظف"
                    >
                      <Edit className="w-4 h-4 text-indigo-400" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`هل أنت تأكد من حذف الموظف ${emp.name}؟`)) {
                          deleteEmployee(emp.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 border border-slate-700 text-slate-400 transition"
                      title="حذف الموظف"
                    >
                      <Trash2 className="w-4 h-4 text-rose-400" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Viewing Dossier Modal */}
      {viewingEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-lg p-6 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={viewingEmployee.avatar}
                  alt={viewingEmployee.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-md"
                />
                <div>
                  <h3 className="text-base font-black text-white">{viewingEmployee.name}</h3>
                  <p className="text-xs text-indigo-300 font-extrabold">{viewingEmployee.jobTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingEmployee(null)}
                className="text-slate-400 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-400 block font-medium">الرقم الوظيفي:</span>
                  <span className="font-black font-mono text-white">{viewingEmployee.code}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">الهوية الوطنية:</span>
                  <span className="font-black font-mono text-white">{viewingEmployee.nationalId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">القسم الإداري:</span>
                  <span className="font-black text-indigo-300">{viewingEmployee.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">تاريخ المباشرة:</span>
                  <span className="font-black text-white">{viewingEmployee.joinDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">ساعات العمل اليومية:</span>
                  <span className="font-black text-emerald-400 font-mono">
                    {viewingEmployee.workHoursPerDay || 8} ساعات
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">الإجازة الشهرية:</span>
                  <span className="font-black text-indigo-400 font-mono">
                    {viewingEmployee.monthlyLeaveDays || 2} أيام / شهر
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">الراتب الأساسي:</span>
                  <span className="font-black text-white font-mono">
                    {viewingEmployee.salary.toLocaleString()} ر.س
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">الصلاحية:</span>
                  <span className="font-black text-amber-300">
                    {viewingEmployee.role === 'ADMIN' ? 'مدير نظام' : 'موظف'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl space-y-2">
                <span className="font-black text-indigo-300 block">رصيد الإجازات المتبقي</span>
                <div className="flex items-center justify-between text-xs text-slate-200 pt-1">
                  <span>سنوية: <strong className="text-emerald-400 font-mono">{viewingEmployee.leaveBalance.annual} يوم</strong></span>
                  <span>مرضية: <strong className="text-amber-400 font-mono">{viewingEmployee.leaveBalance.sick} يوم</strong></span>
                  <span>طارئة: <strong className="text-rose-400 font-mono">{viewingEmployee.leaveBalance.emergency} يوم</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setViewingEmployee(null)}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs transition border border-slate-700"
            >
              إغلاق الملف
            </button>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <span>إضافة موظف جديد للكادر</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">اسم الموظف</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: عبدالملك القحطاني"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">المسمى الوظيفي</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مهندس شبكات"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    placeholder="emp@masar.sa"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">رقم الجوال</label>
                  <input
                    type="text"
                    required
                    placeholder="0501234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium dir-ltr"
                  />
                </div>
              </div>

              {/* Work Hours and Monthly Leave Quota */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <div>
                  <label className="text-xs font-bold text-emerald-900 block mb-1">
                    عدد ساعات العمل اليومية
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    required
                    placeholder="8"
                    value={formData.workHoursPerDay}
                    onChange={(e) =>
                      setFormData({ ...formData, workHoursPerDay: Number(e.target.value) })
                    }
                    className="w-full text-xs p-2 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-emerald-900 block mb-1">
                    عدد أيام الإجازة الشهرية
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    required
                    placeholder="2"
                    value={formData.monthlyLeaveDays}
                    onChange={(e) =>
                      setFormData({ ...formData, monthlyLeaveDays: Number(e.target.value) })
                    }
                    className="w-full text-xs p-2 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">القسم الإداري</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                  >
                    <option value="تقنية المعلومات">تقنية المعلومات</option>
                    <option value="الموارد البشرية">الموارد البشرية</option>
                    <option value="التسويق والمبيعات">التسويق والمبيعات</option>
                    <option value="المالية والحسابات">المالية والحسابات</option>
                    <option value="العمليات والتشغيل">العمليات والتشغيل</option>
                    <option value="التصميم والإبداع">التصميم والإبداع</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الصلاحية</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                  >
                    <option value="EMPLOYEE">موظف عادي</option>
                    <option value="ADMIN">مدير موارد بشرية / نظام</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الراتب الأساسي (ر.س)</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">تاريخ المباشرة</label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                >
                  حفظ إضافة الموظف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-emerald-600" />
                <span>تعديل بيانات الموظف</span>
              </h3>
              <button
                onClick={() => setEditingEmployee(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">الاسم</label>
                <input
                  type="text"
                  value={editingEmployee.name}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">المسمى الوظيفي</label>
                  <input
                    type="text"
                    value={editingEmployee.jobTitle}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, jobTitle: e.target.value })}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الراتب الأساسي</label>
                  <input
                    type="number"
                    value={editingEmployee.salary}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, salary: Number(e.target.value) })}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              {/* Work hours & monthly leave */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <div>
                  <label className="text-xs font-bold text-emerald-900 block mb-1">
                    ساعات العمل اليومية
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={editingEmployee.workHoursPerDay || 8}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        workHoursPerDay: Number(e.target.value),
                      })
                    }
                    className="w-full text-xs p-2 bg-white border border-emerald-200 rounded-xl font-bold text-emerald-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-emerald-900 block mb-1">
                    أيام الإجازة الشهرية
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={editingEmployee.monthlyLeaveDays || 2}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        monthlyLeaveDays: Number(e.target.value),
                      })
                    }
                    className="w-full text-xs p-2 bg-white border border-emerald-200 rounded-xl font-bold text-emerald-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الحالة الوظيفية</label>
                  <select
                    value={editingEmployee.status}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="active">نشط</option>
                    <option value="on_leave">في إجازة</option>
                    <option value="inactive">غير نشط</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الصلاحية</label>
                  <select
                    value={editingEmployee.role}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        role: e.target.value as any,
                      })
                    }
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="EMPLOYEE">موظف</option>
                    <option value="ADMIN">مدير</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
