"use client";

import * as React from "react";
import {
  UserCog,
  Shield,
  AlertCircle,
  CheckCircle2,
  UserPlus,
} from "lucide-react";
import { ModernDataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "Active" | "Inactive" | "Suspended";
  lastLogin: string;
}

const MOCK_USERS: User[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `USR-${1000 + i}`,
  name: [
    "Dr. Gregory House",
    "Nurse Jackie",
    "Admin Alice",
    "Tech Bob",
    "Manager Sarah",
  ][Math.floor(Math.random() * 5)],
  email: `user${i}@medicare.com`,
  role: ["Doctor", "Nurse", "Administrator", "IT Support", "HR Manager"][
    Math.floor(Math.random() * 5)
  ],
  department: ["Cardiology", "ER", "Administration", "IT", "HR"][
    Math.floor(Math.random() * 5)
  ],
  status: ["Active", "Active", "Active", "Inactive"][
    Math.floor(Math.random() * 4)
  ] as any,
  lastLogin: new Date(
    2024,
    0,
    Math.floor(Math.random() * 30) + 1,
    Math.floor(Math.random() * 24),
    Math.floor(Math.random() * 60)
  )
    .toISOString()
    .replace("T", " ")
    .substring(0, 16),
}));

export default function UsersPage() {
  const columns: any[] = [
    {
      name: "User",
      selector: (row: User) => row.name,
      sortable: true,
      cell: (row: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
            {row.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{row.name}</div>
            <div className="text-xs text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
      width: "250px",
    },
    {
      name: "Role",
      selector: (row: User) => row.role,
      sortable: true,
      cell: (row: User) => (
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-gray-400" />
          <span className="text-gray-700">{row.role}</span>
        </div>
      ),
    },
    {
      name: "Department",
      selector: (row: User) => row.department,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: User) => row.status,
      sortable: true,
      cell: (row: User) => (
        <div className="flex items-center gap-1.5">
          {row.status === "Active" ? (
            <CheckCircle2 size={14} className="text-green-500" />
          ) : (
            <AlertCircle size={14} className="text-gray-400" />
          )}
          <span
            className={cn(
              "text-sm font-medium",
              row.status === "Active" ? "text-green-700" : "text-gray-500"
            )}
          >
            {row.status}
          </span>
        </div>
      ),
    },
    {
      name: "Last Login",
      selector: (row: User) => row.lastLogin,
      sortable: true,
      right: true,
      cell: (row: User) => (
        <span className="text-xs text-gray-500 font-mono">{row.lastLogin}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600/10 text-blue-600 rounded-lg">
              <UserCog size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Management
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Manage system access, assign roles, and monitor user activity.
          </p>
        </div>
        <Button>
          <UserPlus size={18} className="mr-2" /> Invite User
        </Button>
      </div>

      <ModernDataTable
        columns={columns}
        data={MOCK_USERS}
        searchable
        searchField="name"
        filters={[
          {
            key: "role",
            label: "Role",
            type: "select",
            options: [
              { label: "Administrator", value: "Administrator" },
              { label: "Doctor", value: "Doctor" },
              { label: "Nurse", value: "Nurse" },
            ],
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ],
          },
        ]}
      />
    </div>
  );
}
