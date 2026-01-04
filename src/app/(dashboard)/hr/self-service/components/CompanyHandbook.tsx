"use client";

import * as React from "react";
import { mockHandbook, HandbookDocument } from "@/lib/mock-data";
import {
  FileText,
  Download,
  ExternalLink,
  BookOpen,
  FileCheck,
  ScrollText,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function CompanyHandbook() {
  const { addToast } = useToast();
  const [documents] = React.useState<HandbookDocument[]>(mockHandbook);

  const handleDownload = (title: string) => {
    addToast("success", `Downloaded: ${title}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Policy":
        return <BookOpen size={20} className="text-blue-500" />;
      case "Guideline":
        return <ScrollText size={20} className="text-green-500" />;
      case "Form":
        return <FileCheck size={20} className="text-purple-500" />;
      case "SOP":
        return <Briefcase size={20} className="text-orange-500" />;
      default:
        return <FileText size={20} className="text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Policy":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Guideline":
        return "bg-green-50 text-green-700 border-green-200";
      case "Form":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "SOP":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Company Handbook
          </h3>
          <p className="text-sm text-gray-500">
            Access important company documents and policies
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all duration-300 flex gap-4"
          >
            <div
              className={`p-3 rounded-lg ${getCategoryColor(
                doc.category
              )} border`}
            >
              {getCategoryIcon(doc.category)}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(
                    doc.category
                  )}`}
                >
                  {doc.category}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3">{doc.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  Updated: {doc.updatedAt}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(doc.title)}
                  >
                    <Download size={14} className="mr-1" /> Download
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink size={14} className="mr-1" /> View
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
