"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Payslip, formatCurrency } from "@/lib/payroll-utils";
import { Employee } from "@/lib/mock-data";
import { Download, Printer, Building2 } from "lucide-react";

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  payslip: Payslip;
  employee: Employee;
}

export function PayslipModal({
  isOpen,
  onClose,
  payslip,
  employee,
}: PayslipModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Payslip - ${payslip.period}`}
      size="2xl"
      hideCloseButton={false}
    >
      <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-none min-h-[600px] text-sm text-gray-800 font-mono">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-6">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-gray-900 text-white rounded">
              <Building2 size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold uppercase tracking-widest text-gray-900">
                Medicare Inc.
              </h1>
              <p className="text-xs text-gray-500">
                123 Health Avenue, Jakarta Selatan
              </p>
              <p className="text-xs text-gray-500">
                NPWP: 01.234.567.8-901.000
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">PAYSLIP</p>
            <p className="text-gray-500">{payslip.period}</p>
          </div>
        </div>

        {/* Employee Info */}
        <div className="grid grid-cols-2 gap-4 mb-8 text-xs">
          <div>
            <p className="text-gray-500">Employee Name</p>
            <p className="font-bold text-sm uppercase">
              {employee.firstName} {employee.lastName}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Employee ID</p>
            <p className="font-bold text-sm">{employee.id}</p>
          </div>
          <div>
            <p className="text-gray-500">Department</p>
            <p className="font-bold text-sm">{employee.department}</p>
          </div>
          <div>
            <p className="text-gray-500">Job Title</p>
            <p className="font-bold text-sm">{employee.role}</p>
          </div>
          <div>
            <p className="text-gray-500">Tax Status</p>
            <p className="font-bold text-sm">{employee.taxStatus}</p>
          </div>
          <div>
            <p className="text-gray-500">Bank Account</p>
            <p className="font-bold text-sm">
              {employee.bankAccount.bankName} -{" "}
              {employee.bankAccount.accountNumber}
            </p>
          </div>
        </div>

        {/* Earnings */}
        <div className="mb-6">
          <div className="bg-gray-100 p-2 font-bold mb-2 uppercase text-xs flex justify-between">
            <span>Earnings</span>
            <span>Amount (IDR)</span>
          </div>
          <div className="space-y-2 px-2">
            <div className="flex justify-between">
              <span>Basic Salary</span>
              <span>{formatCurrency(payslip.baseSalary)}</span>
            </div>
            {payslip.allowances.transport > 0 && (
              <div className="flex justify-between">
                <span>Transport Allowance</span>
                <span>{formatCurrency(payslip.allowances.transport)}</span>
              </div>
            )}
            {payslip.allowances.meal > 0 && (
              <div className="flex justify-between">
                <span>Meal Allowance</span>
                <span>{formatCurrency(payslip.allowances.meal)}</span>
              </div>
            )}
            {payslip.allowances.housing > 0 && (
              <div className="flex justify-between">
                <span>Housing Allowance</span>
                <span>{formatCurrency(payslip.allowances.housing)}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between font-bold border-t border-gray-200 mt-2 pt-2 px-2">
            <span>Total Gross Income</span>
            <span>{formatCurrency(payslip.grossSalary)}</span>
          </div>
        </div>

        {/* Deductions */}
        <div className="mb-6">
          <div className="bg-gray-100 p-2 font-bold mb-2 uppercase text-xs flex justify-between">
            <span>Deductions</span>
            <span>Amount (IDR)</span>
          </div>
          <div className="space-y-2 px-2">
            <div className="flex justify-between">
              <span>PPh 21 (Income Tax)</span>
              <span>{formatCurrency(payslip.deductions.tax)}</span>
            </div>
            <div className="flex justify-between">
              <span>BPJS Kesehatan (1%)</span>
              <span>{formatCurrency(payslip.deductions.bpjsKesehatan)}</span>
            </div>
            <div className="flex justify-between">
              <span>BPJS Ketenagakerjaan (2%)</span>
              <span>
                {formatCurrency(payslip.deductions.bpjsKetenagakerjaan)}
              </span>
            </div>
          </div>
          <div className="flex justify-between font-bold border-t border-gray-200 mt-2 pt-2 px-2 text-red-600">
            <span>Total Deductions</span>
            <span>- {formatCurrency(payslip.deductions.total)}</span>
          </div>
        </div>

        {/* Net Pay */}
        <div className="bg-blue-50 p-4 border border-blue-100 rounded flex justify-between items-center mb-8">
          <div>
            <p className="text-xs uppercase text-blue-800 font-bold mb-1">
              Take Home Pay
            </p>
            <p className="text-xs text-blue-600">
              Transfer Key:{" "}
              {Math.random().toString(36).substring(7).toUpperCase()}
            </p>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            {formatCurrency(payslip.netSalary)}
          </p>
        </div>

        <div className="text-xs text-gray-400 text-center uppercase">
          Generated via Medicare ERP &bull; Confidential
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button variant="outline" className="gap-2">
          <Printer size={16} /> Print
        </Button>
        <Button className="gap-2">
          <Download size={16} /> Download PDF
        </Button>
      </div>
    </Modal>
  );
}
