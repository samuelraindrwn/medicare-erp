"use client";

import * as React from "react";
import { RecruitmentKanban } from "./components/RecruitmentKanban";
import { PerformanceDashboard } from "./components/PerformanceDashboard";
import { CourseManager } from "./components/CourseManager";
import { Users, TrendingUp, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TalentPage() {
  const [activeTab, setActiveTab] = React.useState<
    "ats" | "performance" | "lms"
  >("ats");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Talent Management
        </h1>
        <p className="text-gray-500">
          Acquire, assess, and develop your organization's most valuable asset:
          its people.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab("ats")}
          className={cn(
            "px-6 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap",
            activeTab === "ats"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          <Users size={18} />
          Recruitment (ATS)
        </button>
        <button
          onClick={() => setActiveTab("performance")}
          className={cn(
            "px-6 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap",
            activeTab === "performance"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          <TrendingUp size={18} />
          Performance
        </button>
        <button
          onClick={() => setActiveTab("lms")}
          className={cn(
            "px-6 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap",
            activeTab === "lms"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          <BookOpen size={18} />
          Course Management (LMS)
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === "ats" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <RecruitmentKanban />
          </div>
        )}
        {activeTab === "performance" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <PerformanceDashboard />
          </div>
        )}
        {activeTab === "lms" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CourseManager />
          </div>
        )}
      </div>
    </div>
  );
}
