"use client";

import * as React from "react";
import { Syringe, Truck, Package, RotateCw } from "lucide-react";
import { ModernDataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface BhpItem {
  id: string;
  name: string;
  type: "Disposable" | "Consignment" | "Reusable";
  vendor: string;
  stock: number;
  minStock: number;
  unit: string;
  lastRestock: string;
}

const MOCK_BHP: BhpItem[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `BHP-${2000 + i}`,
  name: [
    "Surgical Gloves (M)",
    "Syringe 5ml",
    "Cotton Roll",
    "Face Mask N95",
    "IV Catheter 20G",
    "Bandage Elastic",
    "Alcohol Swabs",
  ][Math.floor(Math.random() * 7)],
  type: ["Disposable", "Consignment", "Reusable"][
    Math.floor(Math.random() * 3)
  ] as any,
  vendor: ["MediSupply Co", "HealthDirect", "PharmaCare", "Global Meds"][
    Math.floor(Math.random() * 4)
  ],
  stock: Math.floor(Math.random() * 1000),
  minStock: 100,
  unit: ["Box", "Pcs", "Roll", "Pack"][Math.floor(Math.random() * 4)],
  lastRestock: new Date(
    2023,
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28)
  )
    .toISOString()
    .split("T")[0],
}));

export default function BhpPage() {
  const columns: any[] = [
    {
      name: "Item Name",
      selector: (row: BhpItem) => row.name,
      sortable: true,
      cell: (row: BhpItem) => (
        <span className="font-semibold text-gray-900">{row.name}</span>
      ),
    },
    {
      name: "Type",
      selector: (row: BhpItem) => row.type,
      sortable: true,
      cell: (row: BhpItem) => (
        <span
          className={cn(
            "px-2 py-0.5 rounded text-xs font-medium border",
            row.type === "Consignment"
              ? "bg-purple-50 text-purple-700 border-purple-200"
              : "bg-gray-50 text-gray-600 border-gray-200"
          )}
        >
          {row.type}
        </span>
      ),
    },
    {
      name: "Vendor",
      selector: (row: BhpItem) => row.vendor,
      sortable: true,
    },
    {
      name: "Stock",
      selector: (row: BhpItem) => row.stock,
      sortable: true,
      cell: (row: BhpItem) => (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-mono font-medium",
              row.stock < row.minStock ? "text-red-600" : "text-gray-900"
            )}
          >
            {row.stock}
          </span>
          <span className="text-gray-400 text-xs">{row.unit}</span>
        </div>
      ),
    },
    {
      name: "Last Restock",
      selector: (row: BhpItem) => row.lastRestock,
      sortable: true,
      right: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600/10 text-blue-600 rounded-lg">
              <Syringe size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              BHP & Consignment
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Track disposables, consumables, and consignment inventory.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RotateCw size={16} className="mr-2" /> Reorder Low Stock
          </Button>
          <Button>
            <Truck size={18} className="mr-2" /> Receive Goods
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-900/20">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-100 font-medium mb-1">
                Consignment Value
              </p>
              <p className="text-3xl font-bold">$12,450.00</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Package size={24} className="text-white" />
            </div>
          </div>
          <p className="text-xs text-blue-100/80">
            Value of stock held on behalf of vendors.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-gray-500 font-medium mb-2">Restock Suggestion</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">24</span>
            <span className="text-gray-500">items below minimum stock</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-orange-500 h-full w-[35%] rounded-full" />
          </div>
        </div>
      </div>

      <ModernDataTable
        columns={columns}
        data={MOCK_BHP}
        searchable
        searchField="name"
        filters={[
          {
            key: "type",
            label: "Type",
            type: "select",
            options: [
              { label: "Disposable", value: "Disposable" },
              { label: "Consignment", value: "Consignment" },
              { label: "Reusable", value: "Reusable" },
            ],
          },
        ]}
      />
    </div>
  );
}
