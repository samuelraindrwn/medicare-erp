"use client";

import * as React from "react";
import { PieChart, Plus, Calculator, Settings } from "lucide-react";
import { ModernDataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// --- Types ---
interface Asset {
  id: string;
  name: string;
  category: string;
  purchaseDate: string;
  cost: number;
  residualValue: number;
  method: "Straight Line" | "Double Declining";
  lifeYears: number;
  status: "Active" | "Disposed" | "Depreciated";
}

// --- Mock Data ---
const MOCK_ASSETS: Asset[] = [
  {
    id: "AST-001",
    name: "MRI Scanner Model X",
    category: "Medical Equipment",
    purchaseDate: "2022-03-15",
    cost: 450000.0,
    residualValue: 50000.0,
    method: "Straight Line",
    lifeYears: 10,
    status: "Active",
  },
  {
    id: "AST-002",
    name: "Office Furniture Set A",
    category: "Furniture",
    purchaseDate: "2023-01-10",
    cost: 12000.0,
    residualValue: 2000.0,
    method: "Straight Line",
    lifeYears: 5,
    status: "Active",
  },
  {
    id: "AST-003",
    name: "Ambulance Vehicle 1",
    category: "Vehicles",
    purchaseDate: "2021-06-20",
    cost: 85000.0,
    residualValue: 15000.0,
    method: "Double Declining",
    lifeYears: 8,
    status: "Active",
  },
  {
    id: "AST-004",
    name: "Ultrasound Machine",
    category: "Medical Equipment",
    purchaseDate: "2023-11-05",
    cost: 65000.0,
    residualValue: 8000.0,
    method: "Straight Line",
    lifeYears: 7,
    status: "Active",
  },
  {
    id: "AST-005",
    name: "Dell Server Rack",
    category: "IT Equipment",
    purchaseDate: "2022-08-01",
    cost: 25000.0,
    residualValue: 1000.0,
    method: "Straight Line",
    lifeYears: 3,
    status: "Active",
  },
];

export default function AssetsPage() {
  const columns: any[] = [
    {
      name: "Asset Name",
      selector: (row: Asset) => row.name,
      sortable: true,
      cell: (row: Asset) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">{row.id}</div>
        </div>
      ),
    },
    {
      name: "Category",
      selector: (row: Asset) => row.category,
      sortable: true,
    },
    {
      name: "Purchase Date",
      selector: (row: Asset) => row.purchaseDate,
      sortable: true,
    },
    {
      name: "Original Cost",
      selector: (row: Asset) => row.cost,
      sortable: true,
      right: true,
      cell: (row: Asset) => (
        <span className="font-mono text-gray-900">
          ${row.cost.toLocaleString()}
        </span>
      ),
    },
    {
      name: "Depreciation",
      selector: (row: Asset) => row.method,
      cell: (row: Asset) => (
        <div className="text-xs">
          <div className="font-medium text-gray-700">{row.method}</div>
          <span className="text-gray-500">{row.lifeYears} years life</span>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row: Asset) => row.status,
      sortable: true,
      cell: (row: Asset) => (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
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
              <PieChart size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Assets & Depreciation
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Track fixed assets and automate depreciation schedules.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calculator size={16} className="mr-2" /> Run Depreciation
          </Button>
          <Button>
            <Plus size={18} className="mr-2" /> New Asset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <ModernDataTable
            columns={columns}
            data={MOCK_ASSETS}
            searchable
            searchField="name"
            searchPlaceholder="Search assets..."
            filters={[
              {
                key: "category",
                label: "Category",
                type: "select",
                options: [
                  { label: "Medical Equipment", value: "Medical Equipment" },
                  { label: "Furniture", value: "Furniture" },
                  { label: "Vehicles", value: "Vehicles" },
                  { label: "IT Equipment", value: "IT Equipment" },
                ],
              },
            ]}
          />
        </div>

        {/* Simple Stats Side */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">
              Total Asset Value
            </h3>
            <p className="text-2xl font-bold text-gray-900">$637,000</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded w-fit">
              <Plus size={12} /> 5.2% from last year
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">
              Depreciation This Month
            </h3>
            <p className="text-2xl font-bold text-gray-900">$4,520</p>
          </div>

          <div className="bg-blue-600 p-4 rounded-xl shadow-lg shadow-blue-900/20 text-white">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Settings size={16} /> Auto-Depreciation
            </h3>
            <p className="text-sm text-blue-100 mb-3">
              Next schedule run is set for <strong>Feb 1, 2024</strong>.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="w-full text-blue-600"
            >
              Configure
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
