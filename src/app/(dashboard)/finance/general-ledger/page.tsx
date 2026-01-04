"use client";

import * as React from "react";
import {
  BookOpen,
  FileSpreadsheet,
  List,
  Plus,
  Filter,
  Download,
  Printer,
  FileText,
} from "lucide-react";
import { ModernDataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { TableSkeleton } from "@/components/ui/Loader";
import { Modal } from "@/components/ui/Modal";
import { InputText } from "@/components/ui/InputText";
import { InputDropdown } from "@/components/ui/InputDropdown";
import { useToast } from "@/components/ui/Toast";

// --- Types ---
interface JournalEntry {
  id: string;
  date: string;
  number: string;
  label: string;
  partner?: string;
  reference?: string;
  debit: number;
  credit: number;
  balance?: number; // Running balance
  status: "Posted" | "Draft";
}

interface Account {
  code: string;
  name: string;
  type: string;
  currency: string;
  balance: number;
}

// --- Mock Data ---
// Generate base data
const RAW_ENTRIES: JournalEntry[] = Array.from({ length: 50 }).map((_, i) => {
  const isDebit = i % 2 === 0;
  const amount = ((i * 37) % 5000) + 500 + i * 100;

  return {
    id: `JE-${2024001 + i}`,
    date: new Date(2024, 0, 1 + i).toISOString().split("T")[0],
    number: `JRNL/2024/${String(i + 1).padStart(4, "0")}`,
    label: [
      "Vendor Payment",
      "Customer Invoice",
      "Bank Fee",
      "Salary Payment",
      "Office Supplies",
    ][i % 5],
    partner:
      i % 2 === 0
        ? ["TechSol Inc", "MediCare Supply", "Dr. Smith", "City Hospital"][
            i % 4
          ]
        : undefined,
    debit: isDebit ? amount : 0,
    credit: isDebit ? 0 : amount,
    status: i % 4 === 0 ? "Draft" : "Posted",
  };
});

// Calculate running balance
let initialRunningBalance = 25000;
const INITIAL_ENTRIES = RAW_ENTRIES.map((entry) => {
  initialRunningBalance += entry.debit - entry.credit;
  return { ...entry, balance: initialRunningBalance };
});

const CHART_OF_ACCOUNTS: Account[] = [
  {
    code: "101000",
    name: "Cash",
    type: "Current Assets",
    currency: "USD",
    balance: 25000.0,
  },
  {
    code: "101200",
    name: "Bank",
    type: "Current Assets",
    currency: "USD",
    balance: 154200.5,
  },
  {
    code: "102000",
    name: "Accounts Receivable",
    type: "Receivable",
    currency: "USD",
    balance: 45000.0,
  },
  {
    code: "201000",
    name: "Accounts Payable",
    type: "Payable",
    currency: "USD",
    balance: -12000.0,
  },
  {
    code: "300000",
    name: "Capital",
    type: "Equity",
    currency: "USD",
    balance: -100000.0,
  },
  {
    code: "400000",
    name: "Product Sales",
    type: "Income",
    currency: "USD",
    balance: -85000.0,
  },
  {
    code: "600000",
    name: "Expenses",
    type: "Expenses",
    currency: "USD",
    balance: 5000.0,
  },
];

export default function GeneralLedgerPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = React.useState<"journal" | "coa">(
    "journal"
  );
  const [isLoading, setIsLoading] = React.useState(true);

  // State for Journal Entries
  const [entries, setEntries] = React.useState<JournalEntry[]>(INITIAL_ENTRIES);

  // State for Modal
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newEntry, setNewEntry] = React.useState<Partial<JournalEntry>>({
    date: new Date().toISOString().split("T")[0],
    label: "",
    debit: 0,
    credit: 0,
    status: "Posted",
  });

  React.useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleExportCSV = () => {
    const headers = [
      "Date",
      "Number",
      "Label",
      "Partner",
      "Debit",
      "Credit",
      "Balance",
      "Status",
    ];
    const rows = entries.map((row) => [
      row.date,
      row.number,
      `"${row.label}"`,
      `"${row.partner || ""}"`,
      row.debit,
      row.credit,
      row.balance,
      row.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `general_ledger_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text("General Ledger Report", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    const tableColumn = [
      "Date",
      "Number",
      "Label",
      "Debit",
      "Credit",
      "Balance",
      "Status",
    ];
    const tableRows = entries.map((row) => [
      row.date,
      row.number,
      row.label,
      `$${row.debit.toLocaleString()}`,
      `$${row.credit.toLocaleString()}`,
      `$${(row.balance ?? 0).toLocaleString()}`,
      row.status,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
    });

    doc.save(
      `general_ledger_report_${new Date().toISOString().split("T")[0]}.pdf`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveEntry = () => {
    // Validation
    if (!newEntry.label || !newEntry.date) {
      addToast("error", "Please fill in all required fields");
      return;
    }

    // Logic to add new entry and recalculate balance
    const lastBalance =
      entries.length > 0 ? entries[entries.length - 1].balance || 0 : 0;
    const debit = Number(newEntry.debit) || 0;
    const credit = Number(newEntry.credit) || 0;
    const newBalance = lastBalance + debit - credit;

    const entryToAdd: JournalEntry = {
      id: `JE-${2024000 + entries.length + 1}`,
      date: newEntry.date || "",
      number: `JRNL/2024/${String(entries.length + 1).padStart(4, "0")}`,
      label: newEntry.label || "",
      partner: newEntry.partner,
      debit: debit,
      credit: credit,
      balance: newBalance,
      status: (newEntry.status as "Posted" | "Draft") || "Draft",
    };

    setEntries([...entries, entryToAdd]);
    setIsModalOpen(false);
    setNewEntry({
      date: new Date().toISOString().split("T")[0],
      label: "",
      debit: 0,
      credit: 0,
      status: "Posted",
    });
    addToast("success", "Journal entry added successfully");
  };

  // --- Columns for Journal ---
  const journalColumns: any[] = [
    {
      name: "Date",
      selector: (row: JournalEntry) => row.date,
      sortable: true,
      width: "110px",
    },
    {
      name: "Number",
      selector: (row: JournalEntry) => row.number,
      sortable: true,
      width: "160px",
      cell: (row: JournalEntry) => (
        <span className="font-medium text-blue-600">{row.number}</span>
      ),
    },
    {
      name: "Label",
      selector: (row: JournalEntry) => row.label,
      sortable: true,
      cell: (row: JournalEntry) => (
        <div>
          <div className="text-gray-900 font-medium">{row.label}</div>
          {row.partner && (
            <div className="text-xs text-gray-500">{row.partner}</div>
          )}
        </div>
      ),
    },
    {
      name: "Debit",
      selector: (row: JournalEntry) => row.debit,
      sortable: true,
      style: { justifyContent: "end" },
      width: "120px",
      cell: (row: JournalEntry) => (
        <span className="font-medium font-mono text-gray-600">
          {row.debit > 0
            ? `$${row.debit.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}`
            : "-"}
        </span>
      ),
    },
    {
      name: "Credit",
      selector: (row: JournalEntry) => row.credit,
      sortable: true,
      style: { justifyContent: "end" },
      width: "120px",
      cell: (row: JournalEntry) => (
        <span className="font-medium font-mono text-gray-600">
          {row.credit > 0
            ? `$${row.credit.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}`
            : "-"}
        </span>
      ),
    },
    {
      name: "Balance",
      selector: (row: JournalEntry) => row.balance,
      sortable: true,
      style: { justifyContent: "end" },
      width: "130px",
      cell: (row: JournalEntry) => (
        <span
          className={cn(
            "font-medium font-mono",
            (row.balance ?? 0) < 0 ? "text-red-600" : "text-blue-600"
          )}
        >
          {(row.balance ?? 0) < 0 ? "(" : ""}$
          {Math.abs(row.balance ?? 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
          {(row.balance ?? 0) < 0 ? ")" : ""}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row: JournalEntry) => row.status,
      sortable: true,
      width: "100px",
      cell: (row: JournalEntry) => (
        <span
          className={cn(
            "px-2 py-0.5 rounded text-xs font-semibold",
            row.status === "Posted"
              ? "bg-blue-50 text-blue-700"
              : "bg-gray-100 text-gray-600"
          )}
        >
          {row.status}
        </span>
      ),
    },
  ];

  // --- Columns for COA ---
  const coaColumns: any[] = [
    {
      name: "Code",
      selector: (row: Account) => row.code,
      sortable: true,
      width: "100px",
      cell: (row: Account) => (
        <span className="text-gray-500 font-mono">{row.code}</span>
      ),
    },
    {
      name: "Account Name",
      selector: (row: Account) => row.name,
      sortable: true,
      cell: (row: Account) => (
        <span className="font-semibold text-gray-900">{row.name}</span>
      ),
    },
    {
      name: "Type",
      selector: (row: Account) => row.type,
      sortable: true,
      cell: (row: Account) => (
        <span className="px-2 py-1 bg-gray-50 border border-gray-100 rounded text-xs text-gray-600">
          {row.type}
        </span>
      ),
    },
    {
      name: "Currency",
      selector: (row: Account) => row.currency,
      sortable: true,
      width: "100px",
    },
    {
      name: "Balance",
      selector: (row: Account) => row.balance,
      sortable: true,
      style: { justifyContent: "end" },
      cell: (row: Account) => (
        <span
          className={cn(
            "font-mono font-medium",
            row.balance < 0 ? "text-red-600" : "text-green-600"
          )}
        >
          {row.balance < 0 ? "(" : ""}$
          {Math.abs(row.balance ?? 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
          {row.balance < 0 ? ")" : ""}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <TableSkeleton rows={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600/10 text-blue-600 rounded-lg">
              <BookOpen size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">General Ledger</h1>
          </div>
          <p className="text-sm text-gray-500">
            View journal entries and manage chart of accounts.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer size={16} className="mr-2" /> Print
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText size={16} className="mr-2" /> PDF
          </Button>
          <Button variant="outline" onClick={handleExportCSV}>
            <Download size={16} className="mr-2" /> Excel
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} className="mr-2" /> New Entry
          </Button>
        </div>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          General Ledger Report
        </h1>
        <p className="text-gray-500">
          Generated on {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 print:hidden">
        <button
          onClick={() => setActiveTab("journal")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors border-b-2",
            activeTab === "journal"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          )}
        >
          <div className="flex items-center gap-2">
            <List size={16} /> Journal Entries
          </div>
        </button>
        <button
          onClick={() => setActiveTab("coa")}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors border-b-2",
            activeTab === "coa"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          )}
        >
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={16} /> Chart of Accounts
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "journal" ? (
          <ModernDataTable
            columns={journalColumns}
            data={entries}
            searchable
            searchField="label"
            searchPlaceholder="Search journals..."
            filters={[
              {
                key: "status",
                label: "Status",
                type: "select",
                options: [
                  { label: "Posted", value: "Posted" },
                  { label: "Draft", value: "Draft" },
                ],
              },
            ]}
          />
        ) : (
          <ModernDataTable
            columns={coaColumns}
            data={CHART_OF_ACCOUNTS}
            searchable
            searchField="name"
            searchPlaceholder="Search accounts..."
          />
        )}
      </div>

      {/* New Entry Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Journal Entry"
        description="Record a new transaction in the general ledger."
        size="3xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEntry}>Save Entry</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputText
              label="Date"
              type="date"
              value={newEntry.date}
              onChange={(e) =>
                setNewEntry({ ...newEntry, date: e.target.value })
              }
              required
            />
            <InputDropdown
              label="Status"
              options={[
                { label: "Posted", value: "Posted" },
                { label: "Draft", value: "Draft" },
              ]}
              value={
                newEntry.status
                  ? { label: newEntry.status, value: newEntry.status }
                  : null
              }
              onChange={(opt) =>
                setNewEntry({ ...newEntry, status: opt?.value as any })
              }
              placeholder="Select status"
            />
          </div>
          <InputText
            label="Description"
            placeholder="e.g. Office Rent Payment"
            value={newEntry.label}
            onChange={(e) =>
              setNewEntry({ ...newEntry, label: e.target.value })
            }
            required
          />
          <InputText
            label="Partner (Optional)"
            placeholder="e.g. Landlord Inc."
            value={newEntry.partner}
            onChange={(e) =>
              setNewEntry({ ...newEntry, partner: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <InputText
              label="Debit"
              type="number"
              placeholder="0.00"
              value={newEntry.debit}
              onChange={(e) =>
                setNewEntry({ ...newEntry, debit: Number(e.target.value) })
              }
            />
            <InputText
              label="Credit"
              type="number"
              placeholder="0.00"
              value={newEntry.credit}
              onChange={(e) =>
                setNewEntry({ ...newEntry, credit: Number(e.target.value) })
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
