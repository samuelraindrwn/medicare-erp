"use client";

import * as React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import {
  mockShifts,
  Shift,
  mockEmployees,
  mockLeaveRequests,
} from "@/lib/mock-data";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { InputDropdown } from "@/components/ui/InputDropdown";
import { useToast } from "@/components/ui/Toast";

// Mock assigning shifts to employees (User + Date + Shift)
interface ShiftAssignment {
  id: string;
  employeeName: string;
  date: string;
  shiftId: string;
}

const initialAssignments: ShiftAssignment[] = [
  {
    id: "A1",
    employeeName: "Alice Johnson",
    date: new Date().toISOString().split("T")[0],
    shiftId: "S1",
  },
  {
    id: "A2",
    employeeName: "Bob Smith",
    date: new Date().toISOString().split("T")[0],
    shiftId: "S2",
  },
  {
    id: "A3",
    employeeName: "Charlie Davis",
    date: new Date().toISOString().split("T")[0],
    shiftId: "S3",
  },
];

export function ShiftScheduler() {
  const { addToast } = useToast();
  const [assignments, setAssignments] =
    React.useState<ShiftAssignment[]>(initialAssignments);

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = React.useState<string | null>(
    null
  );
  const [selectedShift, setSelectedShift] = React.useState<string | null>(null);

  // Transform assignments into Calendar Events
  const shiftEvents = assignments
    .map((a) => {
      const shift = mockShifts.find((s) => s.id === a.shiftId);
      if (!shift) return null;

      // FullCalendar accepts 'start' as ISO string or date
      // We construct a full datetime for TimeGrid, or just Date for DayGrid
      // For simplicity in this view, we use the date + time logic
      return {
        id: a.id,
        title: `${a.employeeName}`,
        start: `${a.date}T${shift.startTime}`,
        end: `${a.date}T${shift.endTime}`,
        backgroundColor: shift.color,
        borderColor: shift.color,
        extendedProps: { type: "shift" },
      };
    })
    .filter(Boolean);

  // Transform Leave Requests into Calendar Events (Blocking)
  const leaveEvents = mockLeaveRequests
    .filter((req) => req.status === "Approved")
    .map((req) => ({
      id: `LEAVE-${req.id}`,
      title: `🚫 ${req.employeeName} (On Leave)`,
      start: req.startDate,
      end: req.endDate, // FullCalendar end date is exclusive, might need +1 day logic for realism, but simplified here
      display: "background",
      backgroundColor: "#fee2e2", // Red background
      className: "diagonal-stripe", // Custom class if needed
    }));

  const allEvents = [...shiftEvents, ...leaveEvents];

  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.dateStr);
    setIsModalOpen(true);
  };

  const handleSaveShift = () => {
    if (!selectedDate || !selectedEmployee || !selectedShift) {
      addToast("error", "Please select both employee and shift.");
      return;
    }

    const employee = mockEmployees.find((e) => e.id === selectedEmployee);
    const newAssignment: ShiftAssignment = {
      id: Math.random().toString(36).substr(2, 9),
      employeeName: employee?.firstName + " " + employee?.lastName,
      date: selectedDate,
      shiftId: selectedShift,
    };

    setAssignments([...assignments, newAssignment]);
    addToast("success", "Shift assigned successfully!");
    setIsModalOpen(false);

    // Reset
    setSelectedEmployee(null);
    setSelectedShift(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Shift Rosters</h3>
          <p className="text-sm text-gray-500">
            Click on any date to assign a shift.
          </p>
        </div>
        <div className="flex gap-2">
          {mockShifts.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-gray-50 border"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              {s.name} ({s.startTime}-{s.endTime})
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek",
          }}
          events={allEvents as any}
          dateClick={handleDateClick}
          height="auto"
          aspectRatio={1.8}
          dayMaxEvents={3}
          eventContent={(eventInfo) => {
            if (eventInfo.event.display === "background") return null; // Default background rendering
            return (
              <div className="p-1 text-xs truncate font-medium">
                {eventInfo.event.title}
              </div>
            );
          }}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Assign Shift - ${selectedDate}`}
        description="Select an employee and a shift text to assign."
        size="md"
      >
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Employee
            </label>
            <InputDropdown
              options={mockEmployees.map((e) => ({
                label: `${e.firstName} ${e.lastName}`,
                value: e.id,
              }))}
              value={
                selectedEmployee ? { label: "", value: selectedEmployee } : null
              }
              onChange={(opt) =>
                setSelectedEmployee(opt?.value ? String(opt.value) : null)
              }
              placeholder="Select Employee..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Shift Type
            </label>
            <InputDropdown
              options={mockShifts.map((s) => ({
                label: `${s.name} (${s.startTime}-${s.endTime})`,
                value: s.id,
              }))}
              value={selectedShift ? { label: "", value: selectedShift } : null}
              onChange={(opt) =>
                setSelectedShift(opt?.value ? String(opt.value) : null)
              }
              placeholder="Select Shift..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveShift}>Save Assignment</Button>
        </div>
      </Modal>
    </div>
  );
}
