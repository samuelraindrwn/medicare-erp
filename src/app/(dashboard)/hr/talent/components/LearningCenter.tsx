"use client";

import * as React from "react";
import { mockCourses, Course } from "@/lib/mock-data";
import { PlayCircle, CheckCircle, Clock } from "lucide-react";

export function LearningCenter() {
  const [courses, setCourses] = React.useState<Course[]>(mockCourses);

  const startCourse = (id: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        // Simple mock progression: Not Started -> In Progress (10%) -> +10%
        if (c.status === "Not Started")
          return { ...c, status: "In Progress", progress: 10 };
        if (c.status === "In Progress" && c.progress < 100)
          return {
            ...c,
            progress: Math.min(c.progress + 20, 100),
            status: c.progress + 20 >= 100 ? "Completed" : "In Progress",
          };
        return c;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h3 className="text-lg font-semibold text-gray-800">
          My Learning Path
        </h3>
        <p className="text-sm text-gray-500">3 Assigned Courses</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group"
          >
            {/* Thumbnail Mock */}
            <div
              className={`h-32 w-full ${course.thumbnail} opacity-80 group-hover:opacity-100 transition-opacity relative`}
            >
              {course.status === "Completed" && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                  <CheckCircle size={40} className="drop-shadow-lg" />
                </div>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
                {course.category}
              </div>
              <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">
                {course.title}
              </h4>
              <div className="flex items-center gap-1 text-gray-500 text-xs mb-4">
                <Clock size={14} /> {course.duration}
              </div>

              <div className="mt-auto space-y-3">
                <div className="flex justify-between text-xs font-medium text-gray-600">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>

                <button
                  onClick={() => startCourse(course.id)}
                  disabled={course.status === "Completed"}
                  className={`w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                    course.status === "Completed"
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                  }`}
                >
                  {course.status === "Completed"
                    ? "Completed"
                    : course.status === "Not Started"
                    ? "Start Learning"
                    : "Continue"}
                  {course.status !== "Completed" && <PlayCircle size={16} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
