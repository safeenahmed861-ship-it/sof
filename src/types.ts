export type Role = 'ADMIN' | 'EMPLOYEE';

export type Department =
  | 'تقنية المعلومات'
  | 'الموارد البشرية'
  | 'التسويق والمبيعات'
  | 'المالية والحسابات'
  | 'العمليات والتشغيل'
  | 'التصميم والإبداع';

export interface LeaveBalance {
  annual: number;
  sick: number;
  emergency: number;
}

export interface Employee {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  department: Department;
  jobTitle: string;
  avatar: string;
  joinDate: string;
  salary: number;
  status: 'active' | 'on_leave' | 'inactive';
  leaveBalance: LeaveBalance;
  workHoursPerDay: number; // e.g. 8 hours
  monthlyLeaveDays: number; // e.g. 2 days per month
  nationalId: string;
  password?: string;
}

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'ABSENT' | 'ON_LEAVE' | 'EARLY_LEAVE';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  checkIn: string | null;
  checkOut: string | null;
  workHours: number;
  status: AttendanceStatus;
  notes?: string;
  location?: string;
}

export type LeaveType = 'annual' | 'sick' | 'emergency' | 'unpaid' | 'parental';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export type AnnouncementPriority = 'urgent' | 'important' | 'normal';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  targetDepartment: string; // 'ALL' or specific department
  priority: AnnouncementPriority;
  date: string;
  readBy: string[];
}

export interface ActivePunchState {
  isCheckedIn: boolean;
  checkInTime: string | null;
  todaysRecordId: string | null;
}
