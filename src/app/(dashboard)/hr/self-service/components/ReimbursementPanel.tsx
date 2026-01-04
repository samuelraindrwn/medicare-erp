"use client";

import * as React from "react";
import { mockReimbursements, ReimbursementRequest } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { InputText } from "@/components/ui/InputText";
import { InputDropdown } from "@/components/ui/InputDropdown";
import { useToast } from "@/components/ui/Toast";
import { Plus, Receipt, Clock, CheckCircle, XCircle } from "lucide-react";

// Mock logged-in employee
const CURRENT_EMPLOYEE_ID = "EMP005";
const CURRENT_EMPLOYEE_NAME = "Evan Wright";

export function ReimbursementPanel() {
  const { addToast } = useToast();
  const [requests, setRequests] = React.useState<ReimbursementRequest[]>(
    mockReimbursements.filter((r) => r.employeeId === CURRENT_EMPLOYEE_ID)
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newRequest, setNewRequest] = React.useState({
    type: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = () => {
    if (!newRequest.type || !newRequest.amount || !newRequest.description) {
      addToast("error", "Please fill in all required fields.");
      return;
    }

    const request: ReimbursementRequest = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId: CURRENT_EMPLOYEE_ID,
      employeeName: CURRENT_EMPLOYEE_NAME,
      type: newRequest.type as any,
      amount: Number(newRequest.amount),
      date: newRequest.date,
      description: newRequest.description,
      status: "Pending",
    };

    setRequests([request, ...requests]);
    addToast("success", "Reimbursement request submitted!");
    setIsModalOpen(false);
    setNewRequest({
      type: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Clock size={12} /> Pending
          </span>
        );
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle size={12} /> Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            My Reimbursements
          </h3>
          <p className="text-sm text-gray-500">
            Submit and track expense claims
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} className="mr-2" /> New Request
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-medium">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {requests.filter((r) => r.status === "Pending").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Approved
          </p>
          <p className="text-2xl font-bold text-green-600">
            Rp{" "}
            {requests
              .filter((r) => r.status === "Approved")
              .reduce((sum, r) => sum + r.amount, 0)
              .toLocaleString("id-ID")}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-medium">
            Total Submitted
          </p>
          <p className="text-2xl font-bold text-gray-900">
            Rp{" "}
            {requests
              .reduce((sum, r) => sum + r.amount, 0)
              .toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3 text-gray-900">{req.date}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1">
                    <Receipt size={14} className="text-gray-400" />
                    {req.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                  {req.description}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  Rp {req.amount.toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-3">{getStatusBadge(req.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Reimbursement Request"
        description="Submit an expense claim for approval."
      >
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Expense Type
            </label>
            <InputDropdown
              options={[
                { label: "Travel", value: "Travel" },
                { label: "Meals", value: "Meals" },
                { label: "Equipment", value: "Equipment" },
                { label: "Medical", value: "Medical" },
                { label: "Other", value: "Other" },
              ]}
              value={
                newRequest.type
                  ? { label: newRequest.type, value: newRequest.type }
                  : null
              }
              onChange={(opt) =>
                setNewRequest({ ...newRequest, type: String(opt?.value || "") })
              }
              placeholder="Select Type"
            />
          </div>
          <InputText
            label="Amount (Rp)"
            type="number"
            placeholder="e.g. 500000"
            value={newRequest.amount}
            onChange={(e) =>
              setNewRequest({ ...newRequest, amount: e.target.value })
            }
          />
          <InputText
            label="Description"
            placeholder="e.g. Client meeting lunch"
            value={newRequest.description}
            onChange={(e) =>
              setNewRequest({ ...newRequest, description: e.target.value })
            }
          />
          <InputText
            label="Date"
            type="date"
            value={newRequest.date}
            onChange={(e) =>
              setNewRequest({ ...newRequest, date: e.target.value })
            }
          />
          <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center cursor-pointer hover:bg-gray-50 transition-colors">
            <p className="text-sm text-gray-500">Upload Receipt (Optional)</p>
            <p className="text-xs text-gray-400">(Mock Upload Area)</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Request</Button>
        </div>
      </Modal>
    </div>
  );
}
