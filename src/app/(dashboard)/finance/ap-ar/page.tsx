"use client";

import * as React from "react";
import {
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Download,
  Plus,
} from "lucide-react";
import { ModernDataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { TableSkeleton } from "@/components/ui/Loader";

// --- Types ---
interface Transaction {
  id: string;
  entityName: string; // Customer or Vendor
  refNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "Open" | "Overdue" | "Paid" | "Partial";
}

// --- Mock Data ---
const MOCK_AR: Transaction[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `AR-${i}`,
  entityName: [
    "John Doe",
    "Jane Smith",
    "Aetna Insurance",
    "BlueCross",
    "Medicare",
  ][Math.floor(Math.random() * 5)],
  refNumber: `INV-${2024001 + i}`,
  date: "2024-01-15",
  dueDate: "2024-02-15",
  amount: Math.floor(Math.random() * 5000) + 100,
  status: ["Open", "Overdue", "Paid"][Math.floor(Math.random() * 3)] as any,
}));

const MOCK_AP: Transaction[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `AP-${i}`,
  entityName: [
    "PharmaDistro Inc",
    "Medical Supplies Co",
    "Power Utility",
    "Property Management",
  ][Math.floor(Math.random() * 4)],
  refNumber: `BILL-${9001 + i}`,
  date: "2024-01-20",
  dueDate: "2024-02-20",
  amount: Math.floor(Math.random() * 10000) + 500,
  status: ["Open", "Overdue", "Paid"][Math.floor(Math.random() * 3)] as any,
}));

export default function APARPage() {
  const [activeTab, setActiveTab] = React.useState<"ar" | "ap">("ar");
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const columns: any[] = [
    {
      name: activeTab === "ar" ? "Customer" : "Vendor",
      selector: (row: Transaction) => row.entityName,
      sortable: true,
      cell: (row: Transaction) => (
        <span className="font-semibold text-gray-900">{row.entityName}</span>
      ),
    },
    {
      name: "Reference",
      selector: (row: Transaction) => row.refNumber,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row: Transaction) => row.date,
      sortable: true,
    },
    {
      name: "Due Date",
      selector: (row: Transaction) => row.dueDate,
      sortable: true,
      cell: (row: Transaction) => (
        <span
          className={cn(
            row.status === "Overdue" ? "text-red-600 font-medium" : ""
          )}
        >
          {row.dueDate}
        </span>
      ),
    },
    {
      name: "Amount",
      selector: (row: Transaction) => row.amount,
      sortable: true,
      right: true,
      cell: (row: Transaction) => (
        <span
          className={cn(
            "font-mono font-medium",
            activeTab === "ar" ? "text-green-600" : "text-gray-900"
          )}
        >
          {activeTab === "ar" ? "+" : "-"}$
          {row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row: Transaction) => row.status,
      sortable: true,
      cell: (row: Transaction) => (
        <span
          className={cn(
            "px-2 py-1 rounded text-xs font-semibold border",
            row.status === "Paid"
              ? "bg-green-50 text-green-700 border-green-200"
              : row.status === "Overdue"
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-blue-50 text-blue-700 border-blue-200"
          )}
        >
          {row.status}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
        <TableSkeleton rows={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600/10 text-blue-600 rounded-lg">
              <Receipt size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">AP & AR</h1>
          </div>
          <p className="text-sm text-gray-500">
            Manage your Accounts Payable and Accounts Receivable.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download size={16} className="mr-2" /> Export
          </Button>
          <Button>
            <Plus size={18} className="mr-2" /> New Transaction
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setActiveTab("ar")}
          className={cn(
            "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all",
            activeTab === "ar"
              ? "border-blue-600 bg-blue-50/50"
              : "border-gray-100 bg-white hover:border-blue-100"
          )}
        >
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center mb-3",
              activeTab === "ar"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-400"
            )}
          >
            <ArrowUpRight size={24} />
          </div>
          <h3
            className={cn(
              "font-bold text-lg",
              activeTab === "ar" ? "text-blue-900" : "text-gray-600"
            )}
          >
            Accounts Receivable
          </h3>
          <p className="text-sm text-gray-500">Invoices & Income</p>
        </button>

        <button
          onClick={() => setActiveTab("ap")}
          className={cn(
            "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all",
            activeTab === "ap"
              ? "border-blue-600 bg-blue-50/50"
              : "border-gray-100 bg-white hover:border-blue-100"
          )}
        >
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center mb-3",
              activeTab === "ap"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-400"
            )}
          >
            <ArrowDownLeft size={24} />
          </div>
          <h3
            className={cn(
              "font-bold text-lg",
              activeTab === "ap" ? "text-blue-900" : "text-gray-600"
            )}
          >
            Accounts Payable
          </h3>
          <p className="text-sm text-gray-500">Bills & Expenses</p>
        </button>
      </div>

      {/* Data Table */}
      <div className="animate-in fade-in zoom-in-95 duration-200">
        <ModernDataTable
          columns={columns}
          data={activeTab === "ar" ? MOCK_AR : MOCK_AP}
          searchable
          searchField="entityName"
          searchPlaceholder={`Search ${
            activeTab === "ar" ? "Customers" : "Vendors"
          }...`}
        />
      </div>
    </div>
  );
}
