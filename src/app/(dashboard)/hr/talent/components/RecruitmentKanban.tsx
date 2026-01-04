"use client";

import * as React from "react";
import { Candidate, mockCandidates } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  MoreHorizontal,
  Star,
  MessageSquare,
  Plus,
  UserPlus,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { useToast } from "@/components/ui/Toast";

const STAGES = ["Applied", "Screening", "Interview", "Offer", "Hired"] as const;

export function RecruitmentKanban() {
  const { addToast } = useToast();
  const [candidates, setCandidates] =
    React.useState<Candidate[]>(mockCandidates);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newCandidate, setNewCandidate] = React.useState({
    name: "",
    role: "",
    email: "",
    aiScore: 75,
  });

  // Mock drag and drop (simple button move for now to keep it lightweight without dnd library)
  const moveStage = (id: string, direction: "next" | "prev") => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const currentIndex = STAGES.indexOf(c.stage);
        const newIndex =
          direction === "next" ? currentIndex + 1 : currentIndex - 1;
        if (newIndex < 0 || newIndex >= STAGES.length) return c;
        return { ...c, stage: STAGES[newIndex] };
      })
    );
  };

  const handleAddCandidate = () => {
    if (!newCandidate.name || !newCandidate.role || !newCandidate.email) {
      addToast("error", "Please fill in all required fields.");
      return;
    }

    const candidate: Candidate = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCandidate.name,
      role: newCandidate.role,
      email: newCandidate.email,
      aiScore: newCandidate.aiScore,
      stage: "Applied",
      appliedDate: new Date().toISOString().split("T")[0],
    };

    setCandidates([candidate, ...candidates]);
    addToast("success", `${newCandidate.name} added to Applied stage.`);
    setIsModalOpen(false);
    setNewCandidate({ name: "", role: "", email: "", aiScore: 75 });
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 70) return "text-blue-600 bg-blue-50 border-blue-200";
    return "text-orange-600 bg-orange-50 border-orange-200";
  };

  return (
    <div className="h-full overflow-x-auto pb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Candidate Pipeline
        </h3>
        <Button onClick={() => setIsModalOpen(true)}>
          <UserPlus size={16} className="mr-2" /> Add Candidate
        </Button>
      </div>

      <div className="flex gap-4 min-w-[1200px]">
        {STAGES.map((stage) => {
          const stageCandidates = candidates.filter((c) => c.stage === stage);

          return (
            <div
              key={stage}
              className="flex-1 min-w-[280px] bg-gray-50/50 rounded-xl border border-gray-200 flex flex-col h-[600px]"
            >
              <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-xl">
                <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                  {stage}
                </h4>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
                  {stageCandidates.length}
                </span>
              </div>

              <div className="p-3 space-y-3 overflow-y-auto flex-1 dark-scrollbar">
                {stageCandidates.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-bold text-gray-900">{c.name}</h5>
                        <p className="text-xs text-gray-500">{c.role}</p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded border flex items-center gap-1",
                          getAIScoreColor(c.aiScore)
                        )}
                      >
                        <Star size={10} className="fill-current" />
                        AI Score: {c.aiScore}
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                      <MessageSquare size={12} /> {c.email}
                    </div>

                    <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {stage !== "Applied" && (
                        <button
                          onClick={() => moveStage(c.id, "prev")}
                          className="flex-1 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600 font-medium"
                        >
                          ← Back
                        </button>
                      )}
                      {stage !== "Hired" && (
                        <button
                          onClick={() => moveStage(c.id, "next")}
                          className="flex-1 py-1 text-xs bg-blue-50 hover:bg-blue-100 rounded text-blue-600 font-medium"
                        >
                          Next →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Candidate Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Candidate"
        description="Enter the candidate's details to add them to the pipeline."
      >
        <div className="space-y-4 py-4">
          <InputText
            label="Full Name"
            placeholder="e.g. John Doe"
            value={newCandidate.name}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, name: e.target.value })
            }
          />
          <InputText
            label="Applying for Role"
            placeholder="e.g. Senior Software Engineer"
            value={newCandidate.role}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, role: e.target.value })
            }
          />
          <InputText
            label="Email"
            type="email"
            placeholder="e.g. john@example.com"
            value={newCandidate.email}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, email: e.target.value })
            }
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              AI Score (0-100)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={newCandidate.aiScore}
              onChange={(e) =>
                setNewCandidate({
                  ...newCandidate,
                  aiScore: Number(e.target.value),
                })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Low Match</span>
              <span className="font-semibold text-blue-600">
                {newCandidate.aiScore}
              </span>
              <span>High Match</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddCandidate}>Add Candidate</Button>
        </div>
      </Modal>
    </div>
  );
}
