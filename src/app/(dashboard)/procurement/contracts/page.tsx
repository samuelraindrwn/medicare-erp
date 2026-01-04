"use client";

import * as React from "react";
import { FileSignature, Calendar, AlertCircle } from "lucide-react";
import { ModernDataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Contract {
  id: string;
  title: string;
  vendor: string;
  startDate: string;
  endDate: string;
  value: number;
  status: "Active" | "Expiring Soon" | "Expired" | "Terminated";
}

const MOCK_CONTRACTS: Contract[] = Array.from({ length: 20 }).map((_, i) => {
  const endDate = new Date(2024, Math.floor(Math.random() * 12), 1);
  const today = new Date();
  let status: Contract["status"] = "Active";

  if (endDate < today) status = "Expired";
  else if (endDate.getTime() - today.getTime() < 30 * 24 * 60 * 60 * 1000)
    status = "Expiring Soon";

  return {
    id: `CTR-${202400 + i}`,
    title: [
      "Medical Supply Agreement",
      "Equipment Maintenance",
      "Cleaning Services",
      "Software License",
    ][Math.floor(Math.random() * 4)],
    vendor: [
      "MediCorp Supplies",
      "PharmaGiant Inc",
      "BioTech Solutions",
      "Office Depot",
    ][Math.floor(Math.random() * 4)],
    startDate: "2023-01-01",
    endDate: endDate.toISOString().split("T")[0],
    value: Math.floor(Math.random() * 100000) + 10000,
    status,
  };
});

export default function ContractsPage() {
  const columns: any[] = [
    {
      name: "Contract Title",
      selector: (row: Contract) => row.title,
      sortable: true,
      cell: (row: Contract) => (
        <div>
          <div className="font-semibold text-gray-900">{row.title}</div>
          <div className="text-xs text-gray-500">{row.id}</div>
        </div>
      ),
    },
    {
      name: "Vendor",
      selector: (row: Contract) => row.vendor,
      sortable: true,
    },
    {
      name: "Duration",
      cell: (row: Contract) => (
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span className="text-gray-400">Start:</span> {row.startDate}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">End:</span>{" "}
            <span
              className={cn(
                row.status === "Expiring Soon"
                  ? "text-orange-600 font-bold"
                  : ""
              )}
            >
              {row.endDate}
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "Value",
      selector: (row: Contract) => row.value,
      sortable: true,
      right: true,
      cell: (row: Contract) => (
        <span className="font-mono text-gray-900">
          ${row.value.toLocaleString()}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row: Contract) => row.status,
      sortable: true,
      cell: (row: Contract) => (
        <span
          className={cn(
            "px-2 py-0.5 rounded text-xs font-semibold border",
            row.status === "Active"
              ? "bg-green-50 text-green-700 border-green-200"
              : row.status === "Expiring Soon"
              ? "bg-orange-50 text-orange-700 border-orange-200"
              : row.status === "Expired"
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-gray-100 text-gray-600 border-gray-200"
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
              <FileSignature size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Contract Management
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Track vendor contracts, renewals, and legal documents.
          </p>
        </div>
        <Button>Upload Contract</Button>
      </div>

      <ModernDataTable
        columns={columns}
        data={MOCK_CONTRACTS}
        searchable
        searchField="title"
        filters={[
          {
            key: "vendor",
            label: "Vendor",
            type: "select",
            options: [
              { label: "MediCorp Supplies", value: "MediCorp Supplies" },
              { label: "PharmaGiant Inc", value: "PharmaGiant Inc" },
            ],
          },
        ]}
      />
    </div>
  );
}
