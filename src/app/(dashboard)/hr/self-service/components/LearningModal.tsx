"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Course } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import { PlayCircle, CheckCircle, Lock, MonitorPlay } from "lucide-react";
import { cn } from "@/lib/utils";

interface LearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onUpdateProgress: (courseId: string, newProgress: number) => void;
}

export function LearningModal({
  isOpen,
  onClose,
  course,
  onUpdateProgress,
}: LearningModalProps) {
  if (!course) return null;

  const [activeModuleIndex, setActiveModuleIndex] = React.useState(0);

  // Determine active module based on completion
  React.useEffect(() => {
    if (course.modules) {
      const firstIncomplete = course.modules.findIndex((m) => !m.completed);
      if (firstIncomplete !== -1) {
        setActiveModuleIndex(firstIncomplete);
      } else {
        setActiveModuleIndex(0); // Review mode if all completed
      }
    }
  }, [course]);

  const handleCompleteModule = (index: number) => {
    if (!course.modules) return;

    // Calculate new progress
    const totalModules = course.modules.length;
    // Assuming we complete one more module
    const completedCount = course.modules.filter((m) => m.completed).length + 1;
    const newProgress = Math.round((completedCount / totalModules) * 100);

    onUpdateProgress(course.id, newProgress);

    // Move to next module
    if (index < totalModules - 1) {
      setActiveModuleIndex(index + 1);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={course.title}
      description={course.description || "Course content"}
      size="4xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px]">
        {/* Main Content Area (Video Player Placeholder) */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex-1 bg-black/90 rounded-xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
              <h4 className="text-white font-bold text-lg">
                {course.modules?.[activeModuleIndex]?.title}
              </h4>
              <p className="text-gray-300 text-sm">
                {course.modules?.[activeModuleIndex]?.duration}
              </p>
            </div>
            <MonitorPlay size={64} className="text-white/20" />
            <Button size="lg" className="rounded-full w-16 h-16 p-0 absolute">
              <PlayCircle size={32} className="ml-1" />
            </Button>
          </div>

          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <h4 className="font-semibold text-gray-900">Current Module</h4>
              <p className="text-sm text-gray-500">
                {course.modules?.[activeModuleIndex]?.title}
              </p>
            </div>
            <Button
              onClick={() => handleCompleteModule(activeModuleIndex)}
              disabled={course.modules?.[activeModuleIndex]?.completed}
            >
              {course.modules?.[activeModuleIndex]?.completed
                ? "Completed"
                : "Mark as Complete"}
            </Button>
          </div>
        </div>

        {/* Sidebar - Module List */}
        <div className="bg-gray-50 rounded-xl border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-white">
            <h4 className="font-bold text-gray-900">Course Content</h4>
            <p className="text-xs text-gray-500">
              {course.modules?.filter((m) => m.completed).length}/
              {course.modules?.length} Completed
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {course.modules?.map((module, idx) => (
              <button
                key={idx}
                onClick={() => setActiveModuleIndex(idx)}
                className={cn(
                  "w-full text-left p-3 rounded-lg text-sm border transition-all flex items-start gap-3",
                  activeModuleIndex === idx
                    ? "bg-white border-blue-200 shadow-sm ring-1 ring-blue-100"
                    : "bg-transparent border-transparent hover:bg-gray-100"
                )}
              >
                <div className="mt-0.5">
                  {module.completed ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : idx === activeModuleIndex ? (
                    <PlayCircle
                      size={16}
                      className="text-blue-500 fill-blue-50"
                    />
                  ) : (
                    <Lock size={16} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      activeModuleIndex === idx
                        ? "text-blue-700"
                        : "text-gray-700"
                    )}
                  >
                    {module.title}
                  </p>
                  <p className="text-xs text-gray-400">{module.duration}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
