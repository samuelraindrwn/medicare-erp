"use client";

import * as React from "react";
import { Microscope, User, CheckCircle, Clock } from "lucide-react";
import { ModernDataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface UDDItem {
  id: string;
  patientName: string;
  mrn: string; // Medical Record Number
  ward: string;
  drugName: string;
  dose: string;
  frequency: string;
  nextDose: string;
  status: "Scheduled" | "Prepared" | "Administered" | "Skipped";
}

const MOCK_UDD: UDDItem[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `UDD-${5000 + i}`,
  patientName: [
    "Alice Johnson",
    "Bob Brown",
    "Charlie Davis",
    "Diana Evans",
    "Evan Wright",
  ][Math.floor(Math.random() * 5)],
  mrn: `MRN-${1000 + i}`,
  ward: ["ICU", "General Ward A", "General Ward B", "VIP Suite"][
    Math.floor(Math.random() * 4)
  ],
  drugName: ["Amoxicillin", "Paracetamol", "Insulin", "Metformin"][
    Math.floor(Math.random() * 4)
  ],
  dose: ["500mg", "1000mg", "10 units", "850mg"][Math.floor(Math.random() * 4)],
  frequency: ["BID", "TID", "OD", "PRN"][Math.floor(Math.random() * 4)],
  nextDose: `${Math.floor(Math.random() * 12 + 8)}:00`,
  status: ["Scheduled", "Prepared", "Administered", "Skipped"][
    Math.floor(Math.random() * 4)
  ] as any,
}));

export default function UDDPage() {
  const columns: any[] = [
    {
      name: "Patient",
      selector: (row: UDDItem) => row.patientName,
      sortable: true,
      cell: (row: UDDItem) => (
        <div>
          <div className="font-semibold text-gray-900">{row.patientName}</div>
          <div className="text-xs text-gray-500">{row.mrn}</div>
        </div>
      ),
    },
    {
      name: "Location",
      selector: (row: UDDItem) => row.ward,
      sortable: true,
    },
    {
      name: "Medication",
      selector: (row: UDDItem) => row.drugName,
      cell: (row: UDDItem) => (
        <div>
          <div className="font-medium text-gray-900">{row.drugName}</div>
          <div className="text-xs text-gray-500">
            {row.dose} • {row.frequency}
          </div>
        </div>
      ),
    },
    {
      name: "Next Dose",
      selector: (row: UDDItem) => row.nextDose,
      sortable: true,
      cell: (row: UDDItem) => (
        <div className="flex items-center gap-2 text-gray-700 font-mono">
          <Clock size={14} className="text-gray-400" />
          {row.nextDose}
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row: UDDItem) => row.status,
      sortable: true,
      cell: (row: UDDItem) => (
        <span
          className={cn(
            "px-2 py-0.5 rounded text-xs font-semibold border",
            row.status === "Administered"
              ? "bg-green-50 text-green-700 border-green-200"
              : row.status === "Scheduled"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : row.status === "Prepared"
              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
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
              <Microscope size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Unit-Dose Dispensing (UDD)
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Manage individual patient medication doses for inpatient care.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Print Labels</Button>
          <Button>Prepare Batch</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ModernDataTable
            columns={columns}
            data={MOCK_UDD}
            searchable
            searchField="patientName"
            filters={[
              {
                key: "ward",
                label: "Ward",
                type: "select",
                options: [
                  { label: "ICU", value: "ICU" },
                  { label: "General Ward A", value: "General Ward A" },
                  { label: "VIP Suite", value: "VIP Suite" },
                ],
              },
            ]}
          />
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Ward Status</h3>
            <div className="space-y-3">
              {["ICU", "General Ward A", "General Ward B"].map((ward) => (
                <div
                  key={ward}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-700">{ward}</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    Running
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-900/20">
            <h3 className="font-bold mb-2">Next Round</h3>
            <p className="text-4xl font-bold mb-1">14:00</p>
            <p className="text-blue-100 text-sm">
              Medication round starts in 45 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
