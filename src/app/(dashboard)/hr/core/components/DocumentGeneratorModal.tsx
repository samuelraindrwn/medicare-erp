"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { InputDate } from "@/components/ui/InputDate";
import { FileText, Download } from "lucide-react";

interface DocumentGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateTitle: string;
}

export function DocumentGeneratorModal({
  isOpen,
  onClose,
  templateTitle,
}: DocumentGeneratorModalProps) {
  const [employeeName, setEmployeeName] = React.useState("");
  const [date, setDate] = React.useState<Date | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  // Mock template content based on title
  const getPreviewContent = () => {
    const today = date
      ? date.toLocaleDateString()
      : new Date().toLocaleDateString();
    const name = employeeName || "[Employee Name]";

    if (templateTitle.includes("Certificate")) {
      return (
        <div className="font-serif text-gray-800 space-y-6 p-8 bg-white h-full border text-sm leading-relaxed">
          <div className="text-center border-b-2 border-gray-800 pb-4 mb-8">
            <h1 className="text-2xl font-bold uppercase tracking-widest text-gray-900">
              Certificate of Employment
            </h1>
          </div>
          <p>To Whom It May Concern,</p>
          <p>
            This is to certify that{" "}
            <strong className="uppercase">{name}</strong> is a bona fide
            employee of <strong>Medicare Inc.</strong>
          </p>
          <p>
            This certification is issued upon the request of the interested
            party for whatever legal purpose it may serve.
          </p>
          <p className="pt-12">
            Issued on: <strong>{today}</strong>
          </p>
          <div className="pt-16">
            <div className="border-t border-gray-400 w-48 pt-2">
              <p className="font-bold">Sarah Connor</p>
              <p className="text-xs text-gray-500">HR Director</p>
            </div>
          </div>
        </div>
      );
    }

    // Default / Generic Preview
    return (
      <div className="font-serif text-gray-800 space-y-6 p-8 bg-white h-full border text-sm leading-relaxed">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold uppercase text-gray-900">
            {templateTitle}
          </h1>
          <p className="text-gray-500 text-xs">Medicare Inc. HR Department</p>
        </div>
        <p>Date: {today}</p>
        <p>
          Subject:{" "}
          <strong>
            {templateTitle} for {name}
          </strong>
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </p>

        <div className="pt-16">
          <div className="border-t border-gray-400 w-48 pt-2">
            <p className="font-bold">Authorized Signatory</p>
            <p className="text-xs text-gray-500">Medicare Inc.</p>
          </div>
        </div>
      </div>
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onClose();
      // In a real app, this would trigger a download or save
    }, 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Generate ${templateTitle}`}
      description="Fill in the details to generate the document."
      size="full"
      hideCloseButton
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[75vh]">
        {/* Left: Input Form */}
        <div className="space-y-6 border-r border-gray-100 pr-4">
          <h3 className="font-semibold text-gray-700">Document Details</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Employee Name
              </label>
              <InputText
                placeholder="e.g. John Doe"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Issue Date
              </label>
              <InputDate value={date} onChange={(d) => setDate(d)} />
            </div>

            <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700 flex gap-3">
              <FileText size={20} className="shrink-0" />
              <p>
                This document will be generated as a PDF and saved to the
                repository automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="flex flex-col h-full bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Preview
            </span>
            <span className="text-xs text-gray-400">Page 1 of 1</span>
          </div>
          <div className="flex-1 p-6 overflow-y-auto relative bg-gray-200/50">
            {/* Paper Shadow Effect */}
            <div className="bg-white shadow-lg mx-auto min-h-full w-full max-w-sm">
              {getPreviewContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Footer content passed to Modal if needed, or just placed here */}
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleGenerate} isLoading={isGenerating}>
          <Download size={16} className="mr-2" /> Generate & Download
        </Button>
      </div>
    </Modal>
  );
}
