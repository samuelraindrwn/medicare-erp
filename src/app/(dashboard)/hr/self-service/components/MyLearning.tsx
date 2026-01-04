"use client";

import * as React from "react";
import { mockCourses, Course } from "@/lib/mock-data";
import { PlayCircle, CheckCircle, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function MyLearning() {
  const { addToast } = useToast();
  const [courses, setCourses] = React.useState<Course[]>(mockCourses);

  const handleContinue = (id: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const newProgress = Math.min(c.progress + 20, 100);
        return {
          ...c,
          progress: newProgress,
          status: newProgress >= 100 ? "Completed" : "In Progress",
        };
      })
    );
    addToast("success", "Progress updated!");
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    return "bg-orange-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            My Learning Path
          </h3>
          <p className="text-sm text-gray-500">
            {courses.length} courses assigned
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen size={16} />
          <span>
            {courses.filter((c) => c.status === "Completed").length} /{" "}
            {courses.length} completed
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
          >
            {/* Thumbnail */}
            <div className={`h-32 ${course.thumbnail} relative`}>
              {course.status === "Completed" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <CheckCircle size={40} className="text-white" />
                </div>
              )}
              {course.status === "In Progress" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                  <div
                    className="h-full bg-white"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-blue-600 uppercase">
                  {course.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={12} />
                  {course.duration}
                </div>
              </div>

              <h4 className="font-bold text-gray-900 mb-3 line-clamp-2">
                {course.title}
              </h4>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-full rounded-full transition-all ${getProgressColor(
                      course.progress
                    )}`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <Button
                className="w-full"
                variant={course.status === "Completed" ? "outline" : "default"}
                disabled={course.status === "Completed"}
                onClick={() => handleContinue(course.id)}
              >
                {course.status === "Completed" ? (
                  "Completed"
                ) : course.status === "In Progress" ? (
                  <>
                    <PlayCircle size={16} className="mr-2" /> Continue
                  </>
                ) : (
                  <>
                    <PlayCircle size={16} className="mr-2" /> Start Learning
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
