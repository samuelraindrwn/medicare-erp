"use client";

import * as React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, DateSelectArg } from "@fullcalendar/core";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { InputText } from "@/components/ui/InputText";
import { InputDropdown } from "@/components/ui/InputDropdown";
import { InputDate } from "@/components/ui/InputDate";
import { ModernDataTable } from "@/components/ui/DataTable";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { CardSkeleton } from "@/components/ui/Loader";
import {
  Plus,
  Calendar,
  Clock,
  User,
  Stethoscope,
  CalendarDays,
  Table,
  Edit,
  Trash2,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { TableColumn } from "react-data-table-component";
import {
  Appointment,
  appointmentTypes,
  initialAppointments,
  mockDoctors,
  mockPatients,
  getAppointmentStatus,
} from "@/lib/mock-data";

export default function PatientSchedulePage() {
  const { addToast } = useToast();
  const { confirm } = useConfirm();
  const [pageLoading, setPageLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Appointment | null>(
    null
  );
  const [isViewMode, setIsViewMode] = React.useState(false);
  const [displayMode, setDisplayMode] = React.useState<"calendar" | "table">(
    "calendar"
  );

  const [appointments, setAppointments] =
    React.useState<Appointment[]>(initialAppointments);

  const [formData, setFormData] = React.useState({
    patient: null as { label: string; value: number } | null,
    doctor: null as { label: string; value: string } | null,
    type: null as { label: string; value: string; color?: string } | null,
    date: null as Date | null,
    startTime: "",
    endTime: "",
    notes: "",
    isCompleted: false,
    attachments: null as FileList | null,
  });

  React.useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const resetForm = () => {
    setFormData({
      patient: null,
      doctor: null,
      type: null,
      date: null,
      startTime: "",
      endTime: "",
      notes: "",
      isCompleted: false,
      attachments: null,
    });
    setSelectedEvent(null);
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetForm();
    setFormData((prev) => ({
      ...prev,
      date: selectInfo.start,
      startTime: format(selectInfo.start, "HH:mm"),
      endTime: format(selectInfo.end, "HH:mm"),
      isCompleted: false,
      attachments: null,
    }));
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = appointments.find((a) => a.id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setFormData({
        patient: { label: event.patientName, value: event.patientId },
        doctor: mockDoctors.find((d) => d.value === event.doctorId) || null,
        type: appointmentTypes.find((t) => t.value === event.type) || null,
        date: event.start,
        startTime: format(event.start, "HH:mm"),
        endTime: format(event.end, "HH:mm"),
        notes: event.notes,
        isCompleted: event.isCompleted,
        attachments: null, // File inputs are uncontrolled usually, or we'd need more complex handling
      });
      setIsViewMode(true);
      setIsModalOpen(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.patient ||
      !formData.doctor ||
      !formData.type ||
      !formData.date
    ) {
      addToast("error", "Please fill in all required fields");
      return;
    }

    const [startH, startM] = formData.startTime.split(":").map(Number);
    const [endH, endM] = formData.endTime.split(":").map(Number);

    const startDate = new Date(formData.date);
    startDate.setHours(startH, startM, 0, 0);

    const endDate = new Date(formData.date);
    endDate.setHours(endH, endM, 0, 0);

    const typeInfo = appointmentTypes.find(
      (t) => t.value === formData.type?.value
    );

    if (selectedEvent) {
      // Update existing
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === selectedEvent.id
            ? {
                ...a,
                title: `${formData.type?.label} - ${formData.patient?.label}`,
                start: startDate,
                end: endDate,
                patientName: formData.patient?.label || "",
                patientId: formData.patient?.value || 0,
                doctorName: formData.doctor?.label?.split(" - ")[0] || "",
                doctorId: formData.doctor?.value || "",
                type: formData.type?.value || "",
                notes: formData.notes,
                isCompleted: formData.isCompleted,
                attachments: formData.attachments
                  ? Array.from(formData.attachments).map((f) => f.name)
                  : a.attachments || [],
                color: typeInfo?.color || "#3b82f6",
              }
            : a
        )
      );
      addToast("success", "Appointment updated successfully");
    } else {
      // Create new
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        title: `${formData.type?.label} - ${formData.patient?.label}`,
        start: startDate,
        end: endDate,
        patientName: formData.patient?.label || "",
        patientId: formData.patient?.value || 0,
        doctorName: formData.doctor?.label?.split(" - ")[0] || "",
        doctorId: formData.doctor?.value || "",
        type: formData.type?.value || "",
        notes: formData.notes,
        isCompleted: formData.isCompleted,
        attachments: formData.attachments
          ? Array.from(formData.attachments).map((f) => f.name)
          : [],
        color: typeInfo?.color || "#3b82f6",
      };
      setAppointments((prev) => [...prev, newAppointment]);
      addToast("success", "Appointment scheduled successfully");
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;

    const confirmed = await confirm({
      title: "Cancel Appointment",
      description: "Are you sure you want to cancel this appointment?",
      confirmText: "Cancel Appointment",
      variant: "destructive",
    });

    if (confirmed) {
      setAppointments((prev) => prev.filter((a) => a.id !== selectedEvent.id));
      addToast("success", "Appointment cancelled");
      setIsModalOpen(false);
      resetForm();
    }
  };

  if (pageLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6 h-[600px] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Schedule</h1>
          <p className="text-sm text-gray-500">
            Manage patient appointments and scheduling.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setDisplayMode("calendar")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                displayMode === "calendar"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <CalendarDays size={16} />
              Calendar
            </button>
            <button
              onClick={() => setDisplayMode("table")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                displayMode === "table"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Table size={16} />
              Table
            </button>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsViewMode(false);
              setIsModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 bg-white rounded-xl border border-gray-200 p-4">
        {appointmentTypes.map((type) => (
          <div key={type.value} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: type.color }}
            />
            <span className="text-sm text-gray-600">{type.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar View */}
      {displayMode === "calendar" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={appointments.map((a) => ({
              id: a.id,
              title: a.title,
              start: a.start,
              end: a.end,
              backgroundColor: a.color,
              borderColor: a.color,
            }))}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            height={600}
            slotMinTime="07:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={false}
            nowIndicator={true}
            eventDisplay="block"
          />
        </div>
      )}

      {/* Table View */}
      {displayMode === "table" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <ModernDataTable
            columns={
              [
                {
                  name: "Date & Time",
                  selector: (row: Appointment) => row.start.toISOString(),
                  sortable: true,
                  cell: (row: Appointment) => (
                    <div>
                      <div className="font-medium text-gray-900">
                        {format(row.start, "MMM d, yyyy")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(row.start, "HH:mm")} -{" "}
                        {format(row.end, "HH:mm")}
                      </div>
                    </div>
                  ),
                  width: "160px",
                },
                {
                  name: "Patient",
                  selector: (row: Appointment) => row.patientName,
                  sortable: true,
                  cell: (row: Appointment) => (
                    <div className="font-medium text-gray-900">
                      {row.patientName}
                    </div>
                  ),
                },
                {
                  name: "Doctor",
                  selector: (row: Appointment) => row.doctorName,
                  sortable: true,
                  cell: (row: Appointment) => (
                    <div className="text-gray-700">{row.doctorName}</div>
                  ),
                },
                {
                  name: "Type",
                  selector: (row: Appointment) => row.type,
                  sortable: true,
                  cell: (row: Appointment) => {
                    const typeInfo = appointmentTypes.find(
                      (t) => t.value === row.type
                    );
                    return (
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${typeInfo?.color}20`,
                          color: typeInfo?.color,
                        }}
                      >
                        {typeInfo?.label || row.type}
                      </span>
                    );
                  },
                  width: "140px",
                },
                {
                  name: "Status",
                  selector: (row: Appointment) => getAppointmentStatus(row),
                  sortable: true,
                  cell: (row: Appointment) => {
                    const status = getAppointmentStatus(row);
                    const statusColors: Record<string, string> = {
                      Waiting: "bg-gray-100 text-gray-800",
                      "In Progress": "bg-blue-100 text-blue-800",
                      "Waiting Documentation": "bg-yellow-100 text-yellow-800",
                      Completed: "bg-green-100 text-green-800",
                      Cancelled: "bg-red-100 text-red-800",
                    };
                    return (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[status] || "bg-gray-100"
                        }`}
                      >
                        {status}
                      </span>
                    );
                  },
                  width: "140px",
                },
                {
                  name: "Notes",
                  selector: (row: Appointment) => row.notes,
                  cell: (row: Appointment) => (
                    <div className="text-sm text-gray-500 truncate max-w-[200px]">
                      {row.notes || "-"}
                    </div>
                  ),
                },
                {
                  name: "Actions",
                  cell: (row: Appointment) => (
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 p-1"
                        onClick={() => {
                          setSelectedEvent(row);
                          setFormData({
                            patient: {
                              label: row.patientName,
                              value: row.patientId,
                            },
                            doctor:
                              mockDoctors.find(
                                (d) => d.value === row.doctorId
                              ) || null,
                            type:
                              appointmentTypes.find(
                                (t) => t.value === row.type
                              ) || null,
                            date: row.start,
                            startTime: format(row.start, "HH:mm"),
                            endTime: format(row.end, "HH:mm"),
                            notes: row.notes,
                            isCompleted: row.isCompleted,
                            attachments: null,
                          });
                          setIsViewMode(false);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 p-1"
                        onClick={async () => {
                          const confirmed = await confirm({
                            title: "Cancel Appointment",
                            description:
                              "Are you sure you want to cancel this appointment?",
                            confirmText: "Cancel Appointment",
                            variant: "destructive",
                          });
                          if (confirmed) {
                            setAppointments((prev) =>
                              prev.filter((a) => a.id !== row.id)
                            );
                            addToast("success", "Appointment cancelled");
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ),
                  width: "100px",
                  right: true,
                },
              ] as TableColumn<Appointment>[]
            }
            data={appointments}
            pagination
          />
        </div>
      )}

      {/* Appointment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={
          selectedEvent
            ? isViewMode
              ? "Appointment Details"
              : "Edit Appointment"
            : "Schedule New Appointment"
        }
        size="3xl"
        footer={
          <>
            {isViewMode ? (
              <>
                <Button variant="outline" onClick={handleDelete}>
                  Cancel Appointment
                </Button>
                <Button onClick={() => setIsViewMode(false)}>Edit</Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" form="appointment-form">
                  {selectedEvent ? "Update" : "Schedule"}
                </Button>
              </>
            )}
          </>
        }
      >
        {isViewMode && selectedEvent ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedEvent.color }}
              />
              <div>
                <p className="font-semibold text-gray-900">
                  {selectedEvent.title}
                </p>
                <p className="text-sm text-gray-500">
                  {format(selectedEvent.start, "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Time</p>
                  <p className="font-medium">
                    {format(selectedEvent.start, "HH:mm")} -{" "}
                    {format(selectedEvent.end, "HH:mm")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Patient</p>
                  <p className="font-medium">{selectedEvent.patientName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Stethoscope size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Doctor</p>
                  <p className="font-medium">{selectedEvent.doctorName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Type</p>
                  <p className="font-medium capitalize">{selectedEvent.type}</p>
                </div>
              </div>
            </div>

            {selectedEvent.notes && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Notes</p>
                <p className="text-sm text-gray-700">{selectedEvent.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <form
            id="appointment-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputDropdown
                label="Patient"
                options={mockPatients.map((p) => ({
                  label: `${p.firstName} ${p.lastName}`,
                  value: p.id,
                }))}
                value={formData.patient}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, patient: val as any }))
                }
                placeholder="Select Patient"
                required
              />
              <InputDropdown
                label="Doctor"
                options={mockDoctors}
                value={formData.doctor}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, doctor: val as any }))
                }
                placeholder="Select Doctor"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputDropdown
                label="Appointment Type"
                options={appointmentTypes}
                value={formData.type}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, type: val as any }))
                }
                placeholder="Select Type"
                required
              />
              <div className="flex flex-col justify-end">
                <InputDate
                  label="Date"
                  value={formData.date}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, date }))
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputText
                label="Start Time"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                  }))
                }
                required
              />
              <InputText
                label="End Time"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endTime: e.target.value }))
                }
                required
              />
            </div>

            <InputText
              label="Notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Additional notes..."
            />

            {selectedEvent && (
              <div className="pt-6 border-t border-gray-100 mt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={16} className="text-blue-600" />
                  Documentation & Completion
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attachments{" "}
                      {formData.attachments &&
                        `(${formData.attachments.length} files)`}
                    </label>
                    <input
                      type="file"
                      multiple
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                      "
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          attachments: e.target.files,
                        }))
                      }
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Upload medical documents, lab results, etc.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <input
                      type="checkbox"
                      id="isCompleted"
                      checked={formData.isCompleted}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isCompleted: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="isCompleted"
                      className="text-sm font-medium text-gray-900 select-none cursor-pointer"
                    >
                      Mark as Completed
                    </label>
                  </div>
                </div>
              </div>
            )}
          </form>
        )}
      </Modal>
    </div>
  );
}
