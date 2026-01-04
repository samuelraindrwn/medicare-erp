"use client";

import * as React from "react";
import { ShieldAlert, ShieldCheck, Lock, Globe } from "lucide-react";
import { ModernDataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface SecurityLog {
  id: string;
  event: string;
  severity: "High" | "Medium" | "Low";
  user: string;
  timestamp: string;
  ipAddress: string;
  status: "Success" | "Failed";
}

const MOCK_SECURITY: SecurityLog[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `SEC-${Date.now() - i * 1000}`,
  event: [
    "Login Attempt",
    "Password Change",
    "Role Modification",
    "API Access Key",
    "Failed Login",
  ][Math.floor(Math.random() * 5)],
  severity: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)] as any,
  user: `user${Math.floor(Math.random() * 10)}@medicare.com`,
  timestamp: new Date(Date.now() - i * 1800000)
    .toISOString()
    .replace("T", " ")
    .substring(0, 19),
  ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
  status: Math.random() > 0.8 ? "Failed" : ("Success" as any),
}));

export default function SecurityLogsPage() {
  const columns: any[] = [
    {
      name: "Severity",
      selector: (row: SecurityLog) => row.severity,
      sortable: true,
      cell: (row: SecurityLog) => (
        <div className="flex items-center gap-2">
          {row.severity === "High" ? (
            <ShieldAlert size={16} className="text-red-500" />
          ) : row.severity === "Medium" ? (
            <ShieldCheck size={16} className="text-yellow-500" />
          ) : (
            <ShieldCheck size={16} className="text-blue-500" />
          )}
          <span
            className={cn(
              "font-semibold text-xs",
              row.severity === "High"
                ? "text-red-700"
                : row.severity === "Medium"
                ? "text-yellow-700"
                : "text-blue-700"
            )}
          >
            {row.severity}
          </span>
        </div>
      ),
      width: "120px",
    },
    {
      name: "Event",
      selector: (row: SecurityLog) => row.event,
      sortable: true,
      cell: (row: SecurityLog) => (
        <span className="font-medium text-gray-900">{row.event}</span>
      ),
    },
    {
      name: "User / Subject",
      selector: (row: SecurityLog) => row.user,
      sortable: true,
      cell: (row: SecurityLog) => (
        <span className="text-gray-600">{row.user}</span>
      ),
    },
    {
      name: "Status",
      selector: (row: SecurityLog) => row.status,
      sortable: true,
      cell: (row: SecurityLog) => (
        <span
          className={cn(
            "px-2 py-0.5 rounded text-xs font-semibold border",
            row.status === "Success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          )}
        >
          {row.status}
        </span>
      ),
      width: "100px",
    },
    {
      name: "Source",
      cell: (row: SecurityLog) => (
        <div className="flex flex-col text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Globe size={10} /> {row.ipAddress}
          </span>
          <span>{row.timestamp}</span>
        </div>
      ),
      right: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600/10 text-blue-600 rounded-lg">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Security Logs</h1>
          </div>
          <p className="text-sm text-gray-500">
            Monitor system security events, breaches, and authentication logs.
          </p>
        </div>
      </div>

      <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-4">
        <ShieldAlert className="text-red-500 shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-red-800">Security Alert</h3>
          <p className="text-sm text-red-700 mt-1">
            3 failed login attempts detected from IP 192.168.1.45 in the last
            hour. Recommended to block IP or force password reset for associated
            accounts.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800 bg-transparent"
        >
          Investigate
        </Button>
      </div>

      <ModernDataTable
        columns={columns}
        data={MOCK_SECURITY}
        searchable
        searchField="event"
        filters={[
          {
            key: "severity",
            label: "Severity",
            type: "select",
            options: [
              { label: "High", value: "High" },
              { label: "Medium", value: "Medium" },
              { label: "Low", value: "Low" },
            ],
          },
        ]}
      />
    </div>
  );
}
