"use client";

import * as React from "react";
import { Employee } from "@/lib/mock-data";
import { Payslip, generatePayslip, formatCurrency } from "@/lib/payroll-utils";
import { ModernDataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Eye, Plus } from "lucide-react";
import { PayslipModal } from "./PayslipModal";

interface PayrollTableProps {
  employees: Employee[];
  period: string;
  config: { taxMethod: "GROSS" | "NET" };
  variablePay: Record<string, any>;
  onAddVariablePay: (employee: Employee) => void;
}

export function PayrollTable({
  employees,
  period,
  config,
  variablePay,
  onAddVariablePay,
}: PayrollTableProps) {
  const [selectedPayslip, setSelectedPayslip] = React.useState<{
    payslip: Payslip;
    employee: Employee;
  } | null>(null);

  const data = employees
    .map((emp) => {
      try {
        const variable = variablePay[emp.id];
        return {
          ...emp,
          payslip: generatePayslip(emp, period, variable, config),
        };
      } catch (e) {
        console.error(e);
        return null;
      }
    })
    .filter(Boolean) as (Employee & { payslip: Payslip })[];

  const columns = [
    {
      name: "Employee",
      selector: (row: any) => row.firstName,
      sortable: true,
      cell: (row: any) => (
        <div>
          <div className="font-bold text-gray-900">
            {row.firstName} {row.lastName}
          </div>
          <div className="text-xs text-gray-500">
            {row.role} • {row.department}
          </div>
        </div>
      ),
      width: "250px",
    },
    {
      name: "Gross Salary",
      selector: (row: any) => row.payslip.grossSalary,
      sortable: true,
      cell: (row: any) => (
        <span className="font-medium">
          {formatCurrency(row.payslip.grossSalary)}
        </span>
      ),
    },
    {
      name: "Tax (PPh 21)",
      selector: (row: any) => row.payslip.deductions.tax,
      sortable: true,
      cell: (row: any) => (
        <span className="text-red-500">
          - {formatCurrency(row.payslip.deductions.tax)}
        </span>
      ),
    },
    {
      name: "Take Home Pay",
      selector: (row: any) => row.payslip.netSalary,
      sortable: true,
      cell: (row: any) => (
        <span className="font-bold text-green-600">
          {formatCurrency(row.payslip.netSalary)}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onAddVariablePay(row)}
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            title="Add Overtime/Bonus"
          >
            <Plus size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              setSelectedPayslip({ payslip: row.payslip, employee: row })
            }
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Eye size={16} className="mr-2" /> View Payslip
          </Button>
        </div>
      ),
      width: "200px",
    },
  ];

  return (
    <>
      <ModernDataTable
        columns={columns}
        data={data}
        searchable
        searchField="firstName"
        searchPlaceholder="Search employee..."
        filters={[
          {
            key: "department",
            label: "Department",
            type: "select",
            options: [
              { label: "Executive", value: "Executive" },
              { label: "Human Resources", value: "Human Resources" },
              {
                label: "Information Technology",
                value: "Information Technology",
              },
              { label: "Finance", value: "Finance" },
              { label: "Clinical", value: "Clinical" },
              { label: "Operations", value: "Operations" },
            ],
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Active", value: "Active" },
              { label: "On Leave", value: "On Leave" },
            ],
          },
          {
            key: "taxStatus",
            label: "Tax Status",
            type: "select",
            options: [
              { label: "TK/0", value: "TK/0" },
              { label: "K/0", value: "K/0" },
              { label: "K/1", value: "K/1" },
              { label: "K/2", value: "K/2" },
              { label: "K/3", value: "K/3" },
            ],
          },
        ]}
      />

      {selectedPayslip && (
        <PayslipModal
          isOpen={!!selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
          payslip={selectedPayslip.payslip}
          employee={selectedPayslip.employee}
        />
      )}
    </>
  );
}
