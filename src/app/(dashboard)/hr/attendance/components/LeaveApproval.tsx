"use client";

import * as React from "react";
import {
  LeaveRequest,
  mockLeaveRequests,
  mockEmployees,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { CheckCircle, XCircle, Clock, CalendarDays } from "lucide-react";

export function LeaveApproval() {
  const { addToast } = useToast();
  const [requests, setRequests] =
    React.useState<LeaveRequest[]>(mockLeaveRequests);

  const handleAction = (id: string, action: "Approved" | "Rejected") => {
    const req = requests.find((r) => r.id === id);
    if (!req) return;

    if (action === "Approved") {
      // Mock deduction logic (visual only for now, as we don't persist to deep mockEmployees state in this simple demo)
      const employee = mockEmployees.find((e) => e.id === req.employeeId);
      if (employee && employee.leaveBalance) {
        if (req.type === "Annual") employee.leaveBalance.annual -= 1; // Simplified 1 day deduction
        if (req.type === "Sick") employee.leaveBalance.sick -= 1;
      }
    }

    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );

    addToast(
      action === "Approved" ? "success" : "error",
      `Leave request for ${req.employeeName} was ${action.toLowerCase()}.`
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Leave Requests</h3>

      <div className="grid gap-4">
        {requests.length === 0 && (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
            No pending leave requests.
          </div>
        )}

        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-900">
                  {req.employeeName}
                </span>
                <span className="text-sm text-gray-500">
                  • {req.type} Leave
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                    req.status
                  )}`}
                >
                  {req.status}
                </span>
              </div>

              {/* Context: Balance */}
              {req.status === "Pending" && (
                <div className="text-xs text-orange-600 font-medium mb-1 flex items-center gap-1">
                  <CalendarDays size={12} />
                  Current Balance:{" "}
                  {mockEmployees.find((e) => e.id === req.employeeId)
                    ?.leaveBalance?.annual ?? 0}{" "}
                  days remaining
                </div>
              )}

              <p className="text-sm text-gray-600 mb-1">
                {req.startDate} — {req.endDate}
              </p>
              <p className="text-sm text-gray-500 italic">"{req.reason}"</p>
            </div>

            {req.status === "Pending" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  onClick={() => handleAction(req.id, "Rejected")}
                >
                  <XCircle size={16} className="mr-1" /> Reject
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleAction(req.id, "Approved")}
                >
                  <CheckCircle size={16} className="mr-1" /> Approve
                </Button>
              </div>
            )}
            {req.status !== "Pending" && (
              <div className="flex items-center text-sm text-gray-400">
                {req.status === "Approved" ? (
                  <CheckCircle size={16} className="mr-1" />
                ) : (
                  <XCircle size={16} className="mr-1" />
                )}
                {req.status}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
