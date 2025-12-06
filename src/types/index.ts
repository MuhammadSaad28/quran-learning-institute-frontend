export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'student';
  timezone: string;
  country?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  features: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  isActive: boolean;
  createdAt: string;
}

export interface DemoRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  timezone: string;
  preferredSlotUser: string;
  preferredSlotUTC: string;
  courseId: Course | string;
  adminFinalSlotUTC?: string;
  adminFinalSlotUser?: string;
  meetingLink?: string;
  status: 'pending' | 'approved' | 'rejected' | 'converted';
  adminNotes?: string;
  createdAt: string;
}

export interface WeeklySchedule {
  day: string;
  time: string;
}

export interface Student {
  _id: string;
  userId: User;
  courseId: Course;
  weeklySchedule: WeeklySchedule[];
  startDate: string;
  notes?: string;
  createdAt: string;
}

export interface ClassSchedule {
  _id: string;
  studentId: Student;
  courseId: Course;
  dateTimeUTC: string;
  dateTimeUser: string;
  meetingLink?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reminderSent: boolean;
  createdAt: string;
}

export interface Settings {
  _id: string;
  instituteName: string;
  instituteEmail?: string;
  institutePhone?: string;
  instituteAddress?: string;
  adminTimezone: string;
  defaultMeetingLink?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User & { token: string }>;
  logout: () => void;
  updateUser: (user: User) => void;
}
