"use client";

import * as React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ModernDataTable } from "@/components/ui/DataTable";
import { TableColumn } from "react-data-table-component";
import { Button } from "@/components/ui/Button";
import { Calendar as CalendarIcon, List, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data for Interviews
const mockInterviews = [
  {
    id: "1",
    title: "Interview: Sarah Connor",
    candidate: "Sarah Connor",
    role: "Senior UX Designer",
    start: new Date().toISOString().split("T")[0] + "T10:00:00",
    end: new Date().toISOString().split("T")[0] + "T11:00:00",
    interviewer: "Alice Johnson",
    status: "Scheduled",
    backgroundColor: "#3b82f6", // Blue
  },
  {
    id: "2",
    title: "Interview: John Wick",
    candidate: "John Wick",
    role: "Security Specialist",
    start: new Date().toISOString().split("T")[0] + "T14:00:00",
    end: new Date().toISOString().split("T")[0] + "T15:00:00",
    interviewer: "Bob Smith",
    status: "Scheduled",
    backgroundColor: "#3b82f6",
  },
  {
    id: "3",
    title: "Sync: Operations",
    candidate: "Ellen Ripley",
    role: "Operations Manager",
    start:
      new Date(Date.now() + 86400000).toISOString().split("T")[0] + "T11:00:00", // Tomorrow
    end:
      new Date(Date.now() + 86400000).toISOString().split("T")[0] + "T12:00:00",
    interviewer: "Alice Johnson",
    status: "Pending",
    backgroundColor: "#eab308", // Yellow
  },
];

export function ScheduleTab() {
  const [viewMode, setViewMode] = React.useState<"calendar" | "list">(
    "calendar"
  );

  // Columns for DataTable
  const columns: TableColumn<(typeof mockInterviews)[0]>[] = [
    {
      name: "Candidate",
      selector: (row) => row.candidate,
      cell: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.candidate}</p>
          <p className="text-xs text-gray-500">{row.role}</p>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Date & Time",
      selector: (row) => row.start,
      cell: (row) => {
        const date = new Date(row.start);
        return (
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={14} />
            <span className="text-sm">
              {date.toLocaleDateString()}{" "}
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        );
      },
      sortable: true,
    },
    {
      name: "Interviewer",
      selector: (row) => row.interviewer,
      cell: (row) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Users size={14} />
          <span>{row.interviewer}</span>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <span
          className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-medium",
            row.status === "Scheduled"
              ? "bg-blue-50 text-blue-700"
              : "bg-yellow-50 text-yellow-700"
          )}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <Button
          size="sm"
          variant="ghost"
          className="text-gray-400 hover:text-blue-600"
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Interviews & Schedule
          </h3>
          <p className="text-sm text-gray-500">
            Manage upcoming interviews and meetings.
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode("calendar")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
              viewMode === "calendar"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <CalendarIcon size={16} />
            Calendar
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
              viewMode === "list"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <List size={16} />
            List
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        {viewMode === "calendar" ? (
          <div className="css-fullcalendar-override">
            {/* Full Calendar */}
            <style jsx global>{`
              .fc-toolbar-title {
                font-size: 1.25rem !important;
                font-weight: 700;
              }
              .fc-button-primary {
                background-color: #3b82f6 !important;
                border-color: #3b82f6 !important;
              }
              .fc-button-active {
                background-color: #2563eb !important;
                border-color: #2563eb !important;
              }
              .fc-event {
                border-radius: 4px;
                padding: 2px;
                font-size: 0.85rem;
                border: none;
              }
            `}</style>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={mockInterviews}
              height="auto"
              contentHeight={600}
            />
          </div>
        ) : (
          <div className="mt-4">
            <ModernDataTable
              columns={columns}
              data={mockInterviews}
              searchable
              searchField="candidate"
              pagination
            />
          </div>
        )}
      </div>
    </div>
  );
}
