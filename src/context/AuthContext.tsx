import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  Announcement,
  Role,
  LeaveStatus,
  LeaveType,
} from '../types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_ANNOUNCEMENTS,
} from '../data/initialData';

interface AuthContextType {
  currentUser: Employee | null;
  activeRole: Role;
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  announcements: Announcement[];
  switchUser: (employeeId: string) => void;
  switchRole: (role: Role) => void;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  punchIn: (location?: string, notes?: string) => void;
  punchOut: () => void;
  todayAttendance: AttendanceRecord | undefined;
  addEmployee: (empData: Omit<Employee, 'id' | 'code'>) => void;
  updateEmployee: (id: string, empData: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  deleteAllEmployees: () => void;
  submitLeaveRequest: (data: {
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    daysCount: number;
    reason: string;
  }) => void;
  updateLeaveStatus: (
    id: string,
    status: LeaveStatus,
    reviewNotes?: string
  ) => void;
  addAnnouncement: (data: {
    title: string;
    content: string;
    targetDepartment: string;
    priority: 'urgent' | 'important' | 'normal';
  }) => void;
  markAnnouncementRead: (id: string) => void;
  resetAllData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'accountants_iq_hr_v6_';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    const savedId = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'current_user_id');
    if (savedId) {
      const found = employees.find((e) => e.id === savedId);
      if (found) return found;
    }
    return employees[0] || null; // Default to Ahmed Al-Otaibi (Admin)
  });

  const [activeRole, setActiveRole] = useState<Role>(
    currentUser ? currentUser.role : 'ADMIN'
  );

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'leave_requests');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_PREFIX + 'employees',
      JSON.stringify(employees)
    );
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_PREFIX + 'attendance',
      JSON.stringify(attendance)
    );
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_PREFIX + 'leave_requests',
      JSON.stringify(leaveRequests)
    );
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_PREFIX + 'announcements',
      JSON.stringify(announcements)
    );
  }, [announcements]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        LOCAL_STORAGE_PREFIX + 'current_user_id',
        currentUser.id
      );
    } else {
      localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'current_user_id');
    }
  }, [currentUser]);

  const switchUser = (employeeId: string) => {
    const target = employees.find((e) => e.id === employeeId);
    if (target) {
      setCurrentUser(target);
      setActiveRole(target.role);
    }
  };

  const switchRole = (role: Role) => {
    setActiveRole(role);
  };

  const login = (email: string, pass?: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const found = employees.find(
      (e) => e.email.toLowerCase().trim() === cleanEmail
    );
    if (found) {
      if (pass && found.password && found.password !== pass) {
        return false;
      }
      setCurrentUser(found);
      setActiveRole(found.role);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Check today's attendance for current logged in employee
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = currentUser
    ? attendance.find(
        (a) => a.employeeId === currentUser.id && a.date === todayStr
      )
    : undefined;

  const punchIn = (location = 'المقر الرئيسي - الرياض', notes?: string) => {
    if (!currentUser) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const isLate = now.getHours() > 8 || (now.getHours() === 8 && now.getMinutes() > 15);
    const status = isLate ? 'LATE' : 'PRESENT';

    if (todayAttendance) {
      // Already existing record for today, update checkIn
      setAttendance((prev) =>
        prev.map((rec) =>
          rec.id === todayAttendance.id
            ? {
                ...rec,
                checkIn: timeStr,
                status,
                location,
                notes: notes || rec.notes || (isLate ? 'تسجيل حضور متأخر' : 'تسجيل حضور عبر البوابة الإلكترونية'),
              }
            : rec
        )
      );
    } else {
      // New record
      const newRec: AttendanceRecord = {
        id: 'att-' + Date.now(),
        employeeId: currentUser.id,
        employeeName: currentUser.name,
        date: todayStr,
        checkIn: timeStr,
        checkOut: null,
        workHours: 0,
        status,
        location,
        notes: notes || (isLate ? 'تسجيل حضور متأخر' : 'تسجيل حضور في الوقت'),
      };
      setAttendance((prev) => [newRec, ...prev]);
    }
  };

  const punchOut = () => {
    if (!currentUser || !todayAttendance || !todayAttendance.checkIn) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    // Estimate hours worked simply
    let hoursWorked = 8.0;
    if (todayAttendance.checkIn) {
      try {
        const [time, modifier] = todayAttendance.checkIn.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        const checkInDate = new Date();
        checkInDate.setHours(hours, minutes, 0, 0);
        const diffMs = now.getTime() - checkInDate.getTime();
        hoursWorked = Math.max(0.1, Number((diffMs / (1000 * 60 * 60)).toFixed(1)));
      } catch (e) {
        hoursWorked = 8.0;
      }
    }

    setAttendance((prev) =>
      prev.map((rec) =>
        rec.id === todayAttendance.id
          ? {
              ...rec,
              checkOut: timeStr,
              workHours: hoursWorked,
            }
          : rec
      )
    );
  };

  const addEmployee = (empData: Omit<Employee, 'id' | 'code'>) => {
    const newId = 'emp-' + (employees.length + 1) + '-' + Date.now().toString().slice(-4);
    const code = `EMP-${1000 + employees.length + 1}`;
    const newEmp: Employee = {
      ...empData,
      id: newId,
      code,
      workHoursPerDay: empData.workHoursPerDay || 8,
      monthlyLeaveDays: empData.monthlyLeaveDays || 2,
    };
    setEmployees((prev) => [newEmp, ...prev]);

    // If no currentUser exists, set this newly created employee as active user
    if (!currentUser) {
      setCurrentUser(newEmp);
      setActiveRole(newEmp.role);
    }
  };

  const updateEmployee = (id: string, empData: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...empData } : e))
    );
    if (currentUser && currentUser.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, ...empData } : null));
    }
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    if (currentUser && currentUser.id === id) {
      const remaining = employees.filter((e) => e.id !== id);
      setCurrentUser(remaining[0] || null);
    }
  };

  const deleteAllEmployees = () => {
    setEmployees([]);
    setCurrentUser(null);
  };

  const submitLeaveRequest = (data: {
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    daysCount: number;
    reason: string;
  }) => {
    if (!currentUser) return;
    const newReq: LeaveRequest = {
      id: 'leave-' + Date.now(),
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      department: currentUser.department,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      daysCount: data.daysCount,
      reason: data.reason,
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLeaveRequests((prev) => [newReq, ...prev]);
  };

  const updateLeaveStatus = (
    id: string,
    status: LeaveStatus,
    reviewNotes?: string
  ) => {
    setLeaveRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = {
            ...r,
            status,
            reviewedBy: currentUser ? currentUser.name : 'إدارة الموارد البشرية',
            reviewNotes: reviewNotes || (status === 'APPROVED' ? 'تمت الموافقة' : 'تم الرفض'),
          };

          // If approved, update employee's leave balance & status
          if (status === 'APPROVED' && r.leaveType === 'annual') {
            setEmployees((empPrev) =>
              empPrev.map((emp) =>
                emp.id === r.employeeId
                  ? {
                      ...emp,
                      leaveBalance: {
                        ...emp.leaveBalance,
                        annual: Math.max(0, emp.leaveBalance.annual - r.daysCount),
                      },
                    }
                  : emp
              )
            );
          }

          return updated;
        }
        return r;
      })
    );
  };

  const addAnnouncement = (data: {
    title: string;
    content: string;
    targetDepartment: string;
    priority: 'urgent' | 'important' | 'normal';
  }) => {
    const newAnn: Announcement = {
      id: 'ann-' + Date.now(),
      title: data.title,
      content: data.content,
      authorName: currentUser ? currentUser.name : 'إدارة الموارد البشرية',
      targetDepartment: data.targetDepartment,
      priority: data.priority,
      date: new Date().toISOString().split('T')[0],
      readBy: currentUser ? [currentUser.id] : [],
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const markAnnouncementRead = (id: string) => {
    if (!currentUser) return;
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === id && !a.readBy.includes(currentUser.id)
          ? { ...a, readBy: [...a.readBy, currentUser.id] }
          : a
      )
    );
  };

  const resetAllData = () => {
    setEmployees(INITIAL_EMPLOYEES);
    setAttendance(INITIAL_ATTENDANCE);
    setLeaveRequests(INITIAL_LEAVES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setCurrentUser(INITIAL_EMPLOYEES[0]);
    setActiveRole('ADMIN');
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        employees,
        attendance,
        leaveRequests,
        announcements,
        switchUser,
        switchRole,
        login,
        logout,
        punchIn,
        punchOut,
        todayAttendance,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        deleteAllEmployees,
        submitLeaveRequest,
        updateLeaveStatus,
        addAnnouncement,
        markAnnouncementRead,
        resetAllData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
