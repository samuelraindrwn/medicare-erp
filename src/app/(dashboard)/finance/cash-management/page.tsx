"use client";

import * as React from "react";
import {
  Wallet,
  Landmark,
  FileText,
  Download,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { ModernDataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { CardSkeleton, TableSkeleton } from "@/components/ui/Loader";
import { Modal } from "@/components/ui/Modal";
import { InputText } from "@/components/ui/InputText";
import { InputDropdown } from "@/components/ui/InputDropdown";
import { useToast } from "@/components/ui/Toast";

// --- Types ---
interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  balance: number;
  currency: string;
}

interface CashTransaction {
  id: string;
  date: string;
  description: string;
  account: string;
  amount: number;
  type: "In" | "Out";
  status: "Cleared" | "Pending";
}

// --- Mock Data ---
const INITIAL_ACCOUNTS: BankAccount[] = [
  {
    id: "BA-001",
    name: "Main Operating",
    bankName: "Chase Bank",
    accountNumber: "**** 4589",
    balance: 125430.5,
    currency: "USD",
  },
  {
    id: "BA-002",
    name: "Payroll Account",
    bankName: "Wells Fargo",
    accountNumber: "**** 9921",
    balance: 45000.0,
    currency: "USD",
  },
  {
    id: "BA-003",
    name: "Reserve Fund",
    bankName: "Bank of America",
    accountNumber: "**** 1122",
    balance: 500000.0,
    currency: "USD",
  },
];

const INITIAL_TRANSACTIONS: CashTransaction[] = Array.from({ length: 20 }).map(
  (_, i) => {
    const type = Math.random() > 0.5 ? "In" : "Out";
    return {
      id: `TRX-${1000 + i}`,
      date: new Date(2024, 0, 1 + i).toISOString().split("T")[0],
      description: [
        "Payment from Insurer",
        "Utility Bill",
        "Vendor Payment",
        "Deposit",
        "Transfer to Payroll",
      ][Math.floor(Math.random() * 5)],
      account: ["Main Operating", "Payroll Account", "Reserve Fund"][
        Math.floor(Math.random() * 3)
      ],
      amount: Math.floor(Math.random() * 5000) + 100,
      type,
      status: Math.random() > 0.2 ? "Cleared" : "Pending",
    };
  }
);

export default function CashManagementPage() {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);

  // Data State
  const [accounts, setAccounts] =
    React.useState<BankAccount[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] =
    React.useState<CashTransaction[]>(INITIAL_TRANSACTIONS);

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newTx, setNewTx] = React.useState<{
    type: "In" | "Out";
    accountId: string;
    amount: string;
    description: string;
    date: string;
  }>({
    type: "In",
    accountId: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveTransaction = () => {
    // Validation
    if (!newTx.accountId || !newTx.amount || !newTx.description) {
      addToast("error", "Please fill in all required fields");
      return;
    }

    const amount = parseFloat(newTx.amount);
    if (isNaN(amount) || amount <= 0) {
      addToast("error", "Please enter a valid amount");
      return;
    }

    const selectedAccount = accounts.find((a) => a.id === newTx.accountId);
    if (!selectedAccount) {
      addToast("error", "Selected account not found");
      return;
    }

    // Create Transaction Object
    const tx: CashTransaction = {
      id: `TRX-${Date.now()}`,
      date: newTx.date,
      description: newTx.description,
      account: selectedAccount.name,
      amount: amount,
      type: newTx.type,
      status: "Cleared",
    };

    // Update Transactions List
    setTransactions([tx, ...transactions]);

    // Update Account Balance
    const updatedAccounts = accounts.map((acc) => {
      if (acc.id === newTx.accountId) {
        return {
          ...acc,
          balance:
            newTx.type === "In" ? acc.balance + amount : acc.balance - amount,
        };
      }
      return acc;
    });
    setAccounts(updatedAccounts);

    // Reset & Close
    setIsModalOpen(false);
    setNewTx({
      type: "In",
      accountId: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    addToast("success", "Transaction recorded successfully");
  };

  const columns: any[] = [
    {
      name: "Date",
      selector: (row: CashTransaction) => row.date,
      sortable: true,
      width: "120px",
    },
    {
      name: "Description",
      selector: (row: CashTransaction) => row.description,
      sortable: true,
      cell: (row: CashTransaction) => (
        <span className="font-medium text-gray-900">{row.description}</span>
      ),
    },
    {
      name: "Account",
      selector: (row: CashTransaction) => row.account,
      sortable: true,
      width: "150px",
    },
    {
      name: "Amount",
      selector: (row: CashTransaction) => row.amount,
      sortable: true,
      right: true,
      cell: (row: CashTransaction) => (
        <span
          className={cn(
            "font-mono font-bold",
            row.type === "In" ? "text-green-600" : "text-gray-900"
          )}
        >
          {row.type === "In" ? "+" : "-"}$
          {row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row: CashTransaction) => row.status,
      sortable: true,
      width: "100px",
      cell: (row: CashTransaction) => (
        <span
          className={cn(
            "px-2 py-0.5 rounded text-xs font-semibold",
            row.status === "Cleared"
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-600"
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
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-6">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
          <TableSkeleton rows={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600/10 text-blue-600 rounded-lg">
              <Wallet size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Cash Flow Monitoring
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Monitor real-time cash positions and daily liquidity movements.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} className="mr-2" /> Record Transaction
        </Button>
      </div>

      {/* Cash Positions (Bank Accounts) */}
      <h3 className="font-bold text-gray-900 text-lg">Cash Positions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <Landmark size={24} className="text-gray-600" />
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-500">
                {account.currency}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">{account.name}</h3>
            <p className="text-sm text-gray-500 mb-4">
              {account.bankName} • {account.accountNumber}
            </p>
            <div className="pt-4 border-t border-gray-50">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                Available Balance
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ${account.balance.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900">Recent Movements</h3>
          <Button variant="outline" size="sm">
            <Download size={14} className="mr-2" /> Export Report
          </Button>
        </div>
        <ModernDataTable
          columns={columns}
          data={transactions}
          searchable
          searchField="description"
          pagination
        />
      </div>

      {/* Record Transaction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Cash Transaction"
        description="Manually record a cash movement."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTransaction}>Save Transaction</Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setNewTx({ ...newTx, type: "In" })}
              className={cn(
                "flex items-center justify-center p-4 rounded-xl border-2 transition-all",
                newTx.type === "In"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-100 hover:bg-gray-50 text-gray-500"
              )}
            >
              <ArrowDownCircle className="mr-2" size={20} />
              <span className="font-bold">Cash In</span>
            </button>
            <button
              onClick={() => setNewTx({ ...newTx, type: "Out" })}
              className={cn(
                "flex items-center justify-center p-4 rounded-xl border-2 transition-all",
                newTx.type === "Out"
                  ? "border-gray-900 bg-gray-50 text-gray-900"
                  : "border-gray-100 hover:bg-gray-50 text-gray-500"
              )}
            >
              <ArrowUpCircle className="mr-2" size={20} />
              <span className="font-bold">Cash Out</span>
            </button>
          </div>

          <InputText
            label="Date"
            type="date"
            value={newTx.date}
            onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
            required
          />

          <InputDropdown
            label="Account"
            placeholder="Select Account"
            options={accounts.map((acc) => ({
              label: acc.name,
              value: acc.id,
            }))}
            value={
              newTx.accountId
                ? {
                    label:
                      accounts.find((a) => a.id === newTx.accountId)?.name ||
                      "",
                    value: newTx.accountId,
                  }
                : null
            }
            onChange={(opt) =>
              setNewTx({ ...newTx, accountId: String(opt?.value || "") })
            }
          />

          <InputText
            label="Amount"
            type="number"
            placeholder="0.00"
            value={newTx.amount}
            onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
            required
          />

          <InputText
            label="Description"
            placeholder="e.g. Utility Bill Payment"
            value={newTx.description}
            onChange={(e) =>
              setNewTx({ ...newTx, description: e.target.value })
            }
            required
          />
        </div>
      </Modal>
    </div>
  );
}
