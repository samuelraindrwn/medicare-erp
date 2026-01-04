"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { InputNumber } from "@/components/ui/InputNumber";
import { InputDate } from "@/components/ui/InputDate";
import { Settings, Save } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export interface PayrollConfig {
  taxMethod: "GROSS" | "NET"; // Gross = Employee pays (Biaya Jabatan deducted), Net = Company pays (Gross Up)
  jkkRate: number; // 0.24% - 1.74%
  cutoffDate: number; // Day of month (e.g., 25th)
  prorateNewHires: boolean;
}

interface PayrollSettingsProps {
  config: PayrollConfig;
  onSave: (config: PayrollConfig) => void;
}

export function PayrollSettings({ config, onSave }: PayrollSettingsProps) {
  const { addToast } = useToast();
  const [localConfig, setLocalConfig] = React.useState<PayrollConfig>(config);

  const handleSave = () => {
    onSave(localConfig);
    addToast("success", "Payroll settings updated successfully.");
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-8">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="p-2 bg-gray-100 rounded text-gray-600">
          <Settings size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Payroll Configuration
          </h2>
          <p className="text-sm text-gray-500">
            Global rules for salary calculation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Taxation (PPh 21)
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() =>
                  setLocalConfig({ ...localConfig, taxMethod: "GROSS" })
                }
                className={`flex-1 p-4 rounded-lg border-2 text-left transition-all ${
                  localConfig.taxMethod === "GROSS"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-bold text-gray-900 mb-1">
                  Gross (Netto)
                </div>
                <p className="text-xs text-gray-500">
                  Employee pays tax. Salary is deducted by PPh 21.
                </p>
              </button>
              <button
                onClick={() =>
                  setLocalConfig({ ...localConfig, taxMethod: "NET" })
                }
                className={`flex-1 p-4 rounded-lg border-2 text-left transition-all ${
                  localConfig.taxMethod === "NET"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-bold text-gray-900 mb-1">
                  Net (Gross Up)
                </div>
                <p className="text-xs text-gray-500">
                  Company pays tax. Base salary is preserved.
                </p>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Attendance Integration
            </h3>
            <InputNumber
              label="Cutoff Date (Day of Month)"
              value={localConfig.cutoffDate}
              onChange={(e) =>
                setLocalConfig({
                  ...localConfig,
                  cutoffDate: parseInt(e.target.value) || 25,
                })
              }
              placeholder="e.g. 25"
            />
            <p className="text-xs text-gray-500 mt-2">
              Attendance periods will run from {localConfig.cutoffDate}th to{" "}
              {localConfig.cutoffDate}th of next month.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              BPJS Configuration
            </h3>
            <InputNumber
              label="JKK Rate (%)"
              value={localConfig.jkkRate}
              onChange={(e) =>
                setLocalConfig({
                  ...localConfig,
                  jkkRate: parseFloat(e.target.value) || 0.24,
                })
              }
              placeholder="0.24 - 1.74"
            />
            <p className="text-xs text-gray-500 mt-2">
              Work Accident Security (Jaminan Kecelakaan Kerja) rate based on
              risk level.
            </p>
          </div>

          <div className="pt-8">
            <Button onClick={handleSave} className="w-full gap-2">
              <Save size={16} /> Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
