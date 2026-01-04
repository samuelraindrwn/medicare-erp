"use client";

import * as React from "react";
import {
  mockReviews,
  PerformanceReview,
  mockEmployees,
  Goal,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Award,
  Target,
  Plus,
  Trash2,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { InputDropdown } from "@/components/ui/InputDropdown";
import { InputText } from "@/components/ui/InputText";
import { useToast } from "@/components/ui/Toast";

export function PerformanceDashboard() {
  const { addToast } = useToast();
  const [reviews, setReviews] =
    React.useState<PerformanceReview[]>(mockReviews);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Review State
  const [selectedEmployee, setSelectedEmployee] = React.useState<string | null>(
    null
  );
  const [period, setPeriod] = React.useState("Q1 2026");
  const [goals, setGoals] = React.useState<Goal[]>([
    { id: "1", title: "Main Project Delivery", weight: 50, score: 0 },
    { id: "2", title: "Team Collaboration", weight: 30, score: 0 },
    { id: "3", title: "Self Improvement", weight: 20, score: 0 },
  ]);
  const [feedback, setFeedback] = React.useState("");

  // Auto-calculation
  const totalWeight = goals.reduce(
    (sum, g) => sum + (Number(g.weight) || 0),
    0
  );
  const totalScore = goals.reduce(
    (sum, g) => sum + ((Number(g.weight) || 0) * (Number(g.score) || 0)) / 100,
    0
  );

  const getSuggestedRating = (score: number) => {
    if (score >= 90) return 5.0;
    if (score >= 80) return 4.0;
    if (score >= 70) return 3.0;
    if (score >= 60) return 2.0;
    return 1.0;
  };

  const handleAddGoal = () => {
    setGoals([
      ...goals,
      { id: Math.random().toString(), title: "", weight: 0, score: 0 },
    ]);
  };

  const handleRemoveGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const handleUpdateGoal = (id: string, field: keyof Goal, value: any) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, [field]: value } : g)));
  };

  const handleSaveReview = () => {
    if (!selectedEmployee || totalWeight !== 100) {
      addToast(
        "error",
        totalWeight !== 100
          ? "Total Weight must equal 100%."
          : "Please select an employee."
      );
      return;
    }

    const employee = mockEmployees.find((e) => e.id === selectedEmployee);
    const newReview: PerformanceReview = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId: selectedEmployee,
      employeeName: `${employee?.firstName} ${employee?.lastName}`,
      period,
      rating: getSuggestedRating(totalScore),
      kpiScore: Math.round(totalScore),
      feedback,
      goals,
    };

    setReviews([newReview, ...reviews]);
    addToast("success", "Performance review submitted successfully.");
    setIsModalOpen(false);

    // Reset
    setSelectedEmployee(null);
    setGoals([{ id: "1", title: "", weight: 0, score: 0 }]);
    setFeedback("");
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-blue-600";
    if (rating >= 3.0) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Team Performance
        </h3>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} className="mr-2" /> Conduct Review
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Avg Team Rating"
          value="4.1"
          sub="Top 10% of company"
          icon={<TrendingUp className="text-blue-500" />}
        />
        <StatsCard
          title="Goals Completed"
          value="89%"
          sub="+5% vs last quarter"
          icon={<Target className="text-green-500" />}
        />
        <StatsCard
          title="Top Performer"
          value="Alice Johnson"
          sub="Rating: 4.8/5.0"
          icon={<Award className="text-purple-500" />}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">
            Recent Performance Reviews
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Review Period</th>
                <th className="px-6 py-4">KPI Score</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {row.employeeName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{row.period}</td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px] mb-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${row.kpiScore}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {row.kpiScore}%
                    </span>
                  </td>
                  <td
                    className={cn(
                      "px-6 py-4 font-bold text-lg",
                      getRatingColor(row.rating)
                    )}
                  >
                    {row.rating}
                  </td>
                  <td className="px-6 py-4 text-gray-500 italic max-w-xs truncate">
                    {row.goals?.length ?? 0} Goals Tracked
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Conduct Performance Review"
        description="Define weighted goals and evaluate employee performance."
        size="lg"
      >
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Employee</label>
              <InputDropdown
                options={mockEmployees.map((e) => ({
                  label: `${e.firstName} ${e.lastName}`,
                  value: e.id,
                }))}
                value={
                  selectedEmployee
                    ? { label: "", value: selectedEmployee }
                    : null
                }
                onChange={(opt) =>
                  setSelectedEmployee(opt?.value ? String(opt.value) : null)
                }
                placeholder="Select Employee..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Period</label>
              <InputDropdown
                options={[
                  { label: "Q1 2026", value: "Q1 2026" },
                  { label: "Q4 2025", value: "Q4 2025" },
                ]}
                value={{ label: period, value: period }}
                onChange={(opt) => setPeriod(String(opt?.value))}
              />
            </div>
          </div>

          {/* Goals Editor */}
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm font-semibold text-gray-700">
                OKRs & Goals
              </span>
              <div
                className={cn(
                  "text-xs font-mono px-2 py-1 rounded",
                  totalWeight === 100
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                )}
              >
                Total Weight: {totalWeight}%
              </div>
            </div>

            {goals.map((goal, idx) => (
              <div key={goal.id} className="flex gap-2 items-start">
                <div className="flex-1">
                  <InputText
                    placeholder="Goal Title (e.g. Increase Revenue)"
                    value={goal.title}
                    onChange={(e) =>
                      handleUpdateGoal(goal.id, "title", e.target.value)
                    }
                  />
                </div>
                <div className="w-24">
                  <InputText
                    placeholder="Wgt %"
                    type="number"
                    value={goal.weight}
                    onChange={(e) =>
                      handleUpdateGoal(
                        goal.id,
                        "weight",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="w-24">
                  <InputText
                    placeholder="Score"
                    type="number"
                    value={goal.score}
                    onChange={(e) =>
                      handleUpdateGoal(goal.id, "score", Number(e.target.value))
                    }
                  />
                </div>
                <Button
                  variant="ghost"
                  className="text-red-500"
                  onClick={() => handleRemoveGoal(goal.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddGoal}
              className="w-full border-dashed"
            >
              <Plus size={14} className="mr-2" /> Add Goal
            </Button>
          </div>

          {/* Calculations Preview */}
          <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center border border-gray-200">
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold">
                Projected KPI Score
              </div>
              <div className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Calculator size={20} className="text-gray-400" />
                {totalScore.toFixed(1)}{" "}
                <span className="text-sm font-normal text-gray-500">/ 100</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase font-semibold">
                Suggested Rating
              </div>
              <div
                className={cn(
                  "text-2xl font-bold",
                  getRatingColor(getSuggestedRating(totalScore))
                )}
              >
                {getSuggestedRating(totalScore).toFixed(1)}{" "}
                <span className="text-sm text-gray-400">/ 5.0</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Feedback Summary</label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
              placeholder="Provide qualitative feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveReview}>Submit Review</Button>
        </div>
      </Modal>
    </div>
  );
}

function StatsCard({
  title,
  value,
  sub,
  icon,
}: {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:-translate-y-1 transition-transform duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      </div>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  );
}
