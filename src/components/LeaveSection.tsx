import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LeaveType, LeaveStatus } from '../types';
import {
  CalendarDays,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  FileText,
  User,
  AlertCircle,
  Filter,
} from 'lucide-react';

export const LeaveSection: React.FC = () => {
  const {
    leaveRequests,
    currentUser,
    activeRole,
    submitLeaveRequest,
    updateLeaveStatus,
  } = useAuth();

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Form State
  const [leaveType, setLeaveType] = useState<LeaveType>('annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isAiPolishing, setIsAiPolishing] = useState(false);
  const [reviewNotesInput, setReviewNotesInput] = useState<{ [key: string]: string }>({});

  // Auto calculate days
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 1;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const daysCount = calculateDays();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      alert('يرجى تعبئة كافة التواريخ وأسباب الإجازة.');
      return;
    }
    submitLeaveRequest({
      leaveType,
      startDate,
      endDate,
      daysCount,
      reason,
    });
    setShowApplyModal(false);
    setReason('');
    setStartDate('');
    setEndDate('');
  };

  const handleAiPolishReason = async () => {
    if (!reason.trim()) {
      alert('يرجى كتابة فكرة أو ملخص للسبب أولاً قبل تحسينه بالذكاء الاصطناعي.');
      return;
    }
    setIsAiPolishing(true);
    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `قم بصياغة السبب التالي لطلب إجازة وظيفية بأسلوب رسمي ومهني وافي ومحترم جداً باللغة العربية: "${reason}"`,
        }),
      });
      const data = await res.json();
      if (data.text) {
        setReason(data.text.replace(/^["']|["']$/g, '').trim());
      }
    } catch (err) {
      console.error(err);
      // Fallback polishing
      setReason(
        `أتقدم بطلب إجازة ${
          leaveType === 'annual' ? 'سنوية' : 'طارئة'
        } نظراً لـ ${reason}، مع التزامي التام بتنسيق وتغطية كافة المهام الموكلة إليّ قبل بدء فترة الإجازة.`
      );
    } finally {
      setIsAiPolishing(false);
    }
  };

  const filteredRequests = leaveRequests.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-extrabold">
            <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
            <span>نظام إدارة وإعتماد الإجازات الرسمية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            طلبات الإجازات والرصيد المستحق
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-xl">
            قدم طلبات الإجازة بكل سهولة وتابع موافقات الموارد البشرية مباشرة.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="relative z-10 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-black text-xs shadow-lg shadow-indigo-500/25 transition flex items-center gap-2 shrink-0 active:scale-95"
        >
          <PlusCircle className="w-4 h-4 text-amber-300" />
          <span>تقديم طلب إجازة جديد</span>
        </button>
      </div>

      {/* Leave Balances Header Cards */}
      {currentUser && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between hover:border-emerald-500/40 transition">
            <div>
              <span className="text-xs font-extrabold text-slate-400 block">الإجازة السنوية</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">
                {currentUser.leaveBalance.annual} أيام
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-extrabold text-xs">
              سنوية
            </div>
          </div>

          <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between hover:border-indigo-500/40 transition">
            <div>
              <span className="text-xs font-extrabold text-slate-400 block">الإجازة المرضية</span>
              <span className="text-2xl font-black text-indigo-400 mt-1 block">
                {currentUser.leaveBalance.sick} أيام
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-extrabold text-xs">
              مرضية
            </div>
          </div>

          <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between hover:border-amber-500/40 transition">
            <div>
              <span className="text-xs font-extrabold text-slate-400 block">الإجازة الطارئة</span>
              <span className="text-2xl font-black text-amber-400 mt-1 block">
                {currentUser.leaveBalance.emergency} أيام
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-extrabold text-xs">
              طارئة
            </div>
          </div>
        </div>
      )}

      {/* Requests Filter Tabs */}
      <div className="bg-slate-900/90 p-3 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-2">
          {[
            { id: 'ALL', label: 'جميع الطلبات' },
            { id: 'PENDING', label: 'قيد الانتظار' },
            { id: 'APPROVED', label: 'المقبولة' },
            { id: 'REJECTED', label: 'المرفوضة' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition whitespace-nowrap ${
                filterStatus === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-bold hidden sm:block px-3">
          إجمالي النتائج: {filteredRequests.length} طلب
        </span>
      </div>

      {/* Leave Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl">
            <CalendarDays className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-black text-slate-200">لا توجد طلبات إجازة تطابق هذا الفلتر</p>
            <p className="text-xs text-slate-400 mt-1">يمكنك تقديم طلب إجازة جديد في أي وقت.</p>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl hover:border-slate-700 transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-black text-white">{req.employeeName}</h3>
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-slate-800 text-slate-300 border border-slate-700">
                        {req.department}
                      </span>
                      <span className="text-xs font-black text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20">
                        نوع الإجازة: {req.leaveType === 'annual' ? 'سنوية' : req.leaveType === 'sick' ? 'مرضية' : req.leaveType === 'emergency' ? 'طارئة' : 'بدون راتب'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-medium">تاريخ التقديم: {req.createdAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {req.status === 'PENDING' && (
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      قيد الانتظار
                    </span>
                  )}
                  {req.status === 'APPROVED' && (
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      مقبول
                    </span>
                  )}
                  {req.status === 'REJECTED' && (
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" />
                      مرفوض
                    </span>
                  )}
                </div>
              </div>

              {/* Details & Reason */}
              <div className="text-xs text-slate-300 space-y-2 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                <div>
                  <strong className="text-white font-extrabold">فترة الإجازة المطلوبة:</strong> من{' '}
                  <span className="font-mono font-bold text-indigo-400">{req.startDate}</span> إلى{' '}
                  <span className="font-mono font-bold text-indigo-400">{req.endDate}</span> (إجمالي{' '}
                  <strong className="text-indigo-300">{req.daysCount} أيام</strong>)
                </div>
                <div className="leading-relaxed">
                  <strong className="text-white font-extrabold">سبب الطلب:</strong> {req.reason}
                </div>
                {req.reviewNotes && (
                  <div className="mt-3 pt-3 border-t border-slate-800 text-indigo-300 font-medium">
                    <strong>رد الموارد البشرية ({req.reviewedBy}):</strong> {req.reviewNotes}
                  </div>
                )}
              </div>

              {/* Admin Action Buttons */}
              {activeRole === 'ADMIN' && req.status === 'PENDING' && (
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    placeholder="إضافة ملاحظات اعتماد أو رفض للموظف..."
                    value={reviewNotesInput[req.id] || ''}
                    onChange={(e) =>
                      setReviewNotesInput({
                        ...reviewNotesInput,
                        [req.id]: e.target.value,
                      })
                    }
                    className="flex-1 text-xs bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-2xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() =>
                        updateLeaveStatus(
                          req.id,
                          'APPROVED',
                          reviewNotesInput[req.id] || 'تمت الموافقة المباشرة'
                        )
                      }
                      className="flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>اعتماد الإجازة</span>
                    </button>
                    <button
                      onClick={() =>
                        updateLeaveStatus(
                          req.id,
                          'REJECTED',
                          reviewNotesInput[req.id] || 'تعارض مع سير العمل'
                        )
                      }
                      className="flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 border border-slate-700 text-slate-300 text-xs font-black transition flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>رفض الطلب</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))
        )}
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-lg p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-400" />
                <span>تقديم طلب إجازة جديد</span>
              </h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">نوع الإجازة</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full text-xs p-3 bg-slate-950 border border-slate-800 text-white rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold"
                >
                  <option value="annual">إجازة سنوية</option>
                  <option value="sick">إجازة مرضية</option>
                  <option value="emergency">إجازة طارئة</option>
                  <option value="unpaid">إجازة بدون راتب</option>
                  <option value="parental">إجازة أسرية/أمومة/أبوة</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">تاريخ البداية</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-950 border border-slate-800 text-white rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">تاريخ النهاية</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-950 border border-slate-800 text-white rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold"
                  />
                </div>
              </div>

              <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold rounded-2xl flex items-center justify-between">
                <span>إجمالي أيام الإجازة المحسوبة:</span>
                <span className="text-base font-black text-indigo-400">{daysCount} أيام</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300">سبب ومبررات الطلب</label>
                  <button
                    type="button"
                    onClick={handleAiPolishReason}
                    disabled={isAiPolishing}
                    className="text-[11px] text-indigo-300 hover:text-white font-extrabold flex items-center gap-1 bg-indigo-500/10 px-2.5 py-1 rounded-xl border border-indigo-500/30 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isAiPolishing ? 'جاري التحسين...' : 'صياغة بالذكاء الاصطناعي'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  required
                  placeholder="اكتب سبب طلب الإجازة هنا..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-950 border border-slate-800 text-white rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium leading-relaxed"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition shadow-lg shadow-indigo-600/30"
                >
                  إرسال الطلب للموارد البشرية
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
