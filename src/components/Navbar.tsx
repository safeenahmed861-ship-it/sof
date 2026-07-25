import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SYNDICATE_LOGO } from '../data/initialData';
import {
  Building2,
  Bell,
  Clock,
  UserCheck,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldAlert,
  Users,
  RotateCcw,
  Menu,
  X,
  Fingerprint,
} from 'lucide-react';

interface NavbarProps {
  onOpenAIAssistant: () => void;
  onOpenLoginModal?: () => void;
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAIAssistant,
  onOpenLoginModal,
  onToggleSidebar,
  sidebarOpen,
}) => {
  const {
    currentUser,
    activeRole,
    switchUser,
    switchRole,
    logout,
    employees,
    announcements,
    resetAllData,
  } = useAuth();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Live time display
  const [currentTime, setCurrentTime] = React.useState(new Date());
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadAnnouncements = currentUser
    ? announcements.filter((a) => !a.readBy.includes(currentUser.id))
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Right side: Mobile Menu Button + App Branding */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              aria-label="تبديل القائمة"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div className="flex items-center gap-3">
            <img
              src={SYNDICATE_LOGO}
              alt="نقابة المحاسبين العراقيين"
              className="w-11 h-11 rounded-2xl object-cover ring-1 ring-emerald-500/30 shadow-xs bg-white p-0.5"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                  نقابة المحاسبين العراقيين
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  النظام الموحد
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                منظومة مسار HR لإدارة الموظفين والحضور والطلبات
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Clock & AI Assistant Button */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>
              {currentTime.toLocaleDateString('ar-SA', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="font-mono text-emerald-700 dir-ltr text-xs font-extrabold">
              {currentTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          </div>

          <button
            onClick={onOpenAIAssistant}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-emerald-100" />
            <span>المساعد الذكي</span>
          </button>
        </div>

        {/* Left side: Quick Role Toggle, Notifications, User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Demo Switcher */}
          <div className="relative">
            <select
              value={currentUser?.id || ''}
              onChange={(e) => switchUser(e.target.value)}
              className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer hidden sm:block"
              title="تبديل المستخدم السريع"
            >
              <optgroup label="👨‍💼 الإدارة">
                {employees
                  .filter((e) => e.role === 'ADMIN')
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} (مدير)
                    </option>
                  ))}
              </optgroup>
              <optgroup label="👷‍♂️ الموظفين">
                {employees
                  .filter((e) => e.role === 'EMPLOYEE')
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.jobTitle})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* Role badge switcher toggle */}
          <button
            onClick={() => switchRole(activeRole === 'ADMIN' ? 'EMPLOYEE' : 'ADMIN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition border ${
              activeRole === 'ADMIN'
                ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
            title="انقر للتبديل بين وضع المدير والموظف"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{activeRole === 'ADMIN' ? 'مدير' : 'موظف'}</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 relative transition"
              aria-label="الإشعارات"
            >
              <Bell className="w-5 h-5" />
              {unreadAnnouncements.length > 0 && (
                <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadAnnouncements.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">
                    الإشعارات والتبليغات ({unreadAnnouncements.length})
                  </span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-emerald-700 hover:underline font-bold"
                  >
                    إغلاق
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {unreadAnnouncements.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-slate-500 font-medium">
                      لا توجد تبليغات جديدة غير مقروءة
                    </div>
                  ) : (
                    unreadAnnouncements.map((ann) => (
                      <div
                        key={ann.id}
                        className="p-3 border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold text-xs text-slate-900 line-clamp-1">
                            {ann.title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {ann.date}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 font-medium">
                          {ann.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200 bg-white"
                />
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-extrabold text-slate-900 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {currentUser.jobTitle}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {currentUser.department}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    {onOpenLoginModal && (
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onOpenLoginModal();
                        }}
                        className="w-full text-right px-4 py-2 text-xs text-emerald-800 hover:bg-emerald-50 flex items-center gap-2 font-bold"
                      >
                        <Fingerprint className="w-4 h-4 text-emerald-600" />
                        تسجيل الدخول بالبصمة / Face ID
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenAIAssistant();
                      }}
                      className="w-full text-right px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      مساعد الموارد البشرية
                    </button>
                    <button
                      onClick={() => {
                        resetAllData();
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-right px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <RotateCcw className="w-4 h-4 text-slate-400" />
                      إعادة ضبط البيانات النموذجية
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-right px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
