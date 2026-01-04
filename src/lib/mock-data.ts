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
