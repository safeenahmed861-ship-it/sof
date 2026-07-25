import React from 'react';
import { useAuth } from '../context/AuthContext';
import { SYNDICATE_LOGO } from '../data/initialData';
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  Megaphone,
  Users,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Briefcase,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'attendance'
  | 'leaves'
  | 'announcements'
  | 'employees'
  | 'ai';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen = true,
}) => {
  const { leaveRequests, announcements, activeRole, currentUser } = useAuth();

  const pendingLeavesCount = leaveRequests.filter(
    (r) => r.status === 'PENDING'
  ).length;

  const unreadAnnouncementsCount = currentUser
    ? announcements.filter((a) => !a.readBy.includes(currentUser.id)).length
    : 0;

  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'لوحة التحكم بالإحصائيات',
      icon: LayoutDashboard,
      badge: null,
      color: 'text-emerald-600',
    },
    {
      id: 'attendance' as NavTab,
      label: 'الحضور والانصراف',
      icon: Clock,
      badge: null,
      color: 'text-teal-600',
    },
    {
      id: 'leaves' as NavTab,
      label: 'طلبات الإجازة',
      icon: CalendarDays,
      badge: pendingLeavesCount > 0 ? pendingLeavesCount : null,
      badgeColor: 'bg-amber-500 text-white',
      color: 'text-amber-600',
    },
    {
      id: 'announcements' as NavTab,
      label: 'التبليغات والإشعارات',
      icon: Megaphone,
      badge: unreadAnnouncementsCount > 0 ? unreadAnnouncementsCount : null,
      badgeColor: 'bg-emerald-600 text-white',
      color: 'text-emerald-600',
    },
    {
      id: 'employees' as NavTab,
      label: 'إدارة سجلات الموظفين',
      icon: Users,
      badge: null,
      color: 'text-blue-600',
    },
    {
      id: 'ai' as NavTab,
      label: 'المساعد الذكي (Gemini)',
      icon: Sparkles,
      badge: 'جديد',
      badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
      color: 'text-emerald-600',
    },
  ];

  return (
    <aside
      className={`fixed lg:static inset-y-0 right-0 z-30 w-64 bg-slate-900 border-l border-slate-800 shadow-xl flex flex-col justify-between transition-transform duration-200 ease-in-out text-slate-200 ${
        isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="p-4 space-y-4">
        
        {/* Syndicate Header Badge */}
        <div className="p-3 bg-slate-950/90 rounded-2xl border border-slate-800 flex items-center gap-3">
          <img
            src={SYNDICATE_LOGO}
            alt="نقابة المحاسبين العراقيين"
            className="w-10 h-10 rounded-xl object-cover ring-1 ring-emerald-500/40 bg-white p-0.5 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0">
            <h2 className="text-xs font-black text-white truncate">نقابة المحاسبين العراقيين</h2>
            <p className="text-[10px] text-emerald-400 font-extrabold truncate">المقر العام - بغداد</p>
          </div>
        </div>

        {/* User Card Summary in Sidebar */}
        {currentUser && (
          <div className="p-3.5 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 text-white rounded-2xl shadow-lg ring-1 ring-white/5">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-500/50 shadow-md"
              />
              <div className="overflow-hidden">
                <div className="text-xs font-black truncate text-white">{currentUser.name}</div>
                <div className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5 font-medium">
                  <Briefcase className="w-3 h-3 text-indigo-400 shrink-0" />
                  <span className="truncate">{currentUser.jobTitle}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-1 font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeRole === 'ADMIN' ? 'صلاحيات مدير' : 'صلاحيات موظف'}</span>
              </div>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md font-mono">
                {currentUser.code}
              </span>
            </div>
          </div>
        )}

        {/* Navigation items */}
        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            القائمة الرئيسية
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition duration-150 group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition ${
                      isActive ? 'text-white' : 'text-indigo-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-white text-indigo-900' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
          <span>مسار HR v3.0</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      </div>
    </aside>
  );
};
