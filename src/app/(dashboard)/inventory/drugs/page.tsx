"use client";

import * as React from "react";
import { Pill, AlertTriangle, Plus, Filter, PackageCheck } from "lucide-react";
import { ModernDataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// --- Types ---
interface Drug {
  id: string;
  name: string;
  genericName: string;
  category: "Antibiotics" | "Analgesics" | "Cardiovascular" | "Supplements";
  batchNumber: string;
  expiryDate: string;
  stockLevel: number;
  unit: string;
  price: number;
  status: "In Stock" | "Low Stock" | "Out of Stock" | "Expired";
}

// --- Mock Data ---
const MOCK_DRUGS: Drug[] = Array.from({ length: 40 }).map((_, i) => {
  const stockLevel = Math.floor(Math.random() * 200);
  let status: Drug["status"] = "In Stock";
  if (stockLevel === 0) status = "Out of Stock";
  else if (stockLevel < 20) status = "Low Stock";

  // Simulate some expired items
  const isExpired = Math.random() > 0.95;
  const year = isExpired ? 2023 : 2025 + Math.floor(Math.random() * 3);
  const expiryDate = `${year}-${String(
    Math.floor(Math.random() * 12) + 1
  ).padStart(2, "0")}-01`;
  if (isExpired) status = "Expired";

  return {
    id: `DRUG-${1000 + i}`,
    name: [
      "Amoxicillin 500mg",
      "Paracetamol 500mg",
      "Ibuprofen 400mg",
      "Atorvastatin 20mg",
      "Vitamin C 1000mg",
      "Omeprazole 20mg",
      "Metformin 500mg",
      "Amlodipine 5mg",
    ][Math.floor(Math.random() * 8)],
    genericName: "Generic Name Here",
    category: ["Antibiotics", "Analgesics", "Cardiovascular", "Supplements"][
      Math.floor(Math.random() * 4)
    ] as any,
    batchNumber: `BN-${Math.floor(Math.random() * 100000)}`,
    expiryDate,
    stockLevel,
    unit: ["Box", "Strip", "Bottle", "Vial"][Math.floor(Math.random() * 4)],
    price: parseFloat((Math.random() * 50 + 1).toFixed(2)),
    status,
  };
});

export default function DrugsPage() {
  const columns: any[] = [
    {
      name: "Drug Name",
      selector: (row: Drug) => row.name,
      sortable: true,
      cell: (row: Drug) => (
        <div>
          <div className="font-semibold text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">{row.genericName}</div>
        </div>
      ),
      width: "200px",
    },
    {
      name: "Category",
      selector: (row: Drug) => row.category,
      sortable: true,
    },
    {
      name: "Batch / Expiry",
      selector: (row: Drug) => row.expiryDate,
      sortable: true,
      cell: (row: Drug) => (
        <div>
          <div className="text-gray-900">{row.batchNumber}</div>
          <div
            className={cn(
              "text-xs font-medium",
              row.status === "Expired" ? "text-red-500" : "text-gray-500"
            )}
          >
            Exp: {row.expiryDate}
          </div>
        </div>
      ),
    },
    {
      name: "Stock",
      selector: (row: Drug) => row.stockLevel,
      sortable: true,
      cell: (row: Drug) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-gray-900">{row.stockLevel}</span>
          <span className="text-xs text-gray-400">{row.unit}</span>
        </div>
      ),
    },
    {
      name: "Unit Price",
      selector: (row: Drug) => row.price,
      sortable: true,
      right: true,
      cell: (row: Drug) => (
        <span className="font-medium text-gray-900">
          ${row.price.toFixed(2)}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row: Drug) => row.status,
      sortable: true,
      cell: (row: Drug) => (
        <span
          className={cn(
            "px-2 py-0.5 rounded text-xs font-semibold border",
            row.status === "In Stock"
              ? "bg-green-50 text-green-700 border-green-200"
              : row.status === "Low Stock"
              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
              : "bg-red-50 text-red-700 border-red-200"
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
              <Pill size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Drugs Management
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Manage pharmaceutical inventory, track batches and expiry dates.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <PackageCheck size={16} className="mr-2" /> Stock Opname
          </Button>
          <Button>
            <Plus size={18} className="mr-2" /> Add Item
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Items</p>
          <p className="text-2xl font-bold text-gray-900">1,240</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Expired Items</p>
              <p className="text-2xl font-bold text-red-600">12</p>
            </div>
            <AlertTriangle size={20} className="text-red-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">45</p>
            </div>
            <AlertTriangle size={20} className="text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Value</p>
          <p className="text-2xl font-bold text-gray-900">$84,500</p>
        </div>
      </div>

      <ModernDataTable
        columns={columns}
        data={MOCK_DRUGS}
        searchable
        searchField="name"
        searchPlaceholder="Search drugs..."
        filters={[
          {
            key: "category",
            label: "Category",
            type: "select",
            options: [
              { label: "Antibiotics", value: "Antibiotics" },
              { label: "Analgesics", value: "Analgesics" },
              { label: "Cardiovascular", value: "Cardiovascular" },
              { label: "Supplements", value: "Supplements" },
            ],
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "In Stock", value: "In Stock" },
              { label: "Low Stock", value: "Low Stock" },
              { label: "Out of Stock", value: "Out of Stock" },
              { label: "Expired", value: "Expired" },
            ],
          },
        ]}
      />
    </div>
  );
}
