"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  DollarSign,
  Activity,
  Calendar,
  TrendingUp,
  UserPlus,
  FileText,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Stethoscope,
  ClipboardList,
  CreditCard,
  Package,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { InputDate } from "@/components/ui/InputDate";
import { InputDropdown, Option } from "@/components/ui/InputDropdown";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Mock data for Revenue Chart
const revenueData = [
  { month: "Jul", revenue: 32000, expenses: 24000 },
  { month: "Aug", revenue: 38000, expenses: 26000 },
  { month: "Sep", revenue: 35000, expenses: 25000 },
  { month: "Oct", revenue: 42000, expenses: 28000 },
  { month: "Nov", revenue: 45000, expenses: 30000 },
  { month: "Dec", revenue: 48290, expenses: 32000 },
];

// Mock data for Weekly Appointments
const appointmentsData = [
  { day: "Mon", completed: 12, scheduled: 4 },
  { day: "Tue", completed: 15, scheduled: 3 },
  { day: "Wed", completed: 10, scheduled: 8 },
  { day: "Thu", completed: 18, scheduled: 2 },
  { day: "Fri", completed: 14, scheduled: 6 },
  { day: "Sat", completed: 8, scheduled: 2 },
  { day: "Sun", completed: 3, scheduled: 1 },
];

// Mock data for Patient Distribution
const patientDistribution = [
  { name: "Stable", value: 45, color: "#22c55e" },
  { name: "In Treatment", value: 28, color: "#3b82f6" },
  { name: "Critical", value: 12, color: "#ef4444" },
  { name: "Observation", value: 15, color: "#f59e0b" },
];

// Stats data
const stats = [
  {
    label: "Total Patients",
    value: "1,284",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    label: "Monthly Revenue",
    value: "$48,290",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-50",
    gradient: "from-green-500 to-green-600",
  },
  {
    label: "Active Staff",
    value: "142",
    change: "-2%",
    trend: "down",
    icon: Activity,
    color: "text-purple-600",
    bg: "bg-purple-50",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    label: "Appointments",
    value: "84",
    change: "+24",
    trend: "up",
    icon: Calendar,
    color: "text-orange-600",
    bg: "bg-orange-50",
    gradient: "from-orange-500 to-orange-600",
  },
];

// Today's appointments mock data
const todayAppointments = [
  {
    id: 1,
    patient: "Sarah Connor",
    time: "09:00 AM",
    doctor: "Dr. Wilson",
    type: "Check-up",
    status: "completed",
  },
  {
    id: 2,
    patient: "John Wick",
    time: "10:30 AM",
    doctor: "Dr. House",
    type: "Follow-up",
    status: "completed",
  },
  {
    id: 3,
    patient: "Ellen Ripley",
    time: "02:00 PM",
    doctor: "Dr. Grey",
    type: "Consultation",
    status: "upcoming",
  },
  {
    id: 4,
    patient: "Bruce Wayne",
    time: "03:30 PM",
    doctor: "Dr. Strange",
    type: "Lab Results",
    status: "upcoming",
  },
];

// Recent activity
const recentActivity = [
  {
    user: "Dr. Sarah Smith",
    action: "completed appointment",
    target: "Patient #1024",
    time: "10 minutes ago",
    icon: Stethoscope,
  },
  {
    user: "HR System",
    action: "posted new job opening",
    target: "Senior Nurse",
    time: "25 minutes ago",
    icon: Users,
  },
  {
    user: "Finance Dept",
    action: "generated invoice",
    target: "INV-2024-001",
    time: "1 hour ago",
    icon: DollarSign,
  },
  {
    user: "System",
    action: "backup completed",
    target: "Daily Snapshot",
    time: "2 hours ago",
    icon: FileText,
  },
];

// Doctor options for dropdowns
const doctorOptions = [
  { label: "Dr. James Wilson - General Medicine", value: "dr-wilson" },
  { label: "Dr. Gregory House - Diagnostic Medicine", value: "dr-house" },
  { label: "Dr. Meredith Grey - Surgery", value: "dr-grey" },
  { label: "Dr. Stephen Strange - Neurology", value: "dr-strange" },
];

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}:{" "}
            {typeof entry.value === "number" && entry.name.includes("revenue")
              ? `$${entry.value.toLocaleString()}`
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  // Modal states
  const [patientModalOpen, setPatientModalOpen] = React.useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = React.useState(false);
  const [billingModalOpen, setBillingModalOpen] = React.useState(false);
  const [inventoryModalOpen, setInventoryModalOpen] = React.useState(false);

  // Form states
  const [patientForm, setPatientForm] = React.useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dob: null as Date | null,
    gender: null as Option | null,
  });

  const [appointmentForm, setAppointmentForm] = React.useState({
    patientName: "",
    doctor: null as Option | null,
    date: null as Date | null,
    time: "",
    type: null as Option | null,
    notes: "",
  });

  const [billingForm, setBillingForm] = React.useState({
    patientName: "",
    amount: "",
    description: "",
    dueDate: null as Date | null,
  });

  const [inventoryForm, setInventoryForm] = React.useState({
    itemName: "",
    quantity: "",
    category: null as Option | null,
    supplier: "",
  });

  // Quick actions with modal triggers
  const quickActions = [
    {
      label: "New Patient",
      icon: UserPlus,
      color: "bg-blue-500",
      onClick: () => setPatientModalOpen(true),
    },
    {
      label: "New Appointment",
      icon: Calendar,
      color: "bg-green-500",
      onClick: () => setAppointmentModalOpen(true),
    },
    {
      label: "New Billing",
      icon: CreditCard,
      color: "bg-purple-500",
      onClick: () => setBillingModalOpen(true),
    },
    {
      label: "Add Stock",
      icon: Package,
      color: "bg-orange-500",
      onClick: () => setInventoryModalOpen(true),
    },
  ];

  // Form handlers
  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPatientModalOpen(false);
      addToast("success", "Patient registered successfully!");
      setPatientForm({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        dob: null,
        gender: null,
      });
    }, 800);
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAppointmentModalOpen(false);
      addToast("success", "Appointment scheduled successfully!");
      setAppointmentForm({
        patientName: "",
        doctor: null,
        date: null,
        time: "",
        type: null,
        notes: "",
      });
    }, 800);
  };

  const handleBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setBillingModalOpen(false);
      addToast("success", "Invoice created successfully!");
      setBillingForm({
        patientName: "",
        amount: "",
        description: "",
        dueDate: null,
      });
    }, 800);
  };

  const handleInventorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setInventoryModalOpen(false);
      addToast("success", "Stock added successfully!");
      setInventoryForm({
        itemName: "",
        quantity: "",
        category: null,
        supplier: "",
      });
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, Administrator. Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar size={16} /> Jan 2026
          </Button>
          <Button className="gap-2">
            <FileText size={16} /> Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}
              >
                <stat.icon size={22} />
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
                  stat.trend === "up"
                    ? "text-green-600 bg-green-50"
                    : "text-red-600 bg-red-50"
                }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight size={12} />
                ) : (
                  <ArrowDownRight size={12} />
                )}
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1 group-hover:text-blue-600 transition-colors">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions - NOW AT THE TOP */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Quick Actions</h3>
          <span className="text-xs text-gray-500">Click to open form</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all group border border-gray-200 hover:border-gray-300 hover:shadow-md"
            >
              <div
                className={`p-3 rounded-xl ${action.color} text-white mb-2 group-hover:scale-110 transition-transform shadow-lg`}
              >
                <action.icon size={20} />
              </div>
              <span className="text-xs font-medium text-gray-700">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - 2 columns */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-gray-900">Revenue Overview</h3>
              <p className="text-sm text-gray-500">
                Monthly revenue vs expenses
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-600">
              View Report <ChevronRight size={16} />
            </Button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorExpenses"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#colorExpenses)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900">Today's Appointments</h3>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {todayAppointments.length} total
            </span>
          </div>
          <div className="space-y-3">
            {todayAppointments.map((apt) => (
              <div
                key={apt.id}
                className={`p-3 rounded-lg border transition-all hover:shadow-md cursor-pointer ${
                  apt.status === "completed"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-blue-50/50 border-blue-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        apt.status === "completed"
                          ? "text-gray-600"
                          : "text-gray-900"
                      }`}
                    >
                      {apt.patient}
                    </p>
                    <p className="text-xs text-gray-500">
                      {apt.doctor} • {apt.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-900 flex items-center gap-1">
                      <Clock size={10} /> {apt.time}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        apt.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4 text-sm text-gray-500">
            View All Appointments
          </Button>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-gray-900">Weekly Appointments</h3>
              <p className="text-sm text-gray-500">
                Completed vs Scheduled this week
              </p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={appointmentsData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="scheduled"
                  name="Scheduled"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patient Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Patient Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={patientDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {patientDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: string) => (
                    <span className="text-xs text-gray-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Third Row - Recent Activity */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900">Recent Activity</h3>
          <ClipboardList size={16} className="text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className="flex gap-3 items-start p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
            >
              <div className="mt-0.5">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-full text-white shadow-md">
                  <item.icon size={14} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{item.user}</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{item.action}</p>
                <p className="text-xs font-medium text-blue-600 mt-1">
                  {item.target}
                </p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Clock size={10} /> {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ MODALS ============ */}

      {/* New Patient Modal */}
      <Modal
        isOpen={patientModalOpen}
        onClose={() => setPatientModalOpen(false)}
        title="Register New Patient"
        description="Fill in the basic patient information."
        size="lg"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setPatientModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" form="patient-form" isLoading={isLoading}>
              Register Patient
            </Button>
          </>
        }
      >
        <form
          id="patient-form"
          onSubmit={handlePatientSubmit}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <InputText
              label="First Name"
              placeholder="First name"
              value={patientForm.firstName}
              onChange={(e) =>
                setPatientForm({ ...patientForm, firstName: e.target.value })
              }
              required
            />
            <InputText
              label="Last Name"
              placeholder="Last name"
              value={patientForm.lastName}
              onChange={(e) =>
                setPatientForm({ ...patientForm, lastName: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputDate
              label="Date of Birth"
              value={patientForm.dob}
              onChange={(date) => setPatientForm({ ...patientForm, dob: date })}
              placeholder="Select date"
              required
            />
            <InputDropdown
              label="Gender"
              name="gender"
              value={patientForm.gender}
              onChange={(option) =>
                setPatientForm({ ...patientForm, gender: option })
              }
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ]}
              placeholder="Select gender"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputText
              label="Phone"
              placeholder="+62..."
              value={patientForm.phone}
              onChange={(e) =>
                setPatientForm({ ...patientForm, phone: e.target.value })
              }
              required
            />
            <InputText
              label="Email"
              type="email"
              placeholder="email@example.com"
              value={patientForm.email}
              onChange={(e) =>
                setPatientForm({ ...patientForm, email: e.target.value })
              }
            />
          </div>
        </form>
      </Modal>

      {/* New Appointment Modal */}
      <Modal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        title="Schedule New Appointment"
        description="Book a new appointment for a patient."
        size="lg"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setAppointmentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" form="appointment-form" isLoading={isLoading}>
              Schedule
            </Button>
          </>
        }
      >
        <form
          id="appointment-form"
          onSubmit={handleAppointmentSubmit}
          className="space-y-4"
        >
          <InputText
            label="Patient Name"
            placeholder="Enter patient name"
            value={appointmentForm.patientName}
            onChange={(e) =>
              setAppointmentForm({
                ...appointmentForm,
                patientName: e.target.value,
              })
            }
            required
          />
          <InputDropdown
            label="Doctor"
            name="doctor"
            value={appointmentForm.doctor}
            onChange={(option) =>
              setAppointmentForm({ ...appointmentForm, doctor: option })
            }
            options={doctorOptions}
            placeholder="Select doctor"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <InputDate
              label="Date"
              value={appointmentForm.date}
              onChange={(date) =>
                setAppointmentForm({ ...appointmentForm, date: date })
              }
              placeholder="Select date"
              required
            />
            <InputText
              label="Time"
              type="time"
              value={appointmentForm.time}
              onChange={(e) =>
                setAppointmentForm({ ...appointmentForm, time: e.target.value })
              }
              required
            />
          </div>
          <InputDropdown
            label="Appointment Type"
            name="type"
            value={appointmentForm.type}
            onChange={(option) =>
              setAppointmentForm({ ...appointmentForm, type: option })
            }
            options={[
              { label: "Check-up", value: "checkup" },
              { label: "Follow-up", value: "followup" },
              { label: "Consultation", value: "consultation" },
              { label: "Lab Results", value: "lab" },
              { label: "Emergency", value: "emergency" },
            ]}
            placeholder="Select type"
            required
          />
          <InputText
            label="Notes (Optional)"
            placeholder="Additional notes..."
            value={appointmentForm.notes}
            onChange={(e) =>
              setAppointmentForm({ ...appointmentForm, notes: e.target.value })
            }
          />
        </form>
      </Modal>

      {/* New Billing Modal */}
      <Modal
        isOpen={billingModalOpen}
        onClose={() => setBillingModalOpen(false)}
        title="Create New Invoice"
        description="Generate a new billing invoice."
        size="lg"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setBillingModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" form="billing-form" isLoading={isLoading}>
              Create Invoice
            </Button>
          </>
        }
      >
        <form
          id="billing-form"
          onSubmit={handleBillingSubmit}
          className="space-y-4"
        >
          <InputText
            label="Patient Name"
            placeholder="Enter patient name"
            value={billingForm.patientName}
            onChange={(e) =>
              setBillingForm({ ...billingForm, patientName: e.target.value })
            }
            required
          />
          <InputText
            label="Amount"
            type="number"
            placeholder="0.00"
            value={billingForm.amount}
            onChange={(e) =>
              setBillingForm({ ...billingForm, amount: e.target.value })
            }
            required
          />
          <InputText
            label="Description"
            placeholder="Invoice description..."
            value={billingForm.description}
            onChange={(e) =>
              setBillingForm({ ...billingForm, description: e.target.value })
            }
            required
          />
          <InputDate
            label="Due Date"
            value={billingForm.dueDate}
            onChange={(date) =>
              setBillingForm({ ...billingForm, dueDate: date })
            }
            placeholder="Select due date"
            required
          />
        </form>
      </Modal>

      {/* Add Stock Modal */}
      <Modal
        isOpen={inventoryModalOpen}
        onClose={() => setInventoryModalOpen(false)}
        title="Add Inventory Stock"
        description="Add new items to inventory."
        size="lg"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setInventoryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" form="inventory-form" isLoading={isLoading}>
              Add Stock
            </Button>
          </>
        }
      >
        <form
          id="inventory-form"
          onSubmit={handleInventorySubmit}
          className="space-y-4"
        >
          <InputText
            label="Item Name"
            placeholder="Enter item name"
            value={inventoryForm.itemName}
            onChange={(e) =>
              setInventoryForm({ ...inventoryForm, itemName: e.target.value })
            }
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <InputText
              label="Quantity"
              type="number"
              placeholder="0"
              value={inventoryForm.quantity}
              onChange={(e) =>
                setInventoryForm({ ...inventoryForm, quantity: e.target.value })
              }
              required
            />
            <InputDropdown
              label="Category"
              name="category"
              value={inventoryForm.category}
              onChange={(option) =>
                setInventoryForm({ ...inventoryForm, category: option })
              }
              options={[
                { label: "Drugs & Medicine", value: "drugs" },
                { label: "Medical Supplies", value: "supplies" },
                { label: "Equipment", value: "equipment" },
                { label: "Office Supplies", value: "office" },
              ]}
              placeholder="Select category"
              required
            />
          </div>
          <InputText
            label="Supplier"
            placeholder="Supplier name"
            value={inventoryForm.supplier}
            onChange={(e) =>
              setInventoryForm({ ...inventoryForm, supplier: e.target.value })
            }
          />
        </form>
      </Modal>
    </div>
  );
}
