/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { AttendanceSection } from './components/AttendanceSection';
import { LeaveSection } from './components/LeaveSection';
import { AnnouncementsSection } from './components/AnnouncementsSection';
import { EmployeeManagement } from './components/EmployeeManagement';
import { AIAssistantModal } from './components/AIAssistantModal';
import { LoginModal } from './components/LoginModal';

function MainApp() {
  const { currentUser, activeRole } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSelectTab = (tab: NavTab) => {
    if (tab === 'ai') {
      setIsAiModalOpen(true);
      return;
    }
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Cairo',sans-serif] selection:bg-indigo-500/30 selection:text-indigo-200 antialiased">
      {/* Top Header Navigation */}
      <Navbar
        onOpenAIAssistant={() => setIsAiModalOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      {/* Main Body Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex gap-0 lg:gap-6 p-3 sm:p-6">
        
        {/* Right Sidebar Menu */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          isOpen={sidebarOpen}
        />

        {/* Backdrop for Mobile Sidebar */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/80 z-20 lg:hidden backdrop-blur-md"
          ></div>
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0 space-y-6">
          {!currentUser ? (
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 sm:p-12 text-center space-y-5 max-w-lg mx-auto my-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-inner">
                <span className="text-2xl font-black">M</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                مرحباً بك في منصة <span className="text-indigo-400">مسار</span> لإدارة الموظفين
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
                منظومة متكاملة لمتابعة الحضور والانصراف، إدارة الموظفين، تقديم الإجازات والتعاميم الإدارية.
              </p>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-black shadow-lg shadow-indigo-500/25 transition active:scale-95"
              >
                تسجيل الدخول الآن
              </button>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                activeRole === 'ADMIN' ? (
                  <Dashboard
                    onNavigateTab={handleSelectTab}
                    onOpenAIAssistant={() => setIsAiModalOpen(true)}
                  />
                ) : (
                  <EmployeeDashboard
                    onNavigateTab={handleSelectTab}
                    onOpenAIAssistant={() => setIsAiModalOpen(true)}
                  />
                )
              )}

              {activeTab === 'attendance' && <AttendanceSection />}

              {activeTab === 'leaves' && <LeaveSection />}

              {activeTab === 'announcements' && <AnnouncementsSection />}

              {activeTab === 'employees' && <EmployeeManagement />}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <AIAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
