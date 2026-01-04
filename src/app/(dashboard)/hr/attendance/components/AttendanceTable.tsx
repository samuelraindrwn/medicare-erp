"use client";

import * as React from "react";
import { ModernDataTable } from "@/components/ui/DataTable";
import { AttendanceRecord, mockAttendance } from "@/lib/mock-data";
import { BadgeCheck, Clock, AlertCircle } from "lucide-react";

export function AttendanceTable() {
  const [data, setData] = React.useState<AttendanceRecord[]>(mockAttendance);

  const columns = [
    {
      name: "Employee",
      selector: (row: AttendanceRecord) => row.employeeName,
      sortable: true,
      cell: (row: AttendanceRecord) => (
        <div className="font-medium text-gray-900">{row.employeeName}</div>
      ),
    },
    {
      name: "Date",
      selector: (row: AttendanceRecord) => row.date,
      sortable: true,
      width: "120px",
    },
    {
      name: "Check In",
      selector: (row: AttendanceRecord) => row.checkIn,
      cell: (row: AttendanceRecord) => (
        <span className="font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded">
          {row.checkIn}
        </span>
      ),
    },
    {
      name: "Check Out",
      selector: (row: AttendanceRecord) => row.checkOut || "-",
      cell: (row: AttendanceRecord) => (
        <span
          className={`font-mono px-2 py-1 rounded ${
            row.checkOut ? "text-gray-700 bg-gray-50" : "text-gray-400 italic"
          }`}
        >
          {row.checkOut || "--:--"}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row: AttendanceRecord) => row.status,
      sortable: true,
      cell: (row: AttendanceRecord) => {
        let color = "bg-gray-100 text-gray-800";
        let icon = null;

        if (row.status === "Present") {
          color = "bg-green-100 text-green-800";
          icon = <BadgeCheck size={14} className="mr-1" />;
        } else if (row.status === "Late") {
          color = "bg-orange-100 text-orange-800";
          icon = <Clock size={14} className="mr-1" />;
        } else if (row.status === "Absent") {
          color = "bg-red-100 text-red-800";
          icon = <AlertCircle size={14} className="mr-1" />;
        }

        return (
          <span
            className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
          >
            {icon}
            {row.status}
          </span>
        );
      },
      width: "150px",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Daily Attendance Logs
        </h3>
        <div className="text-sm text-gray-500">
          Showing {data.length} records
        </div>
      </div>
      <ModernDataTable
        columns={columns}
        data={data}
        searchable
        searchField="employeeName"
        searchPlaceholder="Search employee..."
        filters={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Present", value: "Present" },
              { label: "Late", value: "Late" },
              { label: "Absent", value: "Absent" },
            ],
          },
        ]}
      />
    </div>
  );
}
