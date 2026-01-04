"use client";

import * as React from "react";
import { AttendanceTable } from "./components/AttendanceTable";
import { LeaveApproval } from "./components/LeaveApproval";
import { ShiftScheduler } from "./components/ShiftScheduler";
import { Calendar, UserCheck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AttendancePage() {
  const [activeTab, setActiveTab] = React.useState<
    "attendance" | "leave" | "shifts"
  >("attendance");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Time & Attendance
        </h1>
        <p className="text-gray-500">
          Monitor daily attendance, manage leave requests, and schedule employee
          shifts.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("attendance")}
          className={cn(
            "px-6 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors",
            activeTab === "attendance"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          <Clock size={18} />
          Attendance Logs
        </button>
        <button
          onClick={() => setActiveTab("leave")}
          className={cn(
            "px-6 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors",
            activeTab === "leave"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          <UserCheck size={18} />
          Leave Requests
        </button>
        <button
          onClick={() => setActiveTab("shifts")}
          className={cn(
            "px-6 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors",
            activeTab === "shifts"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          <Calendar size={18} />
          Shift Schedule
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {activeTab === "attendance" && <AttendanceTable />}
        {activeTab === "leave" && <LeaveApproval />}
        {activeTab === "shifts" && <ShiftScheduler />}
      </div>
    </div>
  );
}
