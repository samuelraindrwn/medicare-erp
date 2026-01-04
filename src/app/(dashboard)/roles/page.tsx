"use client";

import * as React from "react";
import { Shield, Lock, Users, Edit3 } from "lucide-react";
import { ModernDataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissions: number; // Count of permissions
  type: "System" | "Custom";
}

const MOCK_ROLES: Role[] = [
  {
    id: "ROLE-001",
    name: "Super Admin",
    description: "Full access to all modules and system settings.",
    usersCount: 2,
    permissions: 145,
    type: "System",
  },
  {
    id: "ROLE-002",
    name: "Doctor",
    description: "Access to patient records, appointments, and prescriptions.",
    usersCount: 45,
    permissions: 24,
    type: "System",
  },
  {
    id: "ROLE-003",
    name: "Nurse",
    description: "Access to patient vitals, ward management, and UDD.",
    usersCount: 120,
    permissions: 18,
    type: "System",
  },
  {
    id: "ROLE-004",
    name: "Pharmacist",
    description: "Access to inventory, dispensing, and procurement.",
    usersCount: 8,
    permissions: 32,
    type: "System",
  },
  {
    id: "ROLE-005",
    name: "HR Manager",
    description: "Access to payroll, employee records, and recruitment.",
    usersCount: 3,
    permissions: 40,
    type: "Custom",
  },
  {
    id: "ROLE-006",
    name: "Finance Officer",
    description: "Access to billing, general ledger, and reporting.",
    usersCount: 5,
    permissions: 35,
    type: "Custom",
  },
];

export default function RolesPage() {
  const columns: any[] = [
    {
      name: "Role Name",
      selector: (row: Role) => row.name,
      sortable: true,
      cell: (row: Role) => (
        <div>
          <div className="font-semibold text-gray-900">{row.name}</div>
        </div>
      ),
    },
    {
      name: "Description",
      selector: (row: Role) => row.description,
      cell: (row: Role) => (
        <span className="text-gray-600 text-sm truncate max-w-xs">
          {row.description}
        </span>
      ),
    },
    {
      name: "Users",
      selector: (row: Role) => row.usersCount,
      sortable: true,
      cell: (row: Role) => (
        <div className="flex items-center gap-2">
          <Users size={14} className="text-gray-400" />
          <span className="text-gray-700 font-medium">{row.usersCount}</span>
        </div>
      ),
    },
    {
      name: "Permissions",
      selector: (row: Role) => row.permissions,
      sortable: true,
      cell: (row: Role) => (
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
          {row.permissions} Access Points
        </span>
      ),
    },
    {
      name: "Type",
      selector: (row: Role) => row.type,
      sortable: true,
      cell: (row: Role) => (
        <span
          className={cn(
            "px-2 py-0.5 rounded text-xs font-semibold border",
            row.type === "System"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-purple-50 text-purple-700 border-purple-200"
          )}
        >
          {row.type}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row: Role) => (
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
          <Edit3 size={14} /> Edit
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600/10 text-blue-600 rounded-lg">
              <Shield size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Roles & Permissions
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Define roles and configure access permissions for different user
            groups.
          </p>
        </div>
        <Button>Create Role</Button>
      </div>

      <ModernDataTable columns={columns} data={MOCK_ROLES} searchable={false} />
    </div>
  );
}
