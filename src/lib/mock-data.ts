export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dob: string;
  gender: "Male" | "Female";
  bloodType: string;
  avatar: string;
  lastVisit: string;
}

export type AppointmentStatus =
  | "Waiting"
  | "In Progress"
  | "Waiting Documentation"
  | "Completed"
  | "Cancelled";

export interface Appointment {
  id: string;
  patientId: number;
  doctorId: string;
  start: Date;
  end: Date;
  type: string;
  title: string;
  notes: string;
  isCompleted: boolean;
  attachments: string[]; // Mock file names
  // Derived fields for easy display
  patientName: string;
  doctorName: string;
  color: string;
}

export const getAppointmentStatus = (
  appointment: Appointment
): AppointmentStatus => {
  if (appointment.isCompleted) return "Completed";

  const now = new Date();
  const start = new Date(appointment.start);
  const end = new Date(appointment.end);

  if (now < start) return "Waiting";
  if (now >= start && now <= end) return "In Progress";
  return "Waiting Documentation";
};

export interface Doctor {
  value: string;
  label: string;
}

export const appointmentTypes = [
  { label: "Consultation", value: "consultation", color: "#3b82f6" },
  { label: "Follow-up", value: "follow-up", color: "#10b981" },
  { label: "Check-up", value: "check-up", color: "#8b5cf6" },
  { label: "Emergency", value: "emergency", color: "#ef4444" },
  { label: "Surgery", value: "surgery", color: "#f59e0b" },
  { label: "Lab Test", value: "lab-test", color: "#06b6d4" },
];

export const mockPatients: Patient[] = [
  {
    id: 1,
    firstName: "Sarah",
    lastName: "Connor",
    dob: "1985-04-12",
    gender: "Female",
    bloodType: "O+",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    lastVisit: "2024-01-15",
  },
  {
    id: 2,
    firstName: "John",
    lastName: "Wick",
    dob: "1980-09-02",
    gender: "Male",
    bloodType: "AB-",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    lastVisit: "2024-01-10",
  },
  {
    id: 3,
    firstName: "Ellen",
    lastName: "Ripley",
    dob: "2092-01-07",
    gender: "Female",
    bloodType: "A+",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ellen",
    lastVisit: "2023-12-28",
  },
];

export const mockDoctors: Doctor[] = [
  { label: "Dr. James Wilson - General Medicine", value: "dr-wilson" },
  { label: "Dr. Gregory House - Diagnostic Medicine", value: "dr-house" },
  { label: "Dr. Beverly Crusher - Emergency Medicine", value: "dr-crusher" },
  { label: "Dr. Meredith Grey - Surgery", value: "dr-grey" },
  { label: "Dr. Derek Shepherd - Neurology", value: "dr-shepherd" },
];

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  joinDate: string;
  status: "Active" | "On Leave" | "Terminated";
  contractType: "Full-Time" | "Part-Time" | "Contract";
  education: {
    degree: string;
    major: string;
    university: string;
    graduationYear: number;
  };
  managerId?: string; // For Org Chart
  // ERP Upgrades
  contractEndDate: string;
  history: {
    date: string;
    action:
      | "Hired"
      | "Promoted"
      | "Transferred"
      | "Contract Renewed"
      | "Probation Passed";
    description: string;
  }[];
  assets: {
    item: string;
    serialNumber: string;
    assignedDate: string;
  }[];
  // Payroll Info
  baseSalary: number;
  taxStatus: "TK/0" | "K/0" | "K/1" | "K/2" | "K/3";
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    holderName: string;
  };
  leaveBalance?: {
    annual: number;
    sick: number;
    unpaid: number;
  };
  allowances: {
    transport: number;
    meal: number;
    housing: number;
  };
}

export const mockEmployees: Employee[] = [
  {
    id: "emp-1",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@medicare.com",
    role: "Chief Executive Officer",
    department: "Executive",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    joinDate: "2020-01-15",
    status: "Active",
    contractType: "Full-Time",
    contractEndDate: "2030-12-31", // Indefinite effectively
    education: {
      degree: "MBA",
      major: "Business Administration",
      university: "Harvard University",
      graduationYear: 2015,
    },
    history: [
      { date: "2020-01-15", action: "Hired", description: "Joined as CEO" },
    ],
    assets: [
      {
        item: "MacBook Pro 16",
        serialNumber: "MBP-2023-001",
        assignedDate: "2023-01-10",
      },
      {
        item: "Corporate Credit Card",
        serialNumber: "4000-1234-5678",
        assignedDate: "2020-01-15",
      },
    ],
    baseSalary: 150_000_000,
    taxStatus: "K/2",
    bankAccount: {
      bankName: "BCA",
      accountNumber: "1234567890",
      holderName: "Alice Johnson",
    },
    leaveBalance: { annual: 12, sick: 10, unpaid: 0 },
    allowances: {
      transport: 5_000_000,
      meal: 2_000_000,
      housing: 10_000_000,
    },
  },
  {
    id: "emp-2",
    firstName: "Bob",
    lastName: "Smith",
    email: "bob.smith@medicare.com",
    role: "HR Director",
    department: "Human Resources",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    joinDate: "2020-03-01",
    status: "Active",
    contractType: "Full-Time",
    contractEndDate: "2026-03-01",
    education: {
      degree: "Master",
      major: "Human Resources Management",
      university: "Cornell University",
      graduationYear: 2018,
    },
    managerId: "emp-1",
    history: [
      {
        date: "2020-03-01",
        action: "Hired",
        description: "Joined as HR Manager",
      },
      {
        date: "2022-03-01",
        action: "Promoted",
        description: "Promoted to HR Director",
      },
    ],
    assets: [
      {
        item: "Dell XPS 15",
        serialNumber: "DELL-2022-882",
        assignedDate: "2022-03-01",
      },
    ],
    baseSalary: 85_000_000,
    taxStatus: "K/1",
    bankAccount: {
      bankName: "Mandiri",
      accountNumber: "9876543210",
      holderName: "Bob Smith",
    },
    leaveBalance: { annual: 8, sick: 5, unpaid: 2 },
    allowances: {
      transport: 2_500_000,
      meal: 1_500_000,
      housing: 5_000_000,
    },
  },
  {
    id: "emp-3",
    firstName: "Charlie",
    lastName: "Davis",
    email: "charlie.davis@medicare.com",
    role: "IT Manager",
    department: "Information Technology",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
    joinDate: "2021-06-10",
    status: "Active",
    contractType: "Full-Time",
    contractEndDate: "2025-06-10",
    education: {
      degree: "Bachelor",
      major: "Computer Science",
      university: "MIT",
      graduationYear: 2019,
    },
    managerId: "emp-1",
    history: [
      { date: "2021-06-10", action: "Hired", description: "Joined as IT Lead" },
      {
        date: "2023-01-01",
        action: "Promoted",
        description: "Promoted to IT Manager",
      },
    ],
    assets: [
      {
        item: "MacBook Pro 14",
        serialNumber: "MBP-2021-999",
        assignedDate: "2021-06-10",
      },
    ],
    baseSalary: 65_000_000,
    taxStatus: "TK/0",
    bankAccount: {
      bankName: "BNI",
      accountNumber: "4561237890",
      holderName: "Charlie Davis",
    },
    allowances: {
      transport: 2_000_000,
      meal: 1_500_000,
      housing: 0,
    },
  },
  {
    id: "emp-4",
    firstName: "Diana",
    lastName: "Prince",
    email: "diana.prince@medicare.com",
    role: "HR Specialist",
    department: "Human Resources",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
    joinDate: "2022-02-15",
    status: "Active",
    contractType: "Contract",
    contractEndDate: "2026-02-15", // Expiring relatively soon-ish? Let's make one expire SOON.
    education: {
      degree: "Bachelor",
      major: "Psychology",
      university: "UCLA",
      graduationYear: 2021,
    },
    managerId: "emp-2",
    history: [
      {
        date: "2022-02-15",
        action: "Hired",
        description: "Joined as HR Intern",
      },
      {
        date: "2022-08-15",
        action: "Probation Passed",
        description: "Confirmed as HR Associate",
      },
      {
        date: "2024-02-15",
        action: "Contract Renewed",
        description: "Renewed for 2 years",
      },
    ],
    assets: [
      {
        item: "Lenovo ThinkPad",
        serialNumber: "LEN-555-123",
        assignedDate: "2022-02-15",
      },
    ],
    baseSalary: 15_000_000,
    taxStatus: "TK/0",
    bankAccount: {
      bankName: "BCA",
      accountNumber: "7778889990",
      holderName: "Diana Prince",
    },
    allowances: {
      transport: 1_000_000,
      meal: 1_000_000,
      housing: 0,
    },
  },
  {
    id: "emp-5",
    firstName: "Evan",
    lastName: "Wright",
    email: "evan.wright@medicare.com",
    role: "Software Engineer",
    department: "Information Technology",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Evan",
    joinDate: "2023-01-20",
    status: "On Leave",
    contractType: "Full-Time",
    contractEndDate: "2026-01-20", // Expiring very soon (mock current date is Jan 2026) -> user context says 2026-01-04. So this expires in 16 days.
    education: {
      degree: "Bachelor",
      major: "Software Engineering",
      university: "Stanford",
      graduationYear: 2022,
    },
    managerId: "emp-3",
    history: [
      {
        date: "2023-01-20",
        action: "Hired",
        description: "Joined as Junior Dev",
      },
    ],
    assets: [
      {
        item: "MacBook Air M2",
        serialNumber: "MBA-2023-777",
        assignedDate: "2023-01-20",
      },
    ],
    baseSalary: 25_000_000,
    taxStatus: "TK/0",
    bankAccount: {
      bankName: "Jenius",
      accountNumber: "9000123456",
      holderName: "Evan Wright",
    },
    allowances: {
      transport: 1_500_000,
      meal: 1_500_000,
      housing: 2_000_000,
    },
  },
];

// Initial appointments
// Initial appointments
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);
const lastMonth = new Date(today);
lastMonth.setDate(lastMonth.getDate() - 30);

export const initialAppointments: Appointment[] = [
  // --- LAST MONTH (Historical) ---
  {
    id: "hist-1",
    patientId: 1,
    doctorId: "dr-wilson",
    start: new Date(lastMonth.setHours(9, 0, 0, 0)),
    end: new Date(lastMonth.setHours(9, 30, 0, 0)),
    type: "consultation",
    title: "Initial Checkup - Sarah Connor",
    notes: "First visit, patient registration.",
    isCompleted: true,
    attachments: ["Patient_Form.pdf"],
    patientName: "Sarah Connor",
    doctorName: "Dr. James Wilson",
    color: "#3b82f6",
  },
  {
    id: "hist-2",
    patientId: 2,
    doctorId: "dr-house",
    start: new Date(lastMonth.setHours(11, 0, 0, 0)),
    end: new Date(lastMonth.setHours(12, 0, 0, 0)),
    type: "diagnosis",
    title: "Symptom Analysis - John Wick",
    notes: "Detailed analysis of chronic pain.",
    isCompleted: true,
    attachments: ["MRI_Scan.pdf", "Analysis_Report.pdf"],
    patientName: "John Wick",
    doctorName: "Dr. Gregory House",
    color: "#ef4444",
  },

  // --- LAST WEEK (Historical) ---
  {
    id: "hist-3",
    patientId: 3,
    doctorId: "dr-grey",
    start: new Date(lastWeek.setHours(10, 0, 0, 0)),
    end: new Date(lastWeek.setHours(11, 0, 0, 0)),
    type: "consultation",
    title: "Pre-surgery Consult - Ellen Ripley",
    notes: "Discussing surgical options.",
    isCompleted: true,
    attachments: ["Surgical_Plan.pdf"],
    patientName: "Ellen Ripley",
    doctorName: "Dr. Meredith Grey",
    color: "#3b82f6",
  },
  {
    id: "hist-4",
    patientId: 1,
    doctorId: "dr-shepherd",
    start: new Date(lastWeek.setHours(14, 0, 0, 0)),
    end: new Date(lastWeek.setHours(14, 30, 0, 0)),
    type: "check-up",
    title: "Neurology Screening - Sarah Connor",
    notes: "Routine screening.",
    isCompleted: true,
    attachments: [],
    patientName: "Sarah Connor",
    doctorName: "Dr. Derek Shepherd",
    color: "#8b5cf6",
  },

  // --- YESTERDAY (Past) ---
  {
    id: "1",
    patientId: 1,
    doctorId: "dr-wilson",
    start: new Date(yesterday.setHours(9, 0, 0, 0)),
    end: new Date(yesterday.setHours(10, 0, 0, 0)),
    type: "consultation",
    title: "Consultation - Sarah Connor",
    notes: "Regular health checkup",
    isCompleted: true,
    attachments: ["BloodWork.pdf"],
    patientName: "Sarah Connor",
    doctorName: "Dr. James Wilson",
    color: "#3b82f6",
  },
  {
    id: "2",
    patientId: 2,
    doctorId: "dr-house",
    start: new Date(yesterday.setHours(14, 0, 0, 0)),
    end: new Date(yesterday.setHours(15, 0, 0, 0)),
    type: "diagnosis",
    title: "Diagnosis - John Wick",
    notes: "Patient complains of joint pain",
    isCompleted: true,
    attachments: ["XRay_Report.pdf"],
    patientName: "John Wick",
    doctorName: "Dr. Gregory House",
    color: "#ef4444",
  },
  {
    id: "3",
    patientId: 3,
    doctorId: "dr-grey",
    start: new Date(yesterday.setHours(16, 0, 0, 0)),
    end: new Date(yesterday.setHours(17, 0, 0, 0)),
    type: "surgery",
    title: "Surgery Follow-up - Ellen Ripley",
    notes: "Post-op checkup",
    isCompleted: false, // Status will be "Waiting Documentation"
    attachments: [],
    patientName: "Ellen Ripley",
    doctorName: "Dr. Meredith Grey",
    color: "#f59e0b",
  },

  // --- TODAY (Present/Near Future) ---
  {
    id: "4",
    patientId: 2,
    doctorId: "dr-crusher",
    start: new Date(today.setHours(10, 0, 0, 0)),
    end: new Date(today.setHours(10, 30, 0, 0)),
    type: "emergency",
    title: "Emergency - John Wick",
    notes: "Minor injury treatment",
    isCompleted: true,
    attachments: ["Treatment_Log.pdf"],
    patientName: "John Wick",
    doctorName: "Dr. Beverly Crusher",
    color: "#ef4444",
  },
  {
    id: "5",
    patientId: 1,
    doctorId: "dr-shepherd",
    start: new Date(today.setHours(13, 0, 0, 0)),
    end: new Date(today.setHours(14, 0, 0, 0)),
    type: "check-up",
    title: "Neuro Check - Sarah Connor",
    notes: "Headache consultation",
    isCompleted: false, // Likely "Waiting" or "In Progress" depending on time
    attachments: [],
    patientName: "Sarah Connor",
    doctorName: "Dr. Derek Shepherd",
    color: "#8b5cf6",
  },
  {
    id: "6",
    patientId: 3,
    doctorId: "dr-wilson",
    start: new Date(today.setHours(15, 0, 0, 0)),
    end: new Date(today.setHours(15, 30, 0, 0)),
    type: "consultation",
    title: "Lab Review - Ellen Ripley",
    notes: "Reviewing blood test results",
    isCompleted: false,
    attachments: [],
    patientName: "Ellen Ripley",
    doctorName: "Dr. James Wilson",
    color: "#3b82f6",
  },

  // --- TOMORROW (Future) ---
  {
    id: "7",
    patientId: 1,
    doctorId: "dr-house",
    start: new Date(tomorrow.setHours(9, 0, 0, 0)),
    end: new Date(tomorrow.setHours(10, 0, 0, 0)),
    type: "diagnosis",
    title: "Specialist Visit - Sarah Connor",
    notes: "Referral from Dr. Wilson",
    isCompleted: false,
    attachments: [],
    patientName: "Sarah Connor",
    doctorName: "Dr. Gregory House",
    color: "#ef4444",
  },
  {
    id: "8",
    patientId: 2,
    doctorId: "dr-grey",
    start: new Date(tomorrow.setHours(11, 0, 0, 0)),
    end: new Date(tomorrow.setHours(12, 0, 0, 0)),
    type: "surgery",
    title: "Pre-op - John Wick",
    notes: "Preparing for procedure",
    isCompleted: false,
    attachments: [],
    patientName: "John Wick",
    doctorName: "Dr. Meredith Grey",
    color: "#f59e0b",
  },
  {
    id: "9",
    patientId: 3,
    doctorId: "dr-crusher",
    start: new Date(tomorrow.setHours(14, 0, 0, 0)),
    end: new Date(tomorrow.setHours(14, 30, 0, 0)),
    type: "follow-up",
    title: "Therapy - Ellen Ripley",
    notes: "Physical therapy session",
    isCompleted: false,
    attachments: [],
    patientName: "Ellen Ripley",
    doctorName: "Dr. Beverly Crusher",
    color: "#10b981",
  },

  // --- NEXT WEEK (Future) ---
  {
    id: "10",
    patientId: 1,
    doctorId: "dr-wilson",
    start: new Date(nextWeek.setHours(10, 0, 0, 0)),
    end: new Date(nextWeek.setHours(11, 0, 0, 0)),
    type: "check-up",
    title: "Routine Check - Sarah Connor",
    notes: "Monthly checkup",
    isCompleted: false,
    attachments: [],
    patientName: "Sarah Connor",
    doctorName: "Dr. James Wilson",
    color: "#8b5cf6",
  },
];

// --- TIME & ATTENDANCE MOCKS ---

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  checkIn: string; // HH:mm
  checkOut: string | null; // HH:mm
  status: "Present" | "Late" | "Absent" | "Half-Day";
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "Annual" | "Sick" | "Unpaid" | "Maternity";
  startDate: string;
  endDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  color: string;
}

export const mockShifts: Shift[] = [
  {
    id: "S1",
    name: "Morning Shift",
    startTime: "08:00",
    endTime: "16:00",
    color: "#10b981",
  },
  {
    id: "S2",
    name: "Afternoon Shift",
    startTime: "14:00",
    endTime: "22:00",
    color: "#f59e0b",
  },
  {
    id: "S3",
    name: "Night Shift",
    startTime: "22:00",
    endTime: "06:00",
    color: "#6366f1",
  },
];

export const mockAttendance: AttendanceRecord[] = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "Alice Johnson",
    date: today.toISOString().split("T")[0],
    checkIn: "07:55",
    checkOut: "17:05",
    status: "Present",
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Bob Smith",
    date: today.toISOString().split("T")[0],
    checkIn: "08:15",
    checkOut: "17:10",
    status: "Late",
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "Charlie Davis",
    date: today.toISOString().split("T")[0],
    checkIn: "07:50",
    checkOut: "16:55",
    status: "Present",
  },
  {
    id: "4",
    employeeId: "EMP004",
    employeeName: "Diana Prince",
    date: today.toISOString().split("T")[0],
    checkIn: "08:00",
    checkOut: "17:00",
    status: "Present",
  },
  {
    id: "5",
    employeeId: "EMP005",
    employeeName: "Evan Wright",
    date: today.toISOString().split("T")[0],
    checkIn: "09:00",
    checkOut: null,
    status: "Late",
  },
  // Yesterday
  {
    id: "6",
    employeeId: "EMP001",
    employeeName: "Alice Johnson",
    date: yesterday.toISOString().split("T")[0],
    checkIn: "07:58",
    checkOut: "17:00",
    status: "Present",
  },
  {
    id: "7",
    employeeId: "EMP002",
    employeeName: "Bob Smith",
    date: yesterday.toISOString().split("T")[0],
    checkIn: "08:00",
    checkOut: "17:15",
    status: "Present",
  },
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "LR1",
    employeeId: "EMP004",
    employeeName: "Diana Prince",
    type: "Annual",
    startDate: nextWeek.toISOString().split("T")[0],
    endDate: new Date(nextWeek.getTime() + 86400000 * 2)
      .toISOString()
      .split("T")[0],
    reason: "Family Vacation",
    status: "Pending",
  },
  {
    id: "LR2",
    employeeId: "EMP005",
    employeeName: "Evan Wright",
    type: "Sick",
    startDate: yesterday.toISOString().split("T")[0],
    endDate: yesterday.toISOString().split("T")[0],
    reason: "Flu",
    status: "Approved",
  },
  {
    id: "LR3",
    employeeId: "EMP002",
    employeeName: "Bob Smith",
    type: "Unpaid",
    startDate: nextWeek.toISOString().split("T")[0],
    endDate: nextWeek.toISOString().split("T")[0],
    reason: "Personal Matters",
    status: "Rejected",
  },
];

// --- TALENT MANAGEMENT MOCKS ---

export interface Candidate {
  id: string;
  name: string;
  role: string;
  stage: "Applied" | "Screening" | "Interview" | "Offer" | "Hired";
  aiScore: number; // 0-100
  email: string;
  appliedDate: string;
}

export interface Goal {
  id: string;
  title: string;
  weight: number; // Percentage 0-100
  score: number; // 0-100
  comment?: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string; // "Q4 2025"
  rating: number; // 1-5
  kpiScore: number; // 0-100
  feedback: string;
  goals: Goal[];
}

export interface Course {
  id: string;
  title: string;
  category: "Technical" | "Soft Skills" | "Compliance";
  duration: string;
  progress: number; // 0-100
  thumbnail: string; // color or image url placeholder
  status: "Not Started" | "In Progress" | "Completed";
}

export const mockCandidates: Candidate[] = [
  {
    id: "C1",
    name: "John Doe",
    role: "Senior Frontend Dev",
    stage: "Interview",
    aiScore: 88,
    email: "john@example.com",
    appliedDate: "2025-12-28",
  },
  {
    id: "C2",
    name: "Jane Smith",
    role: "Product Manager",
    stage: "Applied",
    aiScore: 72,
    email: "jane@example.com",
    appliedDate: "2026-01-02",
  },
  {
    id: "C3",
    name: "Michael Scott",
    role: "Sales Director",
    stage: "Screening",
    aiScore: 45,
    email: "mscott@dundermifflin.com",
    appliedDate: "2025-12-30",
  },
  {
    id: "C4",
    name: "Emily Blunt",
    role: "UX Designer",
    stage: "Offer",
    aiScore: 95,
    email: "emily@example.com",
    appliedDate: "2025-12-15",
  },
];

export const mockReviews: PerformanceReview[] = [
  {
    id: "PR1",
    employeeId: "EMP001",
    employeeName: "Alice Johnson",
    period: "Q4 2025",
    rating: 4.8,
    kpiScore: 98,
    feedback: "Exceptional leadership during the merger.",
    goals: [
      { id: "G1", title: "Merger Completion", weight: 50, score: 100 },
      { id: "G2", title: "Revenue Growth", weight: 50, score: 96 },
    ],
  },
  {
    id: "PR2",
    employeeId: "EMP005",
    employeeName: "Evan Wright",
    period: "Q4 2025",
    rating: 4.2,
    kpiScore: 89,
    feedback: "Great code quality, but needs to improve on deadlines.",
    goals: [
      { id: "G1", title: "Feature Delivery", weight: 60, score: 85 },
      { id: "G2", title: "Code Quality", weight: 40, score: 95 },
    ],
  },
  {
    id: "PR3",
    employeeId: "EMP003",
    employeeName: "Charlie Davis",
    period: "Q4 2025",
    rating: 3.5,
    kpiScore: 75,
    feedback: "Solid performance, but communication could be better.",
    goals: [
      { id: "G1", title: "System Uptime", weight: 70, score: 80 },
      { id: "G2", title: "Team Management", weight: 30, score: 65 },
    ],
  },
];

export const mockCourses: Course[] = [
  {
    id: "LMS1",
    title: "Cybersecurity Awareness 2026",
    category: "Compliance",
    duration: "2h 30m",
    progress: 0,
    thumbnail: "bg-red-500",
    status: "Not Started",
  },
  {
    id: "LMS2",
    title: "Advanced React Patterns",
    category: "Technical",
    duration: "6h",
    progress: 45,
    thumbnail: "bg-blue-500",
    status: "In Progress",
  },
  {
    id: "LMS3",
    title: "Effective Leadership",
    category: "Soft Skills",
    duration: "4h",
    progress: 100,
    thumbnail: "bg-green-500",
    status: "Completed",
  },
];

// --- EMPLOYEE SELF-SERVICE MOCKS ---

export interface ReimbursementRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "Travel" | "Meals" | "Equipment" | "Medical" | "Other";
  amount: number;
  date: string;
  description: string;
  status: "Pending" | "Approved" | "Rejected";
  receiptUrl?: string;
}

export interface HandbookDocument {
  id: string;
  title: string;
  category: "Policy" | "Guideline" | "Form" | "SOP";
  description: string;
  url: string;
  updatedAt: string;
}

export const mockReimbursements: ReimbursementRequest[] = [
  {
    id: "R1",
    employeeId: "EMP005",
    employeeName: "Evan Wright",
    type: "Travel",
    amount: 500000,
    date: "2026-01-02",
    description: "Client visit to Surabaya",
    status: "Pending",
  },
  {
    id: "R2",
    employeeId: "EMP005",
    employeeName: "Evan Wright",
    type: "Equipment",
    amount: 1500000,
    date: "2025-12-20",
    description: "Mechanical keyboard",
    status: "Approved",
  },
  {
    id: "R3",
    employeeId: "EMP003",
    employeeName: "Charlie Davis",
    type: "Medical",
    amount: 750000,
    date: "2025-12-15",
    description: "Eye checkup",
    status: "Rejected",
  },
];

export const mockHandbook: HandbookDocument[] = [
  {
    id: "H1",
    title: "Employee Handbook 2026",
    category: "Policy",
    description: "Comprehensive guide to company policies and benefits.",
    url: "#",
    updatedAt: "2026-01-01",
  },
  {
    id: "H2",
    title: "Code of Conduct",
    category: "Guideline",
    description: "Ethical standards and professional behavior expectations.",
    url: "#",
    updatedAt: "2025-06-15",
  },
  {
    id: "H3",
    title: "Leave Request Form",
    category: "Form",
    description: "Official form for requesting time off.",
    url: "#",
    updatedAt: "2025-01-01",
  },
  {
    id: "H4",
    title: "IT Security SOP",
    category: "SOP",
    description: "Standard procedures for information security.",
    url: "#",
    updatedAt: "2025-09-01",
  },
  {
    id: "H5",
    title: "Remote Work Guidelines",
    category: "Guideline",
    description: "Policies for working from home.",
    url: "#",
    updatedAt: "2025-03-01",
  },
];
