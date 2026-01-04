"use client";

import * as React from "react";
import { Clock, CheckCircle, XCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { mockAttendance, AttendanceRecord } from "@/lib/mock-data";

// Mock logged-in employee
const CURRENT_EMPLOYEE_ID = "EMP005";
const CURRENT_EMPLOYEE_NAME = "Evan Wright";

export function MyAttendance() {
  const { addToast } = useToast();
  const [isClockedIn, setIsClockedIn] = React.useState(false);
  const [clockInTime, setClockInTime] = React.useState<string | null>(null);
  const [recentLogs, setRecentLogs] = React.useState<AttendanceRecord[]>(
    mockAttendance
      .filter((a) => a.employeeId === CURRENT_EMPLOYEE_ID)
      .slice(0, 7)
  );

  const handleClockAction = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (!isClockedIn) {
      setIsClockedIn(true);
      setClockInTime(timeStr);
      addToast("success", `Clocked in at ${timeStr}`);
    } else {
      setIsClockedIn(false);
      addToast(
        "success",
        `Clocked out at ${timeStr}. Total: ${clockInTime} - ${timeStr}`
      );
      setClockInTime(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Present":
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Present
          </span>
        );
      case "Late":
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            Late
          </span>
        );
      case "Absent":
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
            Absent
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Clock In/Out Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold">Today's Attendance</h3>
            <p className="text-blue-200 text-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="text-right">
            {isClockedIn ? (
              <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1.5 rounded-full">
                <CheckCircle size={16} className="text-green-300" />
                <span className="text-sm font-medium">Clocked In</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                <XCircle size={16} className="text-blue-200" />
                <span className="text-sm font-medium">Not Clocked In</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Button
            size="lg"
            variant={isClockedIn ? "destructive" : "default"}
            className={`${
              isClockedIn
                ? "bg-red-500 hover:bg-red-600"
                : "bg-white text-blue-700 hover:bg-blue-50"
            } font-bold px-8`}
            onClick={handleClockAction}
          >
            {isClockedIn ? (
              <>
                <PlayCircle size={20} className="mr-2 rotate-180" /> Clock Out
              </>
            ) : (
              <>
                <Clock size={20} className="mr-2" /> Clock In
              </>
            )}
          </Button>

          {clockInTime && (
            <div className="text-sm">
              <span className="text-blue-200">Started at:</span>
              <span className="ml-2 font-bold text-lg">{clockInTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* Recent Logs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h4 className="font-semibold text-gray-800">Recent Attendance</h4>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Clock In</th>
              <th className="px-4 py-3 text-left">Clock Out</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3 text-gray-900">{log.date}</td>
                <td className="px-4 py-3 text-gray-600">
                  {log.clockIn || "-"}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {log.clockOut || "-"}
                </td>
                <td className="px-4 py-3">{getStatusBadge(log.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
