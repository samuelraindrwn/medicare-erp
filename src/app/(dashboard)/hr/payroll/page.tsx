"use client";

import * as React from "react";
import { mockEmployees, Employee } from "@/lib/mock-data";
import { generatePayslip, formatCurrency } from "@/lib/payroll-utils";
import { PayrollTable } from "./components/PayrollTable";
import { PayrollSettings, PayrollConfig } from "./components/PayrollSettings";
import {
  VariablePayModal,
  VariablePayInput,
} from "./components/VariablePayModal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  DollarSign,
  Send,
  History,
  Wallet,
  Building2,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PayrollPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = React.useState("current");
  const [processing, setProcessing] = React.useState(false);

  // Advanced State
  const [config, setConfig] = React.useState<PayrollConfig>({
    taxMethod: "GROSS",
    jkkRate: 0.24,
    cutoffDate: 25,
    prorateNewHires: true,
  });

  const [variablePay, setVariablePay] = React.useState<
    Record<string, VariablePayInput>
  >({});
  const [editingVariablePayEmployee, setEditingVariablePayEmployee] =
    React.useState<Employee | null>(null);

  const currentPeriod = "January 2026";

  // Calculate Aggregates
  const summary = React.useMemo(() => {
    let totalGross = 0;
    let totalTax = 0;
    let totalNet = 0;
    let totalBPJS = 0;

    mockEmployees.forEach((emp) => {
      try {
        const variable = variablePay[emp.id];
        const slip = generatePayslip(emp, currentPeriod, variable, config);
        totalGross += slip.grossSalary;
        totalTax += slip.deductions.tax;
        totalNet += slip.netSalary;
        totalBPJS +=
          slip.companyContributions.bpjsKesehatan +
          slip.companyContributions.bpjsKetenagakerjaan;
      } catch (e) {
        console.warn(`Skipping ${emp.id}`, e);
      }
    });

    return { totalGross, totalTax, totalNet, totalBPJS };
  }, [config, variablePay]);

  const handleDisbursement = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      addToast(
        "success",
        "Payroll disbursed successfully to all " +
          mockEmployees.length +
          " employees!"
      );
    }, 3000);
  };

  const handleSaveVariablePay = (values: VariablePayInput) => {
    if (editingVariablePayEmployee) {
      setVariablePay((prev) => ({
        ...prev,
        [editingVariablePayEmployee.id]: values,
      }));
      addToast(
        "success",
        "Updated variable pay for " + editingVariablePayEmployee.firstName
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payroll & Compensation
          </h1>
          <p className="text-sm text-gray-500">
            Run payroll, manage salaries, and ensure tax compliance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <History size={16} /> History
          </Button>
          <Button
            className="gap-2"
            onClick={handleDisbursement}
            isLoading={processing}
          >
            <Send size={16} /> Disburse Payroll
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Net Pay</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.totalNet)}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <Building2 size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Tax (PPh 21)</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.totalTax)}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Company BPJS</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.totalBPJS)}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Payroll Cost</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.totalGross + summary.totalBPJS)}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 flex justify-between items-center pr-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab("current")}
              className={cn(
                "px-6 py-4 text-sm font-medium border-b-2 transition-colors",
                activeTab === "current"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              Current Period ({currentPeriod})
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={cn(
                "px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
                activeTab === "settings"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <Sliders size={16} /> Configuration
            </button>
          </div>
        </div>
        <div className="p-6">
          {activeTab === "current" && (
            <PayrollTable
              employees={mockEmployees}
              period={currentPeriod}
              config={config}
              variablePay={variablePay}
              onAddVariablePay={setEditingVariablePayEmployee}
            />
          )}
          {activeTab === "settings" && (
            <PayrollSettings config={config} onSave={setConfig} />
          )}
        </div>
      </div>

      {editingVariablePayEmployee && (
        <VariablePayModal
          isOpen={!!editingVariablePayEmployee}
          onClose={() => setEditingVariablePayEmployee(null)}
          employee={editingVariablePayEmployee}
          currentValues={
            variablePay[editingVariablePayEmployee.id] || {
              employeeId: editingVariablePayEmployee.id,
              overtimeHours: 0,
              bonus: 0,
              deductions: 0,
              notes: "",
            }
          }
          onSave={handleSaveVariablePay}
        />
      )}
    </div>
  );
}
