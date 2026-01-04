"use client";

import * as React from "react";
import { FileSearch, User, Clock, Monitor } from "lucide-react";
import { ModernDataTable } from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";

interface ActivityLog {
  id: string;
  user: string;
  action: "Create" | "Update" | "Delete" | "Login" | "View";
  module: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

const MOCK_LOGS: ActivityLog[] = Array.from({ length: 40 }).map((_, i) => ({
  id: `LOG-${Date.now() - i * 1000}`,
  user: ["Dr. House", "Admin Alice", "Nurse Jackie", "Tech Bob"][
    Math.floor(Math.random() * 4)
  ],
  action: ["Create", "Update", "Delete", "Login", "View"][
    Math.floor(Math.random() * 5)
  ] as any,
  module: ["Patient", "Inventory", "Billing", "HR", "System"][
    Math.floor(Math.random() * 5)
  ],
  details: [
    "Updated patient record #12345",
    "Created invoice #INV-9981",
    "Deleted old stock item",
    "Modified employee salary",
    "Viewed confidential report",
  ][Math.floor(Math.random() * 5)],
  timestamp: new Date(Date.now() - i * 3600000)
    .toISOString()
    .replace("T", " ")
    .substring(0, 19),
  ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
}));

export default function ActivityLogsPage() {
  const columns: any[] = [
    {
      name: "Timestamp",
      selector: (row: ActivityLog) => row.timestamp,
      sortable: true,
      cell: (row: ActivityLog) => (
        <div className="flex items-center gap-2 text-gray-600 font-mono text-xs">
          <Clock size={12} />
          {row.timestamp}
        </div>
      ),
      width: "180px",
    },
    {
      name: "User",
      selector: (row: ActivityLog) => row.user,
      sortable: true,
      cell: (row: ActivityLog) => (
        <div className="flex items-center gap-2">
          <User size={14} className="text-gray-400" />
          <span className="font-medium text-gray-900">{row.user}</span>
        </div>
      ),
    },
    {
      name: "Action",
      selector: (row: ActivityLog) => row.action,
      sortable: true,
      cell: (row: ActivityLog) => (
        <span
          className={cn(
            "px-2 py-0.5 rounded text-xs font-semibold border",
            row.action === "Create"
              ? "bg-green-50 text-green-700 border-green-200"
              : row.action === "Delete"
              ? "bg-red-50 text-red-700 border-red-200"
              : row.action === "Update"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-gray-50 text-gray-600 border-gray-200"
          )}
        >
          {row.action}
        </span>
      ),
      width: "100px",
    },
    {
      name: "Module",
      selector: (row: ActivityLog) => row.module,
      sortable: true,
      width: "120px",
    },
    {
      name: "Details",
      selector: (row: ActivityLog) => row.details,
      wrap: true,
    },
    {
      name: "IP Address",
      selector: (row: ActivityLog) => row.ipAddress,
      cell: (row: ActivityLog) => (
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <Monitor size={12} />
          {row.ipAddress}
        </div>
      ),
      width: "140px",
      right: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600/10 text-blue-600 rounded-lg">
              <FileSearch size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          </div>
          <p className="text-sm text-gray-500">
            Comprehensive audit trail of all user activities within the system.
          </p>
        </div>
      </div>

      <ModernDataTable
        columns={columns}
        data={MOCK_LOGS}
        searchable
        searchField="details"
        filters={[
          {
            key: "action",
            label: "Action",
            type: "select",
            options: [
              { label: "Create", value: "Create" },
              { label: "Update", value: "Update" },
              { label: "Delete", value: "Delete" },
            ],
          },
          {
            key: "module",
            label: "Module",
            type: "select",
            options: ["Patient", "Inventory", "Billing", "HR", "System"].map(
              (m) => ({ label: m, value: m })
            ),
          },
        ]}
      />
    </div>
  );
}
