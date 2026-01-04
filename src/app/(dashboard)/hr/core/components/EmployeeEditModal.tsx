"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { InputNumber } from "@/components/ui/InputNumber";
import { InputDate } from "@/components/ui/InputDate";
import { InputDropdown, Option } from "@/components/ui/InputDropdown";
import { Employee } from "@/lib/mock-data";
import { useToast } from "@/components/ui/Toast";
import { User, Briefcase, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployeeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onSave: (updatedEmployee: Employee) => void;
}

export function EmployeeEditModal({
  isOpen,
  onClose,
  employee,
  onSave,
}: EmployeeEditModalProps) {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = React.useState<
    "personal" | "employment" | "compensation"
  >("personal");
  const [formData, setFormData] = React.useState<Employee>(employee);

  const statusOptions: Option[] = [
    { label: "Active", value: "Active" },
    { label: "On Leave", value: "On Leave" },
    { label: "Terminated", value: "Terminated" },
  ];

  const taxOptions: Option[] = [
    { label: "TK/0 (Not Married, 0 Dep)", value: "TK/0" },
    { label: "K/0 (Married, 0 Dep)", value: "K/0" },
    { label: "K/1 (Married, 1 Dep)", value: "K/1" },
    { label: "K/2 (Married, 2 Dep)", value: "K/2" },
    { label: "K/3 (Married, 3 Dep)", value: "K/3" },
  ];

  React.useEffect(() => {
    setFormData(employee);
  }, [employee]);

  const handleSave = () => {
    onSave(formData);
    addToast("success", `Employee ${formData.firstName} updated successfully!`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Employee Profile"
      description="Update personal details, employment status, and compensation."
      size="2xl"
    >
      <div className="flex flex-col h-[600px]">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("personal")}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors",
              activeTab === "personal"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            <User size={16} /> Personal Info
          </button>
          <button
            onClick={() => setActiveTab("employment")}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors",
              activeTab === "employment"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            <Briefcase size={16} /> Employment
          </button>
          <button
            onClick={() => setActiveTab("compensation")}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors",
              activeTab === "compensation"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            <CreditCard size={16} /> Compensation
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-1 space-y-6">
          {activeTab === "personal" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputText
                label="First Name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
              <InputText
                label="Last Name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
              <InputText
                label="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <InputText
                label="Education Degree"
                value={formData.education.degree}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    education: {
                      ...formData.education,
                      degree: e.target.value,
                    },
                  })
                }
              />
              <InputText
                label="University"
                value={formData.education.university}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    education: {
                      ...formData.education,
                      university: e.target.value,
                    },
                  })
                }
              />
            </div>
          )}

          {activeTab === "employment" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputText
                label="Role / Job Title"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              />
              <InputText
                label="Department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              />
              {/* Note: InputDate requires Date object or null */}
              <InputDate
                label="Join Date"
                value={formData.joinDate ? new Date(formData.joinDate) : null}
                onChange={(date) =>
                  setFormData({
                    ...formData,
                    joinDate: date ? date.toISOString().split("T")[0] : "",
                  })
                }
              />
              <InputDate
                label="Contract End Date"
                value={
                  formData.contractEndDate
                    ? new Date(formData.contractEndDate)
                    : null
                }
                onChange={(date) =>
                  setFormData({
                    ...formData,
                    contractEndDate: date
                      ? date.toISOString().split("T")[0]
                      : "",
                  })
                }
              />
              <div className="md:col-span-2">
                <InputDropdown
                  label="Status"
                  options={statusOptions}
                  value={
                    statusOptions.find(
                      (opt) => opt.value === formData.status
                    ) || null
                  }
                  onChange={(option) =>
                    setFormData({
                      ...formData,
                      status: (option?.value as any) || "Active",
                    })
                  }
                />
              </div>
            </div>
          )}

          {activeTab === "compensation" && (
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <DollarSignIcon size={18} /> Salary Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputNumber
                    label="Basic Salary (IDR)"
                    value={formData.baseSalary}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        baseSalary: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <div>
                    <InputDropdown
                      label="Tax Status (PTKP)"
                      options={taxOptions}
                      value={
                        taxOptions.find(
                          (opt) => opt.value === formData.taxStatus
                        ) || null
                      }
                      onChange={(option) =>
                        setFormData({
                          ...formData,
                          taxStatus: (option?.value as any) || "TK/0",
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Bank Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputText
                    label="Bank Name"
                    value={formData.bankAccount?.bankName || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bankAccount: {
                          ...formData.bankAccount,
                          bankName: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. BCA"
                  />
                  <InputText
                    label="Account Number"
                    value={formData.bankAccount?.accountNumber || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bankAccount: {
                          ...formData.bankAccount,
                          accountNumber: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. 123456789"
                  />
                  <InputText
                    label="Account Holder Name"
                    value={formData.bankAccount?.holderName || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bankAccount: {
                          ...formData.bankAccount,
                          holderName: e.target.value,
                        },
                      })
                    }
                    placeholder="Name as per Bank Book"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4 mt-auto flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
}

function DollarSignIcon({
  size,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
