"use client";

import * as React from "react";
import { BarChart3, Printer, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ReportType = "balance-sheet" | "pnl" | "cash-flow" | "tax-summary";

export default function ReportingPage() {
  const [activeReport, setActiveReport] =
    React.useState<ReportType>("balance-sheet");

  const reports = [
    { id: "balance-sheet", label: "Balance Sheet" },
    { id: "pnl", label: "Profit & Loss" },
    { id: "cash-flow", label: "Cash Flow Statement" },
    { id: "tax-summary", label: "Tax Liability" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/10 text-blue-600 rounded-lg">
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Financial Reports
            </h1>
            <p className="text-sm text-gray-500">
              Generate and view financial statements.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer size={16} className="mr-2" /> Print
          </Button>
          <Button size="sm">
            <Download size={16} className="mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-y-auto shrink-0 flex flex-col">
          <div className="p-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-900 text-sm">Statements</h3>
          </div>
          <div className="p-2 space-y-1">
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => setActiveReport(report.id as ReportType)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left",
                  activeReport === report.id
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <FileText size={16} />
                {report.label}
              </button>
            ))}
          </div>
        </div>

        {/* Report Preview */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-y-auto p-8">
          {activeReport === "balance-sheet" && <MockBalanceSheet />}
          {activeReport === "pnl" && <MockPnL />}
          {activeReport === "cash-flow" && <MockCashFlow />}
          {activeReport === "tax-summary" && <MockTaxSummary />}
        </div>
      </div>
    </div>
  );
}

// --- Mock Report Components ---

function MockBalanceSheet() {
  return (
    <div className="max-w-3xl mx-auto font-serif">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Medicare ERP</h2>
        <h3 className="text-xl text-gray-700 mt-1">Balance Sheet</h3>
        <p className="text-sm text-gray-500 mt-1">As of Jan 31, 2024</p>
      </div>

      <div className="space-y-6">
        <Section
          title="Assets"
          items={[
            { label: "Cash & Cash Equivalents", value: 124500.0 },
            { label: "Accounts Receivable", value: 45200.5 },
            { label: "Inventory", value: 85600.0 },
            { label: "Prepaid Expenses", value: 12000.0 },
          ]}
          total={267300.5}
        />

        <Section
          title="Liabilities"
          items={[
            { label: "Accounts Payable", value: 34500.0 },
            { label: "Accrued Liabilities", value: 12300.0 },
            { label: "Short Term Loans", value: 50000.0 },
          ]}
          total={96800.0}
        />

        <Section
          title="Equity"
          items={[
            { label: "Common Stock", value: 10000.0 },
            { label: "Retained Earnings", value: 160500.5 },
          ]}
          total={170500.5}
        />

        <div className="flex justify-between items-center py-3 border-t-2 border-gray-900 font-bold text-lg mt-8">
          <span>Total Liabilities & Equity</span>
          <span>$267,300.50</span>
        </div>
      </div>
    </div>
  );
}

function MockPnL() {
  return (
    <div className="max-w-3xl mx-auto font-serif">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Medicare ERP</h2>
        <h3 className="text-xl text-gray-700 mt-1">Profit & Loss</h3>
        <p className="text-sm text-gray-500 mt-1">Jan 1 - Jan 31, 2024</p>
      </div>

      <div className="space-y-6">
        <Section
          title="Revenue"
          items={[
            { label: "Medical Services", value: 250000.0 },
            { label: "Pharmacy Sales", value: 85000.0 },
            { label: "Consultations", value: 45000.0 },
          ]}
          total={380000.0}
        />

        <Section
          title="Cost of Goods Sold"
          items={[
            { label: "Medical Supplies Cost", value: 95000.0 },
            { label: "Pharmacy Cost", value: 45000.0 },
          ]}
          total={140000.0}
        />

        <div className="flex justify-between items-center py-2 border-t border-gray-300 font-bold mb-6 bg-gray-50 px-2 rounded">
          <span>Gross Profit</span>
          <span>$240,000.00</span>
        </div>

        <Section
          title="Operating Expenses"
          items={[
            { label: "Salaries & Wages", value: 120000.0 },
            { label: "Rent & Utilities", value: 15000.0 },
            { label: "Marketing", value: 5000.0 },
          ]}
          total={140000.0}
        />

        <div className="flex justify-between items-center py-3 border-t-2 border-gray-900 font-bold text-lg mt-8">
          <span>Net Income</span>
          <span className="text-green-600">$100,000.00</span>
        </div>
      </div>
    </div>
  );
}

function MockCashFlow() {
  return (
    <div className="max-w-3xl mx-auto font-serif text-center pt-20 text-gray-400">
      <FileText size={64} className="mx-auto mb-4 opacity-50" />
      <p>Cash Flow Statement preview not available in demo.</p>
    </div>
  );
}

function MockTaxSummary() {
  return (
    <div className="max-w-3xl mx-auto font-serif text-center pt-20 text-gray-400">
      <FileText size={64} className="mx-auto mb-4 opacity-50" />
      <p>Tax Liability Report preview not available in demo.</p>
    </div>
  );
}

function Section({
  title,
  items,
  total,
}: {
  title: string;
  items: { label: string; value: number }[];
  total: number;
}) {
  return (
    <div>
      <h4 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-3 border-b pb-1">
        {title}
      </h4>
      <div className="space-y-2 mb-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex justify-between text-sm text-gray-600 hover:bg-gray-50 px-2 py-1 rounded"
          >
            <span>{item.label}</span>
            <span>
              $
              {item.value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100 px-2">
        <span>Total {title}</span>
        <span>
          ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}
