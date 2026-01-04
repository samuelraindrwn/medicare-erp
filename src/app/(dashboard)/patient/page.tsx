"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { InputDate } from "@/components/ui/InputDate";
import { InputDropdown } from "@/components/ui/InputDropdown";
import { useToast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { ModernDataTable } from "@/components/ui/DataTable";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { CardSkeleton, TableSkeleton } from "@/components/ui/Loader";
import { TableColumn } from "react-data-table-component";
import {
  Users,
  UserPlus,
  FileText,
  Activity,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { format } from "date-fns";

interface Patient {
  id: number;
  avatar: string;
  firstName: string;
  lastName: string;
  nik: string; // National ID
  dob: Date | null;
  gender: { label: string; value: string } | null;
  maritalStatus: { label: string; value: string } | null;
  phone: string;
  email: string;
  address: string;
  bloodType: { label: string; value: string } | null;
  emergencyContact: string;
  emergencyPhone: string;
  status: "Active" | "Inactive";
  medicalCondition: { label: string; value: string; color: string } | null;
  assignedDoctor: { name: string; specialty: string; avatar: string } | null;
}

export default function PatientPage() {
  const { addToast } = useToast();
  const { confirm } = useConfirm();
  const [pageLoading, setPageLoading] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [profilePatient, setProfilePatient] = React.useState<Patient | null>(
    null
  );

  // Simulate initial page load
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Mock Data
  const [patients, setPatients] = React.useState<Patient[]>([
    {
      id: 1,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      firstName: "Sarah",
      lastName: "Connor",
      nik: "3171012345678001",
      dob: new Date("1985-04-12"),
      gender: { label: "Female", value: "female" },
      maritalStatus: { label: "Single", value: "single" },
      phone: "+62 812 3456 7890",
      email: "sarah@example.com",
      address: "123 Tech Street, Silicon Valley, CA",
      bloodType: { label: "O+", value: "O+" },
      emergencyContact: "Kyle Reese",
      emergencyPhone: "+62 899 1122 3344",
      status: "Active",
      medicalCondition: {
        label: "Stable",
        value: "stable",
        color: "bg-green-100 text-green-800",
      },
      assignedDoctor: {
        name: "Dr. James Wilson",
        specialty: "General Medicine",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DrWilson",
      },
    },
    {
      id: 2,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      firstName: "John",
      lastName: "Wick",
      nik: "3172098765432002",
      dob: new Date("1980-09-02"),
      gender: { label: "Male", value: "male" },
      maritalStatus: { label: "Widowed", value: "widowed" },
      phone: "+62 811 2233 4455",
      email: "john@continental.com",
      address: "Continental Hotel, Room 101, NYC",
      bloodType: { label: "AB+", value: "AB+" },
      emergencyContact: "Winston",
      emergencyPhone: "+62 877 5566 7788",
      status: "Active",
      medicalCondition: {
        label: "Critical",
        value: "critical",
        color: "bg-red-100 text-red-800",
      },
      assignedDoctor: {
        name: "Dr. Gregory House",
        specialty: "Diagnostic Medicine",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DrHouse",
      },
    },
    {
      id: 3,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ellen",
      firstName: "Ellen",
      lastName: "Ripley",
      nik: "3173055566677003",
      dob: new Date("2022-01-08"),
      gender: { label: "Female", value: "female" },
      maritalStatus: { label: "Married", value: "married" },
      phone: "+62 888 9999 0000",
      email: "ellen@nostromo.space",
      address: "Nostromo Spaceship, Deck 4",
      bloodType: { label: "A-", value: "A-" },
      emergencyContact: "Newt",
      emergencyPhone: "+62 855 0000 1111",
      status: "Inactive",
      medicalCondition: {
        label: "Discharged",
        value: "discharged",
        color: "bg-gray-100 text-gray-800",
      },
      assignedDoctor: {
        name: "Dr. Beverly Crusher",
        specialty: "Emergency Medicine",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DrCrusher",
      },
    },
  ]);

  const doctorOptions = [
    {
      label: "Dr. James Wilson - General Medicine",
      value: "dr-wilson",
      name: "Dr. James Wilson",
      specialty: "General Medicine",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DrWilson",
    },
    {
      label: "Dr. Gregory House - Diagnostic Medicine",
      value: "dr-house",
      name: "Dr. Gregory House",
      specialty: "Diagnostic Medicine",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DrHouse",
    },
    {
      label: "Dr. Beverly Crusher - Emergency Medicine",
      value: "dr-crusher",
      name: "Dr. Beverly Crusher",
      specialty: "Emergency Medicine",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DrCrusher",
    },
    {
      label: "Dr. Meredith Grey - Surgery",
      value: "dr-grey",
      name: "Dr. Meredith Grey",
      specialty: "Surgery",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DrGrey",
    },
    {
      label: "Dr. Derek Shepherd - Neurology",
      value: "dr-shepherd",
      name: "Dr. Derek Shepherd",
      specialty: "Neurology",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DrShepherd",
    },
  ];

  const [formData, setFormData] = React.useState<Partial<Patient>>({
    firstName: "",
    lastName: "",
    nik: "",
    dob: null,
    gender: null,
    maritalStatus: null,
    phone: "",
    email: "",
    address: "",
    bloodType: null,
    emergencyContact: "",
    emergencyPhone: "",
    assignedDoctor: null,
  });

  const handleOpenModal = (patient?: Patient) => {
    if (patient) {
      setEditingId(patient.id);
      setFormData({ ...patient });
    } else {
      setEditingId(null);
      setFormData({
        firstName: "",
        lastName: "",
        nik: "",
        dob: null,
        gender: null,
        maritalStatus: null,
        phone: "",
        email: "",
        address: "",
        bloodType: null,
        emergencyContact: "",
        emergencyPhone: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (editingId) {
        setPatients((prev) =>
          prev.map((p) =>
            p.id === editingId ? ({ ...p, ...formData } as Patient) : p
          )
        );
        addToast("success", "Patient updated successfully");
      } else {
        const newPatient = {
          ...formData,
          id: patients.length + 1,
          status: "Active",
        } as Patient;
        setPatients([...patients, newPatient]);
        addToast("success", "Patient registered successfully");
      }
      setIsLoading(false);
      setIsModalOpen(false);
    }, 800);
  };

  const handleDeactivate = async (id: number) => {
    const isConfirmed = await confirm({
      title: "Deactivate Patient",
      description:
        "Are you sure you want to deactivate this patient record? The record will be marked as inactive but not deleted.",
      confirmText: "Deactivate",
      variant: "destructive",
    });

    if (isConfirmed) {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: "Inactive" as const } : p
        )
      );
      addToast("success", "Patient record deactivated");
    }
  };

  const columns: TableColumn<Patient>[] = [
    {
      name: "Patient Name",
      selector: (row) => `${row.firstName} ${row.lastName}`,
      sortable: true,
      cell: (row) => (
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setProfilePatient(row)}
        >
          <img
            src={row.avatar}
            alt={`${row.firstName} ${row.lastName}`}
            className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm group-hover:border-blue-300 transition-colors"
          />
          <div>
            <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
              {row.firstName} {row.lastName}
            </div>
            <div className="text-xs text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
      width: "280px",
    },
    {
      name: "Birth Date",
      selector: (row) => (row.dob ? row.dob.toString() : ""),
      sortable: true,
      cell: (row) => (row.dob ? format(row.dob, "dd MMM yyyy") : "-"),
    },
    {
      name: "Gender",
      selector: (row) => row.gender?.label || "",
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Condition",
      selector: (row) => row.medicalCondition?.label || "",
      sortable: true,
      cell: (row) =>
        row.medicalCondition ? (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${row.medicalCondition.color}`}
          >
            {row.medicalCondition.label}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="text-blue-600 hover:text-blue-800 p-1"
            onClick={() => handleOpenModal(row)}
          >
            <Edit size={16} />
          </button>
          <button
            className="text-red-600 hover:text-red-800 p-1"
            onClick={() => handleDeactivate(row.id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
      width: "100px",
      right: true,
    },
  ];

  if (pageLoading) {
    return (
      <div className="space-y-6">
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>

        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>

        {/* Table Skeleton */}
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-blue-900/5 hover:-translate-y-1 transition-transform duration-300 border border-gray-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users size={64} className="text-blue-600" />
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Patients</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">
              {patients.length}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-green-900/5 hover:-translate-y-1 transition-transform duration-300 border border-gray-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <UserPlus size={64} className="text-green-600" />
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-xl w-fit mb-4">
            <UserPlus size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">New This Month</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">12</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-purple-900/5 hover:-translate-y-1 transition-transform duration-300 border border-gray-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={64} className="text-purple-600" />
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit mb-4">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Visits</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">5</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-orange-900/5 hover:-translate-y-1 transition-transform duration-300 border border-gray-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText size={64} className="text-orange-600" />
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl w-fit mb-4">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending Reports</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">3</h3>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end px-2">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Patient Directory
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage patient records and medical history.
            </p>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all rounded-xl"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </div>
        <ModernDataTable
          columns={columns}
          data={patients}
          searchable
          searchField="firstName"
          pagination
          filters={[
            {
              key: "status",
              label: "Status",
              type: "select",
              options: [
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ],
            },
            {
              key: "gender",
              label: "Gender",
              type: "select",
              options: [
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ],
            },
            {
              key: "bloodType",
              label: "Blood Type",
              type: "select",
              options: [
                { label: "A", value: "A" },
                { label: "B", value: "B" },
                { label: "O", value: "O" },
                { label: "AB", value: "AB" },
              ],
            },
          ]}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Patient Record" : "Register New Patient"}
        description="Fill in the patient's personal and medical information."
        size="3xl"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" form="patient-form" isLoading={isLoading}>
              {editingId ? "Save Changes" : "Register Patient"}
            </Button>
          </>
        }
      >
        <form
          id="patient-form"
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[70vh] overflow-y-auto px-1"
        >
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputText
                label="NIK (National ID)"
                name="nik"
                value={formData.nik}
                onChange={(e) => handleChange("nik", e.target.value)}
                required
                placeholder="16-digit ID Number"
              />
              <InputText
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputText
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                required
                placeholder="First Name"
              />
              <InputText
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                required
                placeholder="Last Name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputDate
                label="Date of Birth"
                value={formData.dob}
                onChange={(date) => handleChange("dob", date)}
                required
                placeholder="DD/MM/YYYY"
              />
              <InputDropdown
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={(option) => handleChange("gender", option)}
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]}
                required
                placeholder="Select Gender"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputDropdown
                label="Marital Status"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={(option) => handleChange("maritalStatus", option)}
                options={[
                  { label: "Single", value: "single" },
                  { label: "Married", value: "married" },
                  { label: "Divorced", value: "divorced" },
                  { label: "Widowed", value: "widowed" },
                ]}
                placeholder="Select Status"
              />
              <InputDropdown
                label="Blood Type"
                name="bloodType"
                value={formData.bloodType}
                onChange={(option) => handleChange("bloodType", option)}
                options={[
                  { label: "A+", value: "A+" },
                  { label: "A-", value: "A-" },
                  { label: "B+", value: "B+" },
                  { label: "B-", value: "B-" },
                  { label: "O+", value: "O+" },
                  { label: "O-", value: "O-" },
                  { label: "AB+", value: "AB+" },
                  { label: "AB-", value: "AB-" },
                ]}
                placeholder="Select Type"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <InputText
                label="Address"
                name="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Full Residential Address"
              />
            </div>
          </div>

          {/* Contact & Emergency */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">
              Contact & Emergency
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputText
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
                placeholder="+62..."
              />
              <InputText
                label="Emergency Phone"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={(e) => handleChange("emergencyPhone", e.target.value)}
                placeholder="+62... (Family/Relation)"
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <InputText
                label="Emergency Contact Name"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) =>
                  handleChange("emergencyContact", e.target.value)
                }
                placeholder="Name of emergency contact person"
              />
            </div>
          </div>

          {/* Medical Care */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">
              Medical Care
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputDropdown
                label="Assigned Doctor"
                name="assignedDoctor"
                value={
                  formData.assignedDoctor
                    ? {
                        label: `${formData.assignedDoctor.name} - ${formData.assignedDoctor.specialty}`,
                        value: formData.assignedDoctor.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace("dr.", "dr"),
                      }
                    : null
                }
                onChange={(option) => {
                  if (option) {
                    const doctor = doctorOptions.find(
                      (d) => d.value === option.value
                    );
                    if (doctor) {
                      handleChange("assignedDoctor", {
                        name: doctor.name,
                        specialty: doctor.specialty,
                        avatar: doctor.avatar,
                      });
                    }
                  } else {
                    handleChange("assignedDoctor", null);
                  }
                }}
                options={doctorOptions}
                placeholder="Select Doctor"
              />
              <InputDropdown
                label="Medical Condition"
                name="medicalCondition"
                value={formData.medicalCondition}
                onChange={(option) => handleChange("medicalCondition", option)}
                options={[
                  { label: "Stable", value: "stable" },
                  { label: "Critical", value: "critical" },
                  { label: "In Treatment", value: "in-treatment" },
                  { label: "Observation", value: "observation" },
                  { label: "Discharged", value: "discharged" },
                ]}
                placeholder="Select Condition"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Patient Profile Modal */}
      <Modal
        isOpen={!!profilePatient}
        onClose={() => setProfilePatient(null)}
        title="Patient Profile"
        size="2xl"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                if (profilePatient) handleOpenModal(profilePatient);
                setProfilePatient(null);
              }}
            >
              <Edit size={16} className="mr-2" /> Edit Profile
            </Button>
            <Button onClick={() => setProfilePatient(null)}>Close</Button>
          </>
        }
      >
        {profilePatient && (
          <div className="space-y-6">
            {/* Header with Avatar */}
            <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
              <img
                src={profilePatient.avatar}
                alt={`${profilePatient.firstName} ${profilePatient.lastName}`}
                className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-lg"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profilePatient.firstName} {profilePatient.lastName}
                </h2>
                <p className="text-gray-500">{profilePatient.email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      profilePatient.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {profilePatient.status}
                  </span>
                  {profilePatient.medicalCondition && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${profilePatient.medicalCondition.color}`}
                    >
                      {profilePatient.medicalCondition.label}
                    </span>
                  )}
                  {profilePatient.bloodType && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      Blood: {profilePatient.bloodType.label}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">NIK (National ID)</p>
                  <p className="font-medium text-gray-900">
                    {profilePatient.nik || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Date of Birth</p>
                  <p className="font-medium text-gray-900">
                    {profilePatient.dob
                      ? format(profilePatient.dob, "dd MMMM yyyy")
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Gender</p>
                  <p className="font-medium text-gray-900">
                    {profilePatient.gender?.label || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Marital Status</p>
                  <p className="font-medium text-gray-900">
                    {profilePatient.maritalStatus?.label || "-"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-400">Address</p>
                  <p className="font-medium text-gray-900">
                    {profilePatient.address || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Contact & Emergency
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Phone Number</p>
                  <p className="font-medium text-gray-900">
                    {profilePatient.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Emergency Contact</p>
                  <p className="font-medium text-gray-900">
                    {profilePatient.emergencyContact || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Emergency Phone</p>
                  <p className="font-medium text-gray-900">
                    {profilePatient.emergencyPhone || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Doctor In-Charge */}
            {profilePatient.assignedDoctor && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Doctor In-Charge
                </h3>
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                  <img
                    src={profilePatient.assignedDoctor.avatar}
                    alt={profilePatient.assignedDoctor.name}
                    className="w-14 h-14 rounded-full bg-white border-2 border-white shadow-md"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {profilePatient.assignedDoctor.name}
                    </p>
                    <p className="text-sm text-blue-600">
                      {profilePatient.assignedDoctor.specialty}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
