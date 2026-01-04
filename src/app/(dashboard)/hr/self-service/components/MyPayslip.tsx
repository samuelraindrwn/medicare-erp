"use client";

import * as React from "react";
import { mockEmployees, Employee } from "@/lib/mock-data";
import { generatePayslip } from "@/lib/payroll-utils";
import { PayslipModal } from "../../payroll/components/PayslipModal";
import { Button } from "@/components/ui/Button";
import { FileText, Download } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

// Mock logged-in employee
const CURRENT_EMPLOYEE_ID = "EMP005";

export function MyPayslip() {
  const { addToast } = useToast();
  const employee = mockEmployees.find((e) => e.id === CURRENT_EMPLOYEE_ID);
  const [isPayslipOpen, setIsPayslipOpen] = React.useState(false);

  if (!employee) return <div>Employee not found</div>;

  const payslip = generatePayslip(employee, {
    taxMethod: "GROSS",
    bpjsKesehatan: 1,
    bpjsKetenagakerjaan: {
      jht: 3.7,
      jp: 1,
      jkk: 0.24,
      jkm: 0.3,
    },
  });

  const handleDownload = () => {
    addToast("success", "Payslip PDF downloaded successfully.");
  };

  return (
    <div className="space-y-6">
      {/* Current Payslip Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Current Period Payslip
            </h3>
            <p className="text-sm text-gray-500">January 2026</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download size={16} className="mr-2" /> Download PDF
            </Button>
            <Button size="sm" onClick={() => setIsPayslipOpen(true)}>
              <FileText size={16} className="mr-2" /> View Details
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 uppercase font-medium">
              Gross Salary
            </p>
            <p className="text-xl font-bold text-gray-900">
              Rp {payslip.grossPay.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 uppercase font-medium">
              Total Deductions
            </p>
            <p className="text-xl font-bold text-red-600">
              - Rp {payslip.totalDeductions.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 uppercase font-medium">
              Tax (PPh 21)
            </p>
            <p className="text-xl font-bold text-orange-600">
              Rp {payslip.pph21.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-lg text-white">
            <p className="text-xs uppercase font-medium opacity-80">
              Take Home Pay
            </p>
            <p className="text-xl font-bold">
              Rp {payslip.netPay.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      {/* Payslip History */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h4 className="font-semibold text-gray-800">Payslip History</h4>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-4 py-3 text-left">Period</th>
              <th className="px-4 py-3 text-left">Net Pay</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {["December 2025", "November 2025", "October 2025"].map(
              (period, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-900">{period}</td>
                  <td className="px-4 py-3 text-gray-600">
                    Rp {(payslip.netPay - idx * 100000).toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Paid
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm">
                      <Download size={14} />
                    </Button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <PayslipModal
        isOpen={isPayslipOpen}
        onClose={() => setIsPayslipOpen(false)}
        payslip={payslip}
        employee={employee}
      />
    </div>
  );
}
