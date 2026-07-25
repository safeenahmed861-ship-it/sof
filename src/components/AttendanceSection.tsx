import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AttendanceStatus } from '../types';
import {
  Clock,
  Search,
  Filter,
  Download,
  PlusCircle,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Edit,
  UserCheck,
} from 'lucide-react';

export const AttendanceSection: React.FC = () => {
  const {
    attendance,
    employees,
    currentUser,
    activeRole,
    todayAttendance,
    punchIn,
    punchOut,
  } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState('');

  // Location & notes
  const [location, setLocation] = useState('المقر الرئيسي - الرياض');
  const [notes, setNotes] = useState('');

  const isCheckedIn = !!(todayAttendance && todayAttendance.checkIn && !todayAttendance.checkOut);
  const isCheckedOut = !!(todayAttendance && todayAttendance.checkOut);

  // Filter attendance records
  const filteredRecords = attendance.filter((rec) => {
    const matchesSearch =
      rec.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rec.notes && rec.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      selectedStatus === 'ALL' || rec.status === selectedStatus;

    const matchesDate = !selectedDate || rec.date === selectedDate;

    const emp = employees.find((e) => e.id === rec.employeeId);
    const matchesDept =
      selectedDept === 'ALL' || (emp && emp.department === selectedDept);

    return matchesSearch && matchesStatus && matchesDate && matchesDept;
  });

  const exportCSV = () => {
    const headers = 'الموظف,التاريخ,وقت الدخول,وقت الخروج,ساعات العمل,الحالة,الموقع,ملاحظات\n';
    const rows = filteredRecords
      .map(
        (r) =>
          `"${r.employeeName}","${r.date}","${r.checkIn || ''}","${
            r.checkOut || ''
          }",${r.workHours},"${r.status}","${r.location || ''}","${
            r.notes || ''
          }"`
      )
      .join('\n');
    const blob = new Blob(['\uFEFF' + headers + rows], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `تقرير_الحضور_والانصراف_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-extrabold">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>نظام تسجيل الحضور والانصراف والبصمة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            سجلات الحضور والبصمة الإلكترونية
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-xl">
            تابع وسجل ساعات العمل والمغادرات وحالات التأخير بدقة عالية وبصمة فورية.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="relative z-10 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-extrabold border border-slate-700 transition flex items-center gap-2 shrink-0 shadow-lg"
        >
          <Download className="w-4 h-4 text-indigo-400" />
          <span>تصدير تقرير CSV</span>
        </button>
      </div>

      {/* Interactive Punch Clock Card */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <h2 className="text-base font-black text-white">
                تسجيل الحضور والانصراف السريع (البصمة)
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              الموظف الحالي: <strong className="text-white font-bold">{currentUser?.name}</strong> ({currentUser?.jobTitle})
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-xl">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-slate-400 font-bold">الموقع:</span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent font-bold text-white focus:outline-none border-b border-dashed border-slate-700"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-xl">
                <span className="text-slate-400 font-bold">ملاحظة:</span>
                <input
                  type="text"
                  placeholder="مثال: استئذان..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-transparent font-medium text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Punch Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {!isCheckedIn && !isCheckedOut && (
              <button
                onClick={() => punchIn(location, notes)}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>تسجيل حضور (Check In)</span>
              </button>
            )}

            {isCheckedIn && !isCheckedOut && (
              <button
                onClick={punchOut}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow-lg shadow-amber-600/25 transition flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                <span>تسجيل انصراف (Check Out)</span>
              </button>
            )}

            {isCheckedOut && (
              <div className="px-5 py-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-black flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>تم إكمال الدوام لهذا اليوم</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
            <input
              type="text"
              placeholder="ابحث باسم الموظف أو الملاحظات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-3 py-2.5 text-xs bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          {/* Department Filter */}
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

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
            >
              <option value="ALL">جميع الحالات</option>
              <option value="PRESENT">حاضر في الوقت</option>
              <option value="LATE">متأخر</option>
              <option value="ON_LEAVE">في إجازة</option>
              <option value="ABSENT">غائب</option>
            </select>
          </div>

          {/* Date Picker Filter */}
          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 text-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
            />
          </div>

        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-black text-white">
            سجل الحضور التفصيلي ({filteredRecords.length} سجلات)
          </h3>
          {selectedDate && (
            <button
              onClick={() => setSelectedDate('')}
              className="text-xs text-indigo-400 font-extrabold hover:underline"
            >
              إلغاء فلترة التاريخ
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-950/60 text-slate-400 font-black border-b border-slate-800">
                <th className="p-4">الموظف</th>
                <th className="p-4">التاريخ</th>
                <th className="p-4">وقت الدخول</th>
                <th className="p-4">وقت الخروج</th>
                <th className="p-4">ساعات العمل</th>
                <th className="p-4">الموقع الجغرافي</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">الملاحظات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-500 font-medium">
                    لا توجد سجلات حضور تطابق خيارات البحث المحددة.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => {
                  const emp = employees.find((e) => e.id === rec.employeeId);
                  return (
                    <tr key={rec.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-black text-white">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              emp?.avatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                            }
                            alt={rec.employeeName}
                            className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-800 shadow-sm"
                          />
                          <div>
                            <div className="text-white">{rec.employeeName}</div>
                            <div className="text-[10px] text-slate-400 font-medium">
                              {emp?.department || '—'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-slate-300 font-mono">
                        {rec.date}
                      </td>
                      <td className="p-4 font-mono font-bold dir-ltr text-right">
                        {rec.checkIn ? (
                          <span className="text-emerald-400">{rec.checkIn}</span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="p-4 font-mono font-bold dir-ltr text-right">
                        {rec.checkOut ? (
                          <span className="text-teal-400">{rec.checkOut}</span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="p-4 font-extrabold text-slate-200">
                        {rec.workHours > 0 ? `${rec.workHours} ساعة` : '—'}
                      </td>
                      <td className="p-4 text-slate-400 font-medium">
                        {rec.location || 'المقر الرئيسي'}
                      </td>
                      <td className="p-4">
                        {rec.status === 'PRESENT' && (
                          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                            حاضر
                          </span>
                        )}
                        {rec.status === 'LATE' && (
                          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-300 border border-amber-500/30">
                            متأخر
                          </span>
                        )}
                        {rec.status === 'ON_LEAVE' && (
                          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                            في إجازة
                          </span>
                        )}
                        {rec.status === 'ABSENT' && (
                          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-300 border border-rose-500/30">
                            غائب
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-400 font-medium max-w-xs truncate">
                        {rec.notes || '—'}
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
