"use client";

import * as React from "react";
import { FileCheck, ExternalLink, Mail } from "lucide-react";
import { ModernDataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface POItem {
  id: string;
  vendor: string;
  date: string;
  deliveryDate: string;
  totalAmount: number;
  itemsCount: number;
  status: "Draft" | "Sent" | "Partial Delivery" | "Completed" | "Cancelled";
}

const MOCK_PO: POItem[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `PO-2024-${100 + i}`,
  vendor: [
    "MediCorp Supplies",
    "PharmaGiant Inc",
    "BioTech Solutions",
    "Office Depot",
  ][Math.floor(Math.random() * 4)],
  date: new Date(2024, 0, Math.floor(Math.random() * 20) + 1)
    .toISOString()
    .split("T")[0],
  deliveryDate: new Date(2024, 1, Math.floor(Math.random() * 28) + 1)
    .toISOString()
    .split("T")[0],
  totalAmount: Math.floor(Math.random() * 50000) + 1000,
  itemsCount: Math.floor(Math.random() * 10) + 1,
  status: ["Draft", "Sent", "Partial Delivery", "Completed", "Cancelled"][
    Math.floor(Math.random() * 5)
  ] as any,
}));

export default function PurchaseOrderPage() {
  const columns: any[] = [
    {
      name: "PO Number",
      selector: (row: POItem) => row.id,
      sortable: true,
      cell: (row: POItem) => (
        <span className="font-medium text-blue-600">{row.id}</span>
      ),
    },
    {
      name: "Vendor",
      selector: (row: POItem) => row.vendor,
      sortable: true,
      cell: (row: POItem) => (
        <span className="font-semibold text-gray-900">{row.vendor}</span>
      ),
    },
    {
      name: "Total Amount",
      selector: (row: POItem) => row.totalAmount,
      sortable: true,
      right: true,
      cell: (row: POItem) => (
        <span className="font-mono text-gray-900">
          ${row.totalAmount.toLocaleString()}
        </span>
      ),
    },
    {
      name: "Dates",
      cell: (row: POItem) => (
        <div className="text-xs text-gray-600">
          <div>Ordered: {row.date}</div>
          <div className="text-blue-600">Eta: {row.deliveryDate}</div>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row: POItem) => row.status,
      sortable: true,
      cell: (row: POItem) => (
        <span
          className={cn(
            "px-2 py-0.5 rounded text-xs font-semibold border",
            row.status === "Completed"
              ? "bg-green-50 text-green-700 border-green-200"
              : row.status === "Sent"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : row.status === "Draft"
              ? "bg-gray-100 text-gray-600 border-gray-200"
              : "bg-yellow-50 text-yellow-700 border-yellow-200"
          )}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row: POItem) => (
        <div className="flex gap-2">
          <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600">
            <ExternalLink size={16} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600">
            <Mail size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600/10 text-blue-600 rounded-lg">
              <FileCheck size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Purchase Orders
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Create and track official purchase orders to vendors.
          </p>
        </div>
        <Button>New PO</Button>
      </div>

      <ModernDataTable
        columns={columns}
        data={MOCK_PO}
        searchable
        searchField="vendor"
        filters={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Sent", value: "Sent" },
              { label: "Completed", value: "Completed" },
              { label: "Draft", value: "Draft" },
            ],
          },
        ]}
      />
    </div>
  );
}
