"use client";

import { useEffect, useState } from "react";

const messages = [
  "Consulting Foundry IQ...",
  "Generating Story...",
  "Designing Boss Fight...",
];

export default function FullScreenLoading() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, 2000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 px-4 py-6 text-white sm:px-6">
      <div className="flex w-full max-w-md flex-col items-center justify-center gap-8 rounded-[2rem] border border-zinc-800 bg-zinc-900/95 p-8 text-center shadow-2xl shadow-black/40">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-violet-500/20 bg-zinc-950 shadow-inner shadow-violet-500/10">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-violet-400" />
        </div>

        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-violet-300/80">Loading</p>
          <h1 className="text-xl font-semibold text-zinc-100 sm:text-2xl">{messages[index]}</h1>
          <p className="text-sm leading-6 text-zinc-400">
            Please wait while your game concept is being assembled.
          </p>
        </div>
      </div>
    </div>
  );
}
