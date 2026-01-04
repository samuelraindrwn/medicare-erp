"use client";

import * as React from "react";
import { Monitor, MapPin, User, CheckCircle2 } from "lucide-react";
import { ModernDataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface OfficeAsset {
  id: string;
  name: string;
  category: "IT" | "Furniture" | "Stationery";
  location: string;
  assignedTo?: string;
  condition: "New" | "Good" | "Fair" | "Poor";
  status: "In Use" | "In Storage" | "Maintenance";
}

const MOCK_OFFICE: OfficeAsset[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `OFF-${3000 + i}`,
  name: [
    "Dell Latitude 5420",
    "Ergonomic Chair",
    "Meeting Table",
    "Whiteboard",
    "Monitor 24 inch",
    "Printer HP LaserJet",
  ][Math.floor(Math.random() * 6)],
  category: ["IT", "Furniture", "Stationery"][
    Math.floor(Math.random() * 3)
  ] as any,
  location: [
    "Floor 1 - Reception",
    "Floor 2 - HR",
    "Floor 3 - IT",
    "Warehouse",
  ][Math.floor(Math.random() * 4)],
  assignedTo: Math.random() > 0.3 ? "Employee Name" : undefined,
  condition: ["New", "Good", "Fair"][Math.floor(Math.random() * 3)] as any,
  status: ["In Use", "In Storage", "Maintenance"][
    Math.floor(Math.random() * 3)
  ] as any,
}));

export default function OfficeAssetsPage() {
  const columns: any[] = [
    {
      name: "Asset Name",
      selector: (row: OfficeAsset) => row.name,
      sortable: true,
      cell: (row: OfficeAsset) => (
        <div>
          <div className="font-semibold text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">{row.id}</div>
        </div>
      ),
    },
    {
      name: "Category",
      selector: (row: OfficeAsset) => row.category,
      sortable: true,
      cell: (row: OfficeAsset) => (
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
          {row.category}
        </span>
      ),
    },
    {
      name: "Location",
      selector: (row: OfficeAsset) => row.location,
      sortable: true,
      cell: (row: OfficeAsset) => (
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-gray-400" />
          <span className="text-gray-700">{row.location}</span>
        </div>
      ),
    },
    {
      name: "Assigned To",
      selector: (row: OfficeAsset) => row.assignedTo,
      cell: (row: OfficeAsset) =>
        row.assignedTo ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
              {row.assignedTo.charAt(0)}
            </div>
            <span className="text-gray-700">{row.assignedTo}</span>
          </div>
        ) : (
          <span className="text-gray-400 italic">Unassigned</span>
        ),
    },
    {
      name: "Condition",
      selector: (row: OfficeAsset) => row.condition,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: OfficeAsset) => row.status,
      sortable: true,
      cell: (row: OfficeAsset) => (
        <span
          className={cn(
            "px-2 py-0.5 rounded text-xs font-semibold border",
            row.status === "In Use"
              ? "bg-green-50 text-green-700 border-green-200"
              : row.status === "Maintenance"
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-gray-50 text-gray-600 border-gray-200"
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
              <Monitor size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Office Inventory
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Track physical assets, locations, and assignments.
          </p>
        </div>
        <Button>Register Asset</Button>
      </div>

      <ModernDataTable
        columns={columns}
        data={MOCK_OFFICE}
        searchable
        searchField="name"
        filters={[
          {
            key: "category",
            label: "Category",
            type: "select",
            options: [
              { label: "IT", value: "IT" },
              { label: "Furniture", value: "Furniture" },
              { label: "Stationery", value: "Stationery" },
            ],
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "In Use", value: "In Use" },
              { label: "In Storage", value: "In Storage" },
              { label: "Maintenance", value: "Maintenance" },
            ],
          },
        ]}
      />
    </div>
  );
}
