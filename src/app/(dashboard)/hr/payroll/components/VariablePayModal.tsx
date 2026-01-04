"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { InputNumber } from "@/components/ui/InputNumber";
import { InputText } from "@/components/ui/InputText";
import { Employee } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/payroll-utils";

export interface VariablePayInput {
  employeeId: string;
  overtimeHours: number;
  bonus: number;
  deductions: number; // Kasbon etc
  notes: string;
}

interface VariablePayModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  currentValues: VariablePayInput;
  onSave: (values: VariablePayInput) => void;
}

export function VariablePayModal({
  isOpen,
  onClose,
  employee,
  currentValues,
  onSave,
}: VariablePayModalProps) {
  const [values, setValues] = React.useState<VariablePayInput>(currentValues);

  // Mocking Overtime Calculation (1/173 * Base Salary)
  const hourlyRate = Math.round(employee.baseSalary / 173);
  const overtimeAmount = values.overtimeHours * hourlyRate;

  const handleSave = () => {
    onSave(values);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Variable Pay - ${employee.firstName} ${employee.lastName}`}
      description="Add overtime, bonuses, or other adjustments for this period."
      size="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase">Base Salary</p>
            <p className="font-semibold">
              {formatCurrency(employee.baseSalary)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">
              Hourly Rate (1/173)
            </p>
            <p className="font-semibold">{formatCurrency(hourlyRate)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 border-b pb-2">
              Earnings
            </h4>
            <div>
              <InputNumber
                label="Overtime (Hours)"
                value={values.overtimeHours}
                onChange={(e) =>
                  setValues({
                    ...values,
                    overtimeHours: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
              <p className="text-xs text-green-600 mt-1 font-medium">
                + {formatCurrency(overtimeAmount)}
              </p>
            </div>
            <div>
              <InputNumber
                label="Bonus / THR (IDR)"
                value={values.bonus}
                onChange={(e) =>
                  setValues({
                    ...values,
                    bonus: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 border-b pb-2">
              Deductions
            </h4>
            <div>
              <InputNumber
                label="Unpaid Leave / Loan (IDR)"
                value={values.deductions}
                onChange={(e) =>
                  setValues({
                    ...values,
                    deductions: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
            <InputText
              label="Notes / Reason"
              value={values.notes}
              onChange={(e) => setValues({ ...values, notes: e.target.value })}
              placeholder="Reason for adjustment..."
            />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center border border-blue-100">
          <span className="text-blue-800 font-semibold">Net Adjustment</span>
          <span
            className={`font-bold text-lg ${
              overtimeAmount + values.bonus - values.deductions >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {overtimeAmount + values.bonus - values.deductions >= 0 ? "+" : ""}
            {formatCurrency(overtimeAmount + values.bonus - values.deductions)}
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6 border-t pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </Modal>
  );
}
