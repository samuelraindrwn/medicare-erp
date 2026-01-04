"use client";

import * as React from "react";
import { MyAttendance } from "./components/MyAttendance";
import { MyPayslip } from "./components/MyPayslip";
import { MyLearning } from "./components/MyLearning";
import { CompanyHandbook } from "./components/CompanyHandbook";
import { ReimbursementPanel } from "./components/ReimbursementPanel";
import { MyProfile } from "./components/MyProfile";
import { Clock, Wallet, BookOpen, FileText, Receipt, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "attendance", label: "My Attendance", icon: Clock },
  { id: "payslip", label: "My Payslip", icon: Wallet },
  { id: "learning", label: "My Learning", icon: BookOpen },
  { id: "handbook", label: "Handbook", icon: FileText },
  { id: "reimbursement", label: "Reimbursement", icon: Receipt },
  { id: "profile", label: "My Profile", icon: User },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function EmployeeSelfServicePage() {
  const [activeTab, setActiveTab] = React.useState<TabId>("attendance");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Employee Self-Service
        </h1>
        <p className="text-gray-500">
          Manage your attendance, payslips, learning, and more — all in one
          place.
        </p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "p-4 rounded-xl border text-left transition-all duration-200 hover:shadow-md",
                isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                  : "bg-white text-gray-700 border-gray-200 hover:border-blue-200"
              )}
            >
              <Icon
                size={24}
                className={cn(
                  "mb-2",
                  isActive ? "text-white" : "text-gray-400"
                )}
              />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {activeTab === "attendance" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <MyAttendance />
          </div>
        )}
        {activeTab === "payslip" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <MyPayslip />
          </div>
        )}
        {activeTab === "learning" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <MyLearning />
          </div>
        )}
        {activeTab === "handbook" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CompanyHandbook />
          </div>
        )}
        {activeTab === "reimbursement" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <ReimbursementPanel />
          </div>
        )}
        {activeTab === "profile" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <MyProfile />
          </div>
        )}
      </div>
    </div>
  );
}
