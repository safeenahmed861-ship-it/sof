import React from 'react';
import { useAuth } from '../context/AuthContext';
import { SYNDICATE_LOGO } from '../data/initialData';
import {
  Users,
  UserCheck,
  Clock,
  CalendarCheck2,
  AlertCircle,
  TrendingUp,
  Building,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Sparkles,
  PieChart,
  ChevronLeft,
} from 'lucide-react';

interface DashboardProps {
  onNavigateTab: (tab: any) => void;
  onOpenAIAssistant: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigateTab,
  onOpenAIAssistant,
}) => {
  const {
    employees,
    attendance,
    leaveRequests,
    announcements,
    updateLeaveStatus,
  } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculations
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === 'active').length;

  const todayAttendanceList = attendance.filter((a) => a.date === todayStr);
  const presentTodayCount = todayAttendanceList.filter(
    (a) => a.status === 'PRESENT' || a.status === 'LATE'
  ).length;

  const lateTodayCount = todayAttendanceList.filter(
    (a) => a.status === 'LATE'
  ).length;

  const onLeaveTodayCount = employees.filter(
    (e) => e.status === 'on_leave'
  ).length;

  const pendingLeaves = leaveRequests.filter((r) => r.status === 'PENDING');

  const attendanceRate = totalEmployees > 0
    ? Math.round((presentTodayCount / totalEmployees) * 100)
    : 0;

  // Department Distribution
  const departmentsList = Array.from(
    new Set(employees.map((e) => e.department))
  );

  const deptStats = departmentsList.map((dept) => {
    const deptEmployees = employees.filter((e) => e.department === dept);
    const count = deptEmployees.length;
    const percentage = Math.round((count / totalEmployees) * 100) || 0;
    return { name: dept, count, percentage };
  });

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-xs border border-slate-200/80 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={SYNDICATE_LOGO}
              alt="نقابة المحاسبين العراقيين"
              className="w-14 h-14 rounded-2xl object-cover ring-1 ring-emerald-500/30 shadow-sm bg-white p-0.5 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>نقابة المحاسبين العراقيين - المقر العام</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                منظومة إدارة الموظفين والحضور
              </h1>
              <p className="text-slate-500 text-xs font-medium max-w-xl">
                نظام إلكتروني مبسط لمتابعة الحضور والغياب ببصمة الأصبع والوجه، الإجازات، والتبليغات الإدارية.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenAIAssistant}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>المساعد الذكي</span>
            </button>
            <button
              onClick={() => onNavigateTab('attendance')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition flex items-center gap-1.5"
            >
              <span>تسجيل الحضور</span>
              <ChevronLeft className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Employees */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500">إجمالي الموظفين</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{totalEmployees}</span>
            <span className="text-xs text-indigo-700 font-extrabold flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-xl">
              <TrendingUp className="w-3.5 h-3.5" /> {activeEmployees} نشط
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full"
              style={{ width: `${(activeEmployees / (totalEmployees || 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-teal-300 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500">نسبة الحضور اليوم</span>
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{attendanceRate}%</span>
            <span className="text-xs text-teal-700 font-extrabold bg-teal-50 px-2.5 py-1 rounded-xl">
              {presentTodayCount} من {totalEmployees}
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-teal-600 h-full rounded-full transition-all"
              style={{ width: `${attendanceRate}%` }}
            ></div>
          </div>
        </div>

        {/* Late Today */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500">حالات التأخير</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-600">{lateTodayCount}</span>
            <span className="text-xs text-amber-800 font-extrabold bg-amber-50 px-2.5 py-1 rounded-xl">
              متابعة
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-400 mt-3">
            نسبة التأخير: {Math.round((lateTodayCount / (totalEmployees || 1)) * 100)}%
          </p>
        </div>

        {/* Pending Leave Requests */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-violet-300 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500">إجازات معلقة</span>
            <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{pendingLeaves.length}</span>
            <button
              onClick={() => onNavigateTab('leaves')}
              className="text-xs text-indigo-600 hover:underline font-black flex items-center gap-1"
            >
              <span>مراجعة</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] font-semibold text-slate-400 mt-3">
            {onLeaveTodayCount} موظفاً في إجازة
          </p>
        </div>

      </div>

      {/* Main Grid: Pending Approvals & Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pending Requests Actions (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span>طلبات الإجازة المعلقة</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                تتطلب اعتماد أو رفض المسؤول
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('leaves')}
              className="text-xs font-black text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              عرض الكل
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {pendingLeaves.length === 0 ? (
              <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">لا توجد طلبات إجازة معلقة حالياً</p>
                <p className="text-[11px] text-slate-400 mt-1">جميع الطلبات معالجة ومحدثة.</p>
              </div>
            ) : (
              pendingLeaves.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 bg-slate-50/40 hover:bg-indigo-50/20 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900">
                        {req.employeeName}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {req.department}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        تاريخ الطلب: {req.createdAt}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1">
                      <strong className="text-slate-800">السبب:</strong> {req.reason}
                    </p>
                    <div className="text-[11px] text-indigo-700 font-bold">
                      الفترة: من {req.startDate} إلى {req.endDate} ({req.daysCount} أيام)
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateLeaveStatus(req.id, 'APPROVED', 'تمت الموافقة من لوحة التحكم')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>موافقة</span>
                    </button>
                    <button
                      onClick={() => updateLeaveStatus(req.id, 'REJECTED', 'تم الرفض من لوحة التحكم')}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 text-xs font-extrabold transition flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>رفض</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Department Distribution (1 col) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              <span>توزيع الأقسام الإدارية</span>
            </h2>
            <span className="text-xs font-bold text-slate-400">{departmentsList.length} أقسام</span>
          </div>

          <div className="mt-4 space-y-4">
            {deptStats.map((dept, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-extrabold">
                  <span className="text-slate-700">{dept.name}</span>
                  <span className="text-indigo-700 font-black">
                    {dept.count} ({dept.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${dept.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center gap-3">
            <Building className="w-6 h-6 text-indigo-600 shrink-0" />
            <div className="text-xs text-indigo-900 font-medium">
              <span className="font-extrabold block">ملاحظة تنظيمية</span>
              يمكن توزيع المهام وإضافة أقسام جديدة من صفحة إعدادات الموظفين.
            </div>
          </div>
        </div>

      </div>

      {/* Today's Attendance Realtime List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" />
              <span>سجل الحضور المباشر اليوم ({todayStr})</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              متابعة حركة الحضور والانصراف والساعات المسجلة
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('attendance')}
            className="text-xs font-black text-indigo-600 hover:underline self-start sm:self-auto"
          >
            إدارة الحضور ⬅
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-extrabold border-b border-slate-200">
                <th className="p-3 rounded-r-xl">الموظف</th>
                <th className="p-3">وقت الدخول</th>
                <th className="p-3">وقت الخروج</th>
                <th className="p-3">الموقع</th>
                <th className="p-3">الحالة</th>
                <th className="p-3 rounded-l-xl">ملاحظات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.slice(0, 6).map((emp) => {
                const att = todayAttendanceList.find((a) => a.employeeId === emp.id);
                return (
                  <tr key={emp.id} className="hover:bg-indigo-50/20 transition">
                    <td className="p-3 font-extrabold text-slate-800">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200 shadow-xs"
                        />
                        <div>
                          <div className="text-slate-900">{emp.name}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{emp.jobTitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold dir-ltr text-right text-slate-700">
                      {att?.checkIn || '—'}
                    </td>
                    <td className="p-3 font-mono font-bold dir-ltr text-right text-slate-700">
                      {att?.checkOut || '—'}
                    </td>
                    <td className="p-3 text-slate-600 font-medium">
                      {att?.location || 'المقر الرئيسي'}
                    </td>
                    <td className="p-3">
                      {att?.status === 'PRESENT' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          حاضر
                        </span>
                      )}
                      {att?.status === 'LATE' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                          متأخر
                        </span>
                      )}
                      {att?.status === 'ON_LEAVE' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200">
                          في إجازة
                        </span>
                      )}
                      {(!att || att?.status === 'ABSENT') && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                          غائب / لم يبصم
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-500 font-medium max-w-xs truncate">
                      {att?.notes || 'لا يوجد ملاحظات'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
