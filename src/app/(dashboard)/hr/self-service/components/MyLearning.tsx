"use client";

import * as React from "react";
import { mockCourses, Course } from "@/lib/mock-data";
import { PlayCircle, CheckCircle, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

import { LearningModal } from "./LearningModal";

export function MyLearning() {
  const { addToast } = useToast();
  const [courses, setCourses] = React.useState<Course[]>(mockCourses);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleUpdateProgress = (id: string, newProgress: number) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        // Update modules completion status locally for the modal view if needed,
        // but here we just update the main list
        const updatedModules = c.modules?.map((m, idx) => {
          // Logic to mark modules as complete based on progress is tricky without explicit ID,
          // so we'll just trust the progress for the bar, and maybe update specific module if we had the index.
          // For simplicity in this mock, let's just make sure status reflects progress.
          return m;
        });

        // Actually, let's update specific module completion in the modal handler instead
        return {
          ...c,
          progress: newProgress,
          status: newProgress >= 100 ? "Completed" : "In Progress",
        };
      })
    );

    // Also update the selected course state so the modal updates immediately
    if (selectedCourse && selectedCourse.id === id) {
      setSelectedCourse((prev) =>
        prev
          ? {
              ...prev,
              progress: newProgress,
              status: newProgress >= 100 ? "Completed" : "In Progress",
            }
          : null
      );
    }
  };

  // Custom handler to sync module completion from modal
  const onModalProgressUpdate = (courseId: string, newProgress: number) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;

        // We need to mark the next available module as complete in our mock state
        // simplistic approach:
        const modules = c.modules ? [...c.modules] : [];
        const firstIncompleteIdx = modules.findIndex((m) => !m.completed);
        if (firstIncompleteIdx !== -1) {
          modules[firstIncompleteIdx] = {
            ...modules[firstIncompleteIdx],
            completed: true,
          };
        }

        return {
          ...c,
          progress: newProgress,
          status: newProgress >= 100 ? "Completed" : "In Progress",
          modules,
        };
      })
    );

    // Re-read from updated state logic is complex in React batching,
    // so we manually update selectedCourse to match what we just did
    setSelectedCourse((prev) => {
      if (!prev || prev.id !== courseId) return prev;
      const modules = prev.modules ? [...prev.modules] : [];
      const firstIncompleteIdx = modules.findIndex((m) => !m.completed);
      if (firstIncompleteIdx !== -1) {
        modules[firstIncompleteIdx] = {
          ...modules[firstIncompleteIdx],
          completed: true,
        };
      }
      return {
        ...prev,
        progress: newProgress,
        status: newProgress >= 100 ? "Completed" : "In Progress",
        modules,
      };
    });

    addToast("success", "Progress saved!");
  };

  const openCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
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
                onClick={() => openCourse(course)}
              >
                {course.status === "Completed" ? (
                  "Review Course"
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

      <LearningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={selectedCourse}
        onUpdateProgress={onModalProgressUpdate}
      />
    </div>
  );
}
