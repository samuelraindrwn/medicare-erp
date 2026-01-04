"use client";

import * as React from "react";
import {
  ReceiptText,
  Plus,
  DollarSign,
  Clock,
  AlertCircle,
  FileText,
  Printer,
  MoreVertical,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { ModernDataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { InputText } from "@/components/ui/InputText";
import { InputDropdown } from "@/components/ui/InputDropdown";
import { cn } from "@/lib/utils";
import { CardSkeleton, TableSkeleton } from "@/components/ui/Loader";

// --- Types ---
interface Invoice {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  items: number; // count of items
}

// --- Mock Data ---
const MOCK_INVOICES: Invoice[] = Array.from({ length: 25 }).map((_, i) => {
  const status =
    Math.random() > 0.6 ? "Paid" : Math.random() > 0.3 ? "Pending" : "Overdue";
  return {
    id: `INV-${2024001 + i}`,
    patientName: [
      "John Doe",
      "Jane Smith",
      "Alice Johnson",
      "Bob Brown",
      "Charlie Davis",
    ][Math.floor(Math.random() * 5)],
    patientId: `PAT-${1000 + i}`,
    date: new Date(2024, 0, 1 + i).toISOString().split("T")[0],
    dueDate: new Date(2024, 0, 15 + i).toISOString().split("T")[0],
    amount: Math.floor(Math.random() * 5000) + 100,
    status,
    items: Math.floor(Math.random() * 5) + 1,
  };
});

export default function MedicalBillingPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Summary Stats ---
  const totalBilled = MOCK_INVOICES.reduce((acc, curr) => acc + curr.amount, 0);
  const collected = MOCK_INVOICES.filter((i) => i.status === "Paid").reduce(
    (acc, curr) => acc + curr.amount,
    0
  );
  const pending = MOCK_INVOICES.filter((i) => i.status === "Pending").reduce(
    (acc, curr) => acc + curr.amount,
    0
  );
  const overdue = MOCK_INVOICES.filter((i) => i.status === "Overdue").reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  // --- Table Columns ---
  const columns: any[] = [
    {
      name: "Invoice ID",
      selector: (row: Invoice) => row.id,
      sortable: true,
      cell: (row: Invoice) => (
        <span className="font-medium text-blue-600">{row.id}</span>
      ),
    },
    {
      name: "Patient",
      selector: (row: Invoice) => row.patientName,
      sortable: true,
      cell: (row: Invoice) => (
        <div>
          <div className="font-medium text-gray-900">{row.patientName}</div>
          <div className="text-xs text-gray-500">{row.patientId}</div>
        </div>
      ),
    },
    {
      name: "Date",
      selector: (row: Invoice) => row.date,
      sortable: true,
      cell: (row: Invoice) => (
        <div className="text-gray-600">
          <div>{row.date}</div>
          <div className="text-xs text-gray-400">Due: {row.dueDate}</div>
        </div>
      ),
    },
    {
      name: "Amount",
      selector: (row: Invoice) => row.amount,
      sortable: true,
      cell: (row: Invoice) => (
        <span className="font-medium text-gray-900">
          ${row.amount.toLocaleString()}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row: Invoice) => row.status,
      sortable: true,
      cell: (row: Invoice) => (
        <span
          className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-semibold border",
            row.status === "Paid"
              ? "bg-green-50 text-green-700 border-green-200"
              : row.status === "Pending"
              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
              : "bg-red-50 text-red-700 border-red-200"
          )}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row: Invoice) => (
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600 transition-colors">
            <Eye size={16} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-900 transition-colors">
            <Printer size={16} />
          </button>
        </div>
      ),
      width: "100px",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-96 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <TableSkeleton rows={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600/10 text-blue-600 rounded-lg">
              <ReceiptText size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Medical Billings & Invoices
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Manage patient invoices, track payments, and handle insurance
            claims.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} className="mr-2" /> Create Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Billed"
          value={totalBilled}
          icon={<FileText size={20} />}
          color="blue"
        />
        <SummaryCard
          title="Collected"
          value={collected}
          icon={<CheckCircle2 size={20} />}
          color="green"
        />
        <SummaryCard
          title="Pending"
          value={pending}
          icon={<Clock size={20} />}
          color="yellow"
        />
        <SummaryCard
          title="Overdue"
          value={overdue}
          icon={<AlertCircle size={20} />}
          color="red"
        />
      </div>

      {/* Main Content */}
      <ModernDataTable
        columns={columns}
        data={MOCK_INVOICES}
        searchable
        searchField="patientName"
        searchPlaceholder="Search invoices..."
        filters={[
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Paid", value: "Paid" },
              { label: "Pending", value: "Pending" },
              { label: "Overdue", value: "Overdue" },
            ],
          },
        ]}
      />

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Invoice"
        description="Generate a new invoice for a patient."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              Generate Invoice
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <InputText
            label="Patient ID"
            placeholder="Search patient..."
            required
          />
          <InputDropdown
            label="Type"
            options={[
              { label: "Consultation", value: "consultation" },
              { label: "Procedure", value: "procedure" },
              { label: "Medication", value: "medication" },
            ]}
            placeholder="Select type"
            onChange={() => {}}
          />
          <div className="grid grid-cols-2 gap-4">
            <InputText label="Date" type="date" required />
            <InputText label="Due Date" type="date" required />
          </div>
          <InputText label="Amount ($)" type="number" required />
          <InputText label="Notes" placeholder="Optional notes..." />
        </div>
      </Modal>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "yellow" | "red";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
    red: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">
          ${value.toLocaleString()}
        </p>
      </div>
      <div className={cn("p-3 rounded-xl border", colors[color])}>{icon}</div>
    </div>
  );
}
