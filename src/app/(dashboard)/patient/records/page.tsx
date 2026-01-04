"use client";

import * as React from "react";
import { InputText } from "@/components/ui/InputText";
import { Button } from "@/components/ui/Button";
import { CardSkeleton } from "@/components/ui/Loader";
import { useToast } from "@/components/ui/Toast";
import {
  Search,
  User,
  Calendar,
  FileText,
  Activity,
  Pill,
  Stethoscope,
  ChevronRight,
  Clock,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import {
  Appointment,
  mockPatients,
  initialAppointments,
  getAppointmentStatus,
} from "@/lib/mock-data";

// Derived Medical Record from Appointment for display
interface MedicalRecord {
  id: string;
  date: Date;
  type: string;
  title: string;
  description: string;
  doctor: string;
  attachments?: string[];
  status: string;
}

// Helper to convert Appointment to MedicalRecord format
const getPatientRecords = (patientId: number): MedicalRecord[] => {
  return initialAppointments
    .filter(
      (a) =>
        a.patientId === patientId && getAppointmentStatus(a) === "Completed"
    )
    .map((a) => ({
      id: a.id,
      date: a.start,
      type: a.type,
      title: a.title, // Use title directly or map type to title
      description: a.notes,
      doctor: a.doctorName,
      attachments: a.attachments,
      status: getAppointmentStatus(a),
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
};

// --- Components ---

const RecordIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "consultation":
    case "follow-up":
    case "check-up":
      return <Stethoscope size={18} className="text-blue-600" />;
    case "emergency":
    case "surgery":
      return <Activity size={18} className="text-red-600" />;
    case "lab-test":
      return <FileText size={18} className="text-purple-600" />;
    default:
      return <FileText size={18} className="text-gray-600" />;
  }
};

const TimelineItem = ({
  record,
  isLast,
}: {
  record: MedicalRecord;
  isLast: boolean;
}) => {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm z-10">
          <RecordIcon type={record.type} />
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
      </div>
      <div className="flex-1 pb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span
                className={cn(
                  "inline-block px-2 py-0.5 rounded text-xs font-medium mb-1",
                  record.type === "consultation" && "bg-blue-50 text-blue-700",
                  record.type === "lab-test" && "bg-purple-50 text-purple-700",
                  record.type === "surgery" && "bg-orange-50 text-orange-700",
                  record.type === "follow-up" && "bg-green-50 text-green-700",
                  record.type === "emergency" && "bg-red-50 text-red-700"
                )}
              >
                {record.type.toUpperCase()}
              </span>
              <h3 className="font-semibold text-gray-900">{record.title}</h3>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar size={12} className="mr-1" />
              {format(record.date, "MMM d, yyyy")}
              <Clock size={12} className="ml-2 mr-1" />
              {format(record.date, "HH:mm")}
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
            {record.description}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                {record.doctor.charAt(0)}
              </div>
              <span className="text-xs text-gray-500">{record.doctor}</span>
            </div>
            {record.attachments && (
              <div className="flex gap-2">
                {record.attachments.map((file, idx) => (
                  <span
                    key={idx}
                    className="flex items-center text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <FileText size={12} className="mr-1" />
                    {file}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PatientRecordsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedPatientId, setSelectedPatientId] = React.useState<
    number | null
  >(null);
  const { addToast } = useToast();
  const [filterType, setFilterType] = React.useState("All");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Auto-select first patient on load
      if (mockPatients.length > 0) setSelectedPatientId(mockPatients[0].id);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredPatients = mockPatients.filter(
    (p) =>
      p.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPatient = mockPatients.find((p) => p.id === selectedPatientId);
  const allRecords = selectedPatientId
    ? getPatientRecords(selectedPatientId)
    : [];

  const patientRecords =
    filterType === "All"
      ? allRecords
      : allRecords.filter((r) => r.type === filterType);

  if (isLoading) {
    return (
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-2rem)]">
        <div className="col-span-12 md:col-span-4 space-y-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
        <div className="col-span-12 md:col-span-8 space-y-6">
          <div className="h-32 bg-gray-200 rounded-xl animate-pulse" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
      {/* Left Sidebar: Patient List */}
      <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-4 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-full">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Patients Directory
          </h2>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 dark-scrollbar">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No patients found
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatientId(patient.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group",
                  selectedPatientId === patient.id
                    ? "bg-blue-50 border-blue-100 shadow-sm"
                    : "hover:bg-gray-50 border-transparent border"
                )}
              >
                <img
                  src={patient.avatar}
                  alt={patient.firstName}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 transition-colors",
                    selectedPatientId === patient.id
                      ? "border-blue-200"
                      : "border-transparent group-hover:border-gray-200"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "font-semibold truncate",
                      selectedPatientId === patient.id
                        ? "text-blue-900"
                        : "text-gray-900"
                    )}
                  >
                    {patient.firstName} {patient.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Last visit: {patient.lastVisit}
                  </p>
                </div>
                {selectedPatientId === patient.id && (
                  <ChevronRight size={16} className="text-blue-500" />
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Content: Medical Timeline */}
      <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-6 h-full overflow-hidden">
        {selectedPatient ? (
          <>
            {/* Patient Header Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between shrink-0">
              <div className="flex items-center gap-6">
                <img
                  src={selectedPatient.avatar}
                  alt={selectedPatient.firstName}
                  className="w-20 h-20 rounded-full border-4 border-white/20 shadow-md bg-white/10"
                />
                <div>
                  <h1 className="text-2xl font-bold mb-1">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </h1>
                  <div className="flex items-center gap-4 text-blue-100 text-sm">
                    <span className="flex items-center gap-1">
                      <User size={14} /> {selectedPatient.gender},{" "}
                      {new Date().getFullYear() -
                        new Date(selectedPatient.dob).getFullYear()}{" "}
                      yrs
                    </span>
                    <span className="w-1 h-1 rounded-full bg-blue-300" />
                    <span>
                      Blood Type:{" "}
                      <span className="font-semibold text-white">
                        {selectedPatient.bloodType}
                      </span>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-blue-300" />
                    <span>
                      ID: #{selectedPatient.id.toString().padStart(6, "0")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block relative">
                <Button
                  variant="secondary"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter size={16} className="mr-2" />
                  {filterType === "All" ? "Filter Records" : filterType}
                </Button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                    {[
                      "All",
                      "consultation",
                      "follow-up",
                      "check-up",
                      "emergency",
                      "surgery",
                      "lab-test",
                    ].map((type) => (
                      <button
                        key={type}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between",
                          filterType === type
                            ? "text-blue-600 font-medium bg-blue-50"
                            : "text-gray-700"
                        )}
                        onClick={() => {
                          setFilterType(type);
                          setIsFilterOpen(false);
                        }}
                      >
                        {type}
                        {filterType === type && (
                          <div className="w-2 h-2 rounded-full bg-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                className="ml-4 bg-white/10 text-white border-white/20 hover:bg-white/20"
                onClick={() => addToast("info", "View profile clicked")}
              >
                <User size={16} className="mr-2" /> View Profile
              </Button>
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-y-auto pr-2 dark-scrollbar">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-lg">
                  Medical History
                </h3>
                <span className="text-sm text-gray-500">
                  {patientRecords.length} Records found
                </span>
              </div>

              {patientRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50 rounded-2xl border-dashed border-2 border-gray-200">
                  <FileText size={48} className="mb-4 opacity-50" />
                  <p>No medical records found for this patient.</p>
                </div>
              ) : (
                <div className="pl-4 border-l-2 border-gray-100 ml-4 space-y-0">
                  {patientRecords.map((record, index) => (
                    <TimelineItem
                      key={record.id}
                      record={record}
                      isLast={index === patientRecords.length - 1}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <User size={64} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">
              Select a patient to view records
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
