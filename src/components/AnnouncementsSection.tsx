import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AnnouncementPriority } from '../types';
import {
  Megaphone,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  Bell,
  Search,
  Filter,
  AlertTriangle,
  Building,
} from 'lucide-react';

export const AnnouncementsSection: React.FC = () => {
  const {
    announcements,
    currentUser,
    activeRole,
    addAnnouncement,
    markAnnouncementRead,
  } = useAuth();

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetDept, setTargetDept] = useState('ALL');
  const [priority, setPriority] = useState<AnnouncementPriority>('important');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiPromptTopic, setAiPromptTopic] = useState('');

  const handleAiGenerateContent = async () => {
    if (!aiPromptTopic.trim() && !title.trim()) {
      alert('يرجى كتابة عنوان أو موضوع للتبليغ ليقوم المساعد الذكي بصياغته.');
      return;
    }
    setIsAiGenerating(true);
    try {
      const topic = aiPromptTopic.trim() || title.trim();
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `اكتب تعميماً إدارياً رسمياً ومصاغاً بأسلوب احترافي جداً باللغة العربية بخصوص الموضوع التالي: "${topic}". صغ العبارات بأسلوب إداري رفيع موجه للموظفين مع التحية والختام.`,
        }),
      });
      const data = await res.json();
      if (data.text) {
        setContent(data.text);
      }
    } catch (err) {
      console.error(err);
      setContent(
        `السادة الموظفين المحترمين،\n\nنحيطكم علماً بخصوص ${
          aiPromptTopic || title
        }، ونرجو من جميع زملائنا الكرام الالتزام بالتعليمات المرفقة والتنسيق مع رؤساء الأقسام.\n\nشاكرين ومقدرين حسن تعاونكم،\nإدارة الموارد البشرية.`
      );
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert('يرجى إدخال العنوان والمحتوى.');
      return;
    }
    addAnnouncement({
      title,
      content,
      targetDepartment: targetDept,
      priority,
    });
    setShowPublishModal(false);
    setTitle('');
    setContent('');
    setAiPromptTopic('');
  };

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority =
      priorityFilter === 'ALL' || a.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-extrabold">
            <Megaphone className="w-3.5 h-3.5 text-indigo-400" />
            <span>نظام التعاميم والتبليغات الإدارية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            التبليغات والإشعارات الرسمية
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-xl">
            تابع كافة القرارات والتعاميم والقرارات الإدارية الهامة بوضوح وشفافية.
          </p>
        </div>

        {activeRole === 'ADMIN' && (
          <button
            onClick={() => setShowPublishModal(true)}
            className="relative z-10 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-black text-xs shadow-lg shadow-indigo-500/25 transition flex items-center gap-2 shrink-0 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>نشر تعميم إداري جديد</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
          <input
            type="text"
            placeholder="ابحث في التبليغات والتعاميم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-3 py-2.5 text-xs bg-slate-950 border border-slate-800 text-white placeholder-slate-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-extrabold text-slate-400 shrink-0">الأهمية:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 font-bold text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">جميع المستويات</option>
            <option value="urgent">عاجل جداً</option>
            <option value="important">هام</option>
            <option value="normal">عادي</option>
          </select>
        </div>
      </div>

      {/* Bulletins List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl">
            <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-black text-slate-200">لا توجد تعاميم إدارية مطابقة</p>
            <p className="text-xs text-slate-400 mt-1">تأكد من كلمات البحث أو خيارات الفلترة.</p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => {
            const isRead = currentUser ? ann.readBy.includes(currentUser.id) : true;
            return (
              <div
                key={ann.id}
                className={`bg-slate-900/90 rounded-3xl border p-6 shadow-xl transition space-y-4 ${
                  !isRead
                    ? 'border-indigo-500/40 ring-1 ring-indigo-500/30 bg-indigo-950/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    {ann.priority === 'urgent' && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        عاجل جداً
                      </span>
                    )}
                    {ann.priority === 'important' && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        هام
                      </span>
                    )}
                    {ann.priority === 'normal' && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        إداري عادي
                      </span>
                    )}

                    <h2 className="text-base font-black text-white">{ann.title}</h2>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <span className="font-mono">{ann.date}</span>
                    <span>•</span>
                    <span className="text-slate-300 font-bold">{ann.authorName}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-medium bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                  {ann.content}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                  <span className="text-slate-400 text-[11px] font-extrabold flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-indigo-400" />
                    المستهدفون: {ann.targetDepartment === 'ALL' ? 'جميع الموظفين' : ann.targetDepartment}
                  </span>

                  {currentUser && (
                    <div>
                      {isRead ? (
                        <span className="text-emerald-400 font-extrabold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          تم الاطلاع والاعتماد
                        </span>
                      ) : (
                        <button
                          onClick={() => markAnnouncementRead(ann.id)}
                          className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition shadow-lg shadow-emerald-600/20"
                        >
                          تأكيد القراءة والاطلاع
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Publish Announcement Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-indigo-400" />
                <span>نشر تعميم أو تبليغ إداري جديد</span>
              </h3>
              <button
                onClick={() => setShowPublishModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">عنوان التعميم</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تغيير ساعات الدوام في شهر رمضان المبارك..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-950 border border-slate-800 text-white rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">الجهة المستهدفة</label>
                  <select
                    value={targetDept}
                    onChange={(e) => setTargetDept(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-950 border border-slate-800 text-white rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold"
                  >
                    <option value="ALL">جميع الأقسام والموظفين</option>
                    <option value="تقنية المعلومات">قسم تقنية المعلومات</option>
                    <option value="الموارد البشرية">قسم الموارد البشرية</option>
                    <option value="التسويق والمبيعات">قسم التسويق والمبيعات</option>
                    <option value="المالية والحسابات">قسم المالية والحسابات</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">درجة الأهمية</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as AnnouncementPriority)}
                    className="w-full text-xs p-3 bg-slate-950 border border-slate-800 text-white rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold"
                  >
                    <option value="important">هام</option>
                    <option value="urgent">عاجل جداً</option>
                    <option value="normal">عادي</option>
                  </select>
                </div>
              </div>

              {/* AI Drafting box */}
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>توليد صياغة التعميم بالذكاء الاصطناعي</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAiGenerateContent}
                    disabled={isAiGenerating}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md"
                  >
                    {isAiGenerating ? 'جاري الصياغة...' : 'توليد النص رسمياً'}
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="أدخل فكرة التعميم (مثال: إشعار بموعد اجتماع الكادر السنوي)..."
                  value={aiPromptTopic}
                  onChange={(e) => setAiPromptTopic(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 text-white rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">نص التعميم والبيان الرسمي</label>
                <textarea
                  rows={5}
                  required
                  placeholder="اكتب نص البيان الإداري الموجه للموظفين..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-950 border border-slate-800 text-white rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium leading-relaxed"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition shadow-lg shadow-indigo-600/30"
                >
                  نشر التعميم فوراً
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
