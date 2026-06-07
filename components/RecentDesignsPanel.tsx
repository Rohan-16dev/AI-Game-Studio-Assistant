"use client";

import type { GameIdea } from "@/lib/types";

type RecentDesignsPanelProps = {
  recentDesigns: GameIdea[];
  onSelect: (idea: GameIdea) => void;
};

export default function RecentDesignsPanel({ recentDesigns, onSelect }: RecentDesignsPanelProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Recent designs</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Your last 5 generated concepts</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">Reopen any previous concept to continue refining or compare ideas.</p>
      </div>

      <div className="space-y-4">
        {recentDesigns.length === 0 ? (
          <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-5 text-sm text-slate-400">
            No recent designs yet. Generate a concept to save it here.
          </div>
        ) : (
          recentDesigns.slice(0, 5).map((design, index) => (
            <button
              key={`${design.title}-${index}`}
              type="button"
              onClick={() => onSelect(design)}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 p-5 text-left transition hover:border-violet-400/40 hover:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">{design.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.35em] text-slate-500">Concept {index + 1}</p>
                </div>
                <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-medium text-violet-200">Open</span>
              </div>

              <p className="mt-4 max-h-16 overflow-hidden text-sm leading-6 text-slate-400">{design.story}</p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
