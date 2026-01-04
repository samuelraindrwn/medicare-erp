"use client";

import * as React from "react";
import { FileQuestion, CheckCircle, XCircle, Clock } from "lucide-react";
import { ModernDataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface PRItem {
  id: string;
  requester: string;
  department: string;
  itemName: string;
  quantity: number;
  estimatedCost: number;
  date: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Pending" | "Approved" | "Rejected" | "Converted to PO";
}

const MOCK_PR: PRItem[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `PR-${2024000 + i}`,
  requester: ["Dr. House", "Nurse Joy", "Admin Staff", "Lab Tech"][
    Math.floor(Math.random() * 4)
  ],
  department: ["Cardiology", "Emergency", "HR", "Laboratory"][
    Math.floor(Math.random() * 4)
  ],
  itemName: [
    "New MRI Machine",
    "Office Chairs",
    "Blood Test Kits",
    "Surgical Masks",
    "Laptops",
  ][Math.floor(Math.random() * 5)],
  quantity: Math.floor(Math.random() * 50) + 1,
  estimatedCost: Math.floor(Math.random() * 10000) + 100,
  date: new Date(2024, 0, Math.floor(Math.random() * 30) + 1)
    .toISOString()
    .split("T")[0],
  priority: ["Low", "Medium", "High", "Urgent"][
    Math.floor(Math.random() * 4)
  ] as any,
  status: ["Pending", "Approved", "Rejected", "Converted to PO"][
    Math.floor(Math.random() * 4)
  ] as any,
}));

export default function RequisitionPage() {
  const columns: any[] = [
    {
      name: "PR Number",
      selector: (row: PRItem) => row.id,
      sortable: true,
      cell: (row: PRItem) => (
        <span className="font-medium text-blue-600">{row.id}</span>
      ),
    },
    {
      name: "Item Details",
      selector: (row: PRItem) => row.itemName,
      cell: (row: PRItem) => (
        <div>
          <div className="font-semibold text-gray-900">{row.itemName}</div>
          <div className="text-xs text-gray-500">Qty: {row.quantity}</div>
        </div>
      ),
    },
    {
      name: "Department",
      selector: (row: PRItem) => row.department,
      sortable: true,
      cell: (row: PRItem) => (
        <div>
          <div className="text-gray-900">{row.department}</div>
          <div className="text-xs text-gray-500">{row.requester}</div>
        </div>
      ),
    },
    {
      name: "Est. Cost",
      selector: (row: PRItem) => row.estimatedCost,
      sortable: true,
      right: true,
      cell: (row: PRItem) => (
        <span className="font-mono text-gray-900">
          ${row.estimatedCost.toLocaleString()}
        </span>
      ),
    },
    {
      name: "Priority",
      selector: (row: PRItem) => row.priority,
      sortable: true,
      cell: (row: PRItem) => (
        <span
          className={cn(
            "px-2 py-0.5 rounded text-xs font-semibold",
            row.priority === "Urgent"
              ? "bg-red-100 text-red-700"
              : row.priority === "High"
              ? "bg-orange-100 text-orange-700"
              : "bg-gray-100 text-gray-600"
          )}
        >
          {row.priority}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row: PRItem) => row.status,
      sortable: true,
      cell: (row: PRItem) => (
        <span
          className={cn(
            "px-2 py-0.5 rounded text-xs font-semibold border",
            row.status === "Approved"
              ? "bg-green-50 text-green-700 border-green-200"
              : row.status === "Pending"
              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
              : row.status === "Rejected"
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-blue-50 text-blue-700 border-blue-200"
          )}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600/10 text-blue-600 rounded-lg">
              <FileQuestion size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Purchase Requisitions
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Review and approve internal purchase requests.
          </p>
        </div>
        <Button>Create Request</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <ModernDataTable
            columns={columns}
            data={MOCK_PR}
            searchable
            searchField="itemName"
            filters={[
              {
                key: "department",
                label: "Department",
                type: "select",
                options: [
                  { label: "Cardiology", value: "Cardiology" },
                  { label: "Emergency", value: "Emergency" },
                  { label: "Laboratory", value: "Laboratory" },
                ],
              },
            ]}
          />
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Pending Approvals</h3>
            <div className="space-y-3">
              {MOCK_PR.filter((p) => p.status === "Pending")
                .slice(0, 3)
                .map((pr) => (
                  <div
                    key={pr.id}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-gray-900 text-sm">
                        {pr.itemName}
                      </span>
                      <span className="text-xs font-mono text-gray-500">
                        {pr.id}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      {pr.requester} • {pr.department}
                    </p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200">
                        Approve
                      </button>
                      <button className="flex-1 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
