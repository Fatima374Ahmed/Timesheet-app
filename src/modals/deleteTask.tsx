import { useState } from "react";

const PROJECTS = ["Alpha", "Beta", "Gamma", "Delta"];
const WORK_TYPES = ["Bug fixes", "Feature", "Code review", "Meeting", "Design"];

export interface EntryData {
  project: string;
  workType: string;
  description: string;
  hours: number;
}

interface AddNewEntryModalProps {
    // editDetails: any,
    onClose: () => void;
    onSubmit?: (data: EntryData) => void;
}

export default function DeleteModal({ onClose, onSubmit }: AddNewEntryModalProps) {
  const [project, setProject] = useState<string>('');
  const [workType, setWorkType] = useState<string>("Bug fixes");
  const [description, setDescription] = useState<string>('');
  const [hours, setHours] = useState<number>(4);

  const handleSubmit = () => {
    // if (!project || !description.trim()) return;
    onSubmit?.({ project, workType, description, hours });
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

    // const [formData, setFormData] = useState<EntryData>(editDetails);
  

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-[480px] max-w-[95vw] p-8 animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 id="modal-title" className="text-[17px] font-semibold text-slate-800 tracking-tight">
            Delete Task
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Select Project */}
        {/* <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <label htmlFor="project" className="text-[13px] font-medium text-slate-700">
              Select Project <span className="text-rose-500">*</span>
            </label>
            <InfoIcon title="Choose the project this entry belongs to" />
          </div>
          <div className="relative">
            <select
              id="project"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full appearance-none border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition cursor-pointer pr-9"
            >
              <option value="">Project Name</option>
              {PROJECTS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronIcon />
          </div>
        </div> */}

        {/* Type of Work */}
        {/* <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <label htmlFor="workType" className="text-[13px] font-medium text-slate-700">
              Type of Work <span className="text-rose-500">*</span>
            </label>
            <InfoIcon title="Select the category of work performed" />
          </div>
          <div className="relative">
            <select
              id="workType"
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
              className="w-full appearance-none border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition cursor-pointer pr-9"
            >
              {WORK_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronIcon />
          </div>
        </div> */}

        {/* Task Description */}
        {/* <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <label htmlFor="description" className="text-[13px] font-medium text-slate-700">
              Task description <span className="text-rose-500">*</span>
            </label>
          </div>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write text here ..."
            rows={4}
            className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 bg-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition resize-none"
          />
          <p className="text-[11.5px] text-slate-400 mt-1">A note for extra info</p>
        </div> */}

        {/* Hours Stepper */}
        {/* <div className="mb-2">
          <div className="flex items-center gap-1.5 mb-1.5">
            <label className="text-[13px] font-medium text-slate-700">
              Hours <span className="text-rose-500">*</span>
            </label>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setHours((h) => Math.max(0, h - 1))}
              disabled={hours === 0}
              aria-label="Decrease hours"
              className="w-9 h-9 flex items-center justify-center border border-slate-200 border-r-0 rounded-l-lg bg-slate-50 text-slate-600 text-lg font-medium hover:bg-slate-100 active:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              −
            </button>
            <div
              aria-live="polite"
              className="w-12 h-9 flex items-center justify-center border-y border-slate-200 text-sm font-semibold text-slate-700 bg-white select-none"
            >
              {hours}
            </div>
            <button
              onClick={() => setHours((h) => h + 1)}
              aria-label="Increase hours"
              className="w-9 h-9 flex items-center justify-center border border-slate-200 border-l-0 rounded-r-lg bg-slate-50 text-slate-600 text-lg font-medium hover:bg-slate-100 active:bg-slate-200 transition"
            >
              +
            </button>
          </div>
        </div> */}

        {/* Footer */}
        <div className="flex gap-3 mt-7">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold text-[14px] py-3 rounded-lg shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
          >
            Delete entry
          </button>
          <button
            onClick={onClose}
            className="flex-[0.6] border border-slate-200 text-slate-600 font-medium text-[14px] py-3 rounded-lg hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoIcon({ title }: { title: string }) {
  return (
    <span
      title={title}
      className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold flex items-center justify-center cursor-default select-none flex-shrink-0"
    >
      i
    </span>
  );
}

function ChevronIcon() {
  return (
    <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
      <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L6 6L11 1" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}