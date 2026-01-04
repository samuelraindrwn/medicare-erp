"use client";

import * as React from "react";
import { Building, Phone, Mail, Star, MapPin } from "lucide-react";
import { ModernDataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Vendor {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  rating: number;
  status: "Active" | "Blacklisted" | "On Hold";
}

const MOCK_VENDORS: Vendor[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `VEN-${100 + i}`,
  name: [
    "MediCorp Supplies",
    "PharmaGiant Inc",
    "BioTech Solutions",
    "Surgical Pro",
    "CleanHealth Services",
  ][Math.floor(Math.random() * 5)],
  category: ["Pharmaceuticals", "Medical Equipment", "Services", "Consumables"][
    Math.floor(Math.random() * 4)
  ],
  contactPerson: ["Sarah Connor", "John Smith", "Mike Ross", "Rachel Zane"][
    Math.floor(Math.random() * 4)
  ],
  email: `contact@vendor${i}.com`,
  phone: "+1 (555) 000-0000",
  location: ["New York, NY", "Chicago, IL", "Austin, TX", "Seattle, WA"][
    Math.floor(Math.random() * 4)
  ],
  rating: Math.floor(Math.random() * 2) + 3 + Math.random(), // 3.0 - 5.0
  status: ["Active", "Active", "Active", "On Hold", "Blacklisted"][
    Math.floor(Math.random() * 5)
  ] as any,
}));

export default function VendorsPage() {
  const columns: any[] = [
    {
      name: "Vendor Name",
      selector: (row: Vendor) => row.name,
      sortable: true,
      cell: (row: Vendor) => (
        <div>
          <div className="font-semibold text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">{row.id}</div>
        </div>
      ),
    },
    {
      name: "Category",
      selector: (row: Vendor) => row.category,
      sortable: true,
      cell: (row: Vendor) => (
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
          {row.category}
        </span>
      ),
    },
    {
      name: "Contact",
      cell: (row: Vendor) => (
        <div className="text-sm text-gray-600 space-y-0.5">
          <div className="flex items-center gap-2">
            <UserIcon size={12} className="text-gray-400" />
            {row.contactPerson}
          </div>
          <div className="flex items-center gap-2">
            <Mail size={12} className="text-gray-400" />
            {row.email}
          </div>
        </div>
      ),
    },
    {
      name: "Rating",
      selector: (row: Vendor) => row.rating,
      sortable: true,
      cell: (row: Vendor) => (
        <div className="flex items-center gap-1 text-yellow-500">
          <Star size={14} fill="currentColor" />
          <span className="text-gray-900 font-medium">
            {row.rating.toFixed(1)}
          </span>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row: Vendor) => row.status,
      sortable: true,
      cell: (row: Vendor) => (
        <span
          className={cn(
            "px-2 py-0.5 rounded text-xs font-semibold border",
            row.status === "Active"
              ? "bg-green-50 text-green-700 border-green-200"
              : row.status === "Blacklisted"
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-yellow-50 text-yellow-700 border-yellow-200"
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
              <Building size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Vendor Management
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Manage suppliers, evaluate performance, and track contracts.
          </p>
        </div>
        <Button>Add Vendor</Button>
      </div>

      <ModernDataTable
        columns={columns}
        data={MOCK_VENDORS}
        searchable
        searchField="name"
        filters={[
          {
            key: "category",
            label: "Category",
            type: "select",
            options: [
              { label: "Pharmaceuticals", value: "Pharmaceuticals" },
              { label: "Medical Equipment", value: "Medical Equipment" },
              { label: "Services", value: "Services" },
            ],
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Active", value: "Active" },
              { label: "On Hold", value: "On Hold" },
              { label: "Blacklisted", value: "Blacklisted" },
            ],
          },
        ]}
      />
    </div>
  );
}

function UserIcon({ size, className }: { size: number; className?: string }) {
  // Simple SVG icon wrapper or import User from lucide-react if not conflicting
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
