import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  MapPin,
  CheckCircle2,
  Calendar,
  Sparkles,
  AlertCircle,
  Briefcase,
  UserCheck,
  Megaphone,
  ArrowRight,
  ShieldCheck,
  LogOut,
  Send,
} from 'lucide-react';

interface EmployeeDashboardProps {
  onNavigateTab: (tab: any) => void;
  onOpenAIAssistant: () => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  onNavigateTab,
  onOpenAIAssistant,
}) => {
  const {
    currentUser,
    todayAttendance,
    punchIn,
    punchOut,
    leaveRequests,
    announcements,
    markAnnouncementRead,
  } = useAuth();

  const [locationInput, setLocationInput] = useState('المقر الرئيسي - الرياض');
  const [notesInput, setNotesInput] = useState('');
  const [showPunchModal, setShowPunchModal] = useState(false);

  if (!currentUser) return null;

  const myLeaves = leaveRequests.filter((r) => r.employeeId === currentUser.id);

  const isCheckedIn = !!(todayAttendance && todayAttendance.checkIn && !todayAttendance.checkOut);
  const isCheckedOut = !!(todayAttendance && todayAttendance.checkOut);

  return (
    <div className="space-y-6">
      
      {/* Employee Greeting Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black">أهلاً بك، {currentUser.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 border border-white/30 text-white">
                  {currentUser.department}
                </span>
              </div>
              <p className="text-emerald-100 text-xs mt-1">
                {currentUser.jobTitle} • الرقم الوظيفي: {currentUser.code}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAIAssistant}
              className="px-4 py-2 rounded-xl bg-amber-400 text-emerald-950 hover:bg-amber-300 text-xs font-extrabold shadow-sm transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>مساعد الموارد البشرية</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Punch Clock + Leave Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Punch Clock Card (1.5 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">البصمة الإلكترونية المباشرة</h2>
                  <p className="text-xs text-slate-500">تسجيل الحضور والانصراف اليومي للدوام</p>
                </div>
              </div>

              {isCheckedIn && !isCheckedOut && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  مسجل حضور حالياً
                </span>
              )}
              {isCheckedOut && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                  تم تسجيل الانصراف
                </span>
              )}
              {!isCheckedIn && !isCheckedOut && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  غير مسجل حضور اليوم
                </span>
              )}
            </div>

            {/* Time Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 block font-semibold">وقت الدخول</span>
                <span className="text-base font-extrabold text-slate-800 font-mono dir-ltr block mt-0.5">
                  {todayAttendance?.checkIn || '—:—'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500 block font-semibold">وقت الخروج</span>
                <span className="text-base font-extrabold text-slate-800 font-mono dir-ltr block mt-0.5">
                  {todayAttendance?.checkOut || '—:—'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-500 block font-semibold">الموقع الجغرافي</span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-1 truncate">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {todayAttendance?.location || locationInput}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {!isCheckedIn && !isCheckedOut && (
              <button
                onClick={() => punchIn(locationInput, notesInput)}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                <UserCheck className="w-5 h-5" />
                <span>تسجيل دخول الدوام الان (Punch In)</span>
              </button>
            )}

            {isCheckedIn && !isCheckedOut && (
              <button
                onClick={punchOut}
                className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-md shadow-amber-600/20 transition flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                <span>تسجيل انصراف الدوام (Punch Out)</span>
              </button>
            )}

            {isCheckedOut && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs text-center font-bold border border-emerald-200 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                كتملت ساعات الدوام لهذا اليوم ({todayAttendance?.workHours || 8} ساعات). نتمنى لك يوماً سعيداً!
              </div>
            )}
          </div>
        </div>

        {/* Leave Balances Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>رصيد الإجازات المتبقي</span>
              </h2>
              <button
                onClick={() => onNavigateTab('leaves')}
                className="text-xs text-emerald-600 font-bold hover:underline"
              >
                طلب إجازة ⬅
              </button>
            </div>

            <div className="space-y-3 mt-4">
              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">الإجازة السنوية</span>
                  <span className="text-[10px] text-emerald-700">المستحقة للسنة الحالية</span>
                </div>
                <div className="text-left">
                  <span className="text-2xl font-black text-emerald-800">
                    {currentUser.leaveBalance.annual}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold mr-1">يوم</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-900 block">الإجازة المرضية</span>
                  <span className="text-[10px] text-blue-700">تتطلب تقرير طبي</span>
                </div>
                <div className="text-left">
                  <span className="text-2xl font-black text-blue-800">
                    {currentUser.leaveBalance.sick}
                  </span>
                  <span className="text-[10px] text-blue-700 font-bold mr-1">يوم</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-900 block">الإجازة الطارئة</span>
                  <span className="text-[10px] text-amber-700">للظروف الاستثنائية</span>
                </div>
                <div className="text-left">
                  <span className="text-2xl font-black text-amber-800">
                    {currentUser.leaveBalance.emergency}
                  </span>
                  <span className="text-[10px] text-amber-700 font-bold mr-1">يوم</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('leaves')}
            className="w-full mt-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <span>تقديم طلب إجازة جديد</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Grid: My Requests + Bulletins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* My Leave Requests */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">طلبات الإجازة الخاصة بي</h2>
            <button
              onClick={() => onNavigateTab('leaves')}
              className="text-xs text-emerald-600 font-bold hover:underline"
            >
              عرض الكل
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {myLeaves.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                لم تقدم أي طلبات إجازة حتى الآن.
              </p>
            ) : (
              myLeaves.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-200 bg-slate-50/50 transition flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">
                        إجازة {req.leaveType === 'annual' ? 'سنوية' : req.leaveType === 'sick' ? 'مرضية' : 'طارئة'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ({req.daysCount} أيام)
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      من {req.startDate} إلى {req.endDate}
                    </div>
                  </div>

                  <div>
                    {req.status === 'PENDING' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        قيد الانتظار
                      </span>
                    )}
                    {req.status === 'APPROVED' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        مقبولة
                      </span>
                    )}
                    {req.status === 'REJECTED' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        مرفوضة
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Announcements Feed */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-emerald-600" />
              <span>التبليغات والإعلانات الإدارية</span>
            </h2>
            <button
              onClick={() => onNavigateTab('announcements')}
              className="text-xs text-emerald-600 font-bold hover:underline"
            >
              عرض التبليغات
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {announcements.slice(0, 3).map((ann) => {
              const isRead = ann.readBy.includes(currentUser.id);
              return (
                <div
                  key={ann.id}
                  className={`p-3.5 rounded-xl border transition ${
                    isRead
                      ? 'border-slate-200 bg-slate-50/50'
                      : 'border-emerald-200 bg-emerald-50/30 ring-1 ring-emerald-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-xs text-slate-900 flex items-center gap-2">
                      {!isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      )}
                      {ann.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{ann.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {ann.content}
                  </p>
                  {!isRead && (
                    <button
                      onClick={() => markAnnouncementRead(ann.id)}
                      className="mt-2 text-[11px] font-bold text-emerald-700 hover:underline"
                    >
                      تأكيد القراءة 🗸
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
