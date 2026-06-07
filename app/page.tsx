"use client";

import { useEffect, useState } from "react";
import GameForm from "@/components/GameForm";
import GameOutput from "@/components/GameOutput";
import FoundryIQPanel from "@/components/FoundryIQPanel";
import FullScreenLoading from "@/components/FullScreenLoading";
import RecentDesignsPanel from "@/components/RecentDesignsPanel";
import { analyzeGameIdea } from "@/lib/designAnalyzer";
import type { FoundryKnowledge, GameIdea } from "@/lib/types";

type GameGenerationResponse = {
  idea: GameIdea;
  knowledge: FoundryKnowledge;
};

export default function Home() {
  const [idea, setIdea] = useState<GameIdea | null>(null);
  const [knowledge, setKnowledge] = useState<FoundryKnowledge | null>(null);
  const [recentDesigns, setRecentDesigns] = useState<GameIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("recentGameIdeas");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as GameIdea[];
        setRecentDesigns(parsed.slice(0, 5));
      } catch {
        setRecentDesigns([]);
      }
    }
  }, []);

  const saveRecentDesigns = (newIdea: GameIdea) => {
    setRecentDesigns((current) => {
      const existing = current.filter(
        (item) => item.title !== newIdea.title || item.story !== newIdea.story
      );
      const updated = [newIdea, ...existing].slice(0, 5);
      window.localStorage.setItem("recentGameIdeas", JSON.stringify(updated));
      return updated;
    });
  };

  const handleReopenDesign = (selectedIdea: GameIdea) => {
    setIdea(selectedIdea);
    setError(null);
  };

  const analysis = idea ? analyzeGameIdea(idea) : null;

  async function handleSubmit(values: { genre: string; theme: string; audience: string }) {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to generate game idea.");
        setIdea(null);
        setKnowledge(null);
      } else {
        const result = data as GameGenerationResponse;
        setIdea(result.idea);
        setKnowledge(result.knowledge);
        saveRecentDesigns(result.idea);
      }
    } catch (fetchError) {
      setError((fetchError as Error).message || "Network error while generating game idea.");
      setIdea(null);
      setKnowledge(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-violet-600/25 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -left-28 top-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-40 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl" />

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 lg:px-8">
        {isLoading ? <FullScreenLoading /> : null}
        <section className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-violet-500/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-violet-200 ring-1 ring-violet-500/20">
                AI creative production
              </span>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Design standout game concepts with intelligent studio prompts.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Turn genre, theme, and audience input into polished game ideas, story arcs, boss battles, and cover art direction using your AI Game Studio Assistant.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-violet-500/10 backdrop-blur-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-violet-200">Fast output</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">Generate full game concepts in seconds with curated genre knowledge.</p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-sky-500/10 backdrop-blur-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-200">Professional polish</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">Use glassmorphism cards and a dark creative workspace to keep the focus on design.</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
            <div className="space-y-4">
              <div className="rounded-[1.75rem] border border-violet-500/15 bg-slate-950/90 p-5 shadow-inner shadow-violet-500/5">
                <p className="text-sm uppercase tracking-[0.35em] text-violet-200">Launch a new idea</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Start with genre, theme, and audience.</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">The AI assistant will use enriched genre knowledge to build a complete game concept.</p>
              </div>
              <GameForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            {error ? (
              <div className="rounded-[2rem] border border-red-500/15 bg-red-500/10 p-6 text-sm text-red-100 shadow-lg shadow-red-500/10">
                {error}
              </div>
            ) : null}

            {idea ? (
              <>
                <GameOutput idea={idea} />
                {analysis ? (
                  <div className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-6 text-sm text-slate-300 shadow-inner shadow-black/20">
                    <h3 className="text-lg font-semibold text-white">Design analysis</h3>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      {[
                        { label: "Creativity", score: analysis.creativity.score, description: analysis.creativity.explanation },
                        { label: "Replayability", score: analysis.replayability.score, description: analysis.replayability.explanation },
                        { label: "Market potential", score: analysis.marketPotential.score, description: analysis.marketPotential.explanation },
                      ].map((item) => (
                        <div key={item.label} className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
                          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{item.label}</p>
                          <p className="mt-3 text-3xl font-semibold text-white">{item.score}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-slate-700 bg-slate-900/80 p-8 text-sm text-slate-400 shadow-inner shadow-black/20">
                Submit the form to generate a game idea and display it here.
              </div>
            )}
          </div>

          <div className="space-y-6">
            {knowledge ? (
              <FoundryIQPanel knowledge={knowledge} />
            ) : (
              <div className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 text-sm text-slate-400 shadow-inner shadow-black/20">
                The Foundry IQ panel will display the genre knowledge used to shape your generation.
              </div>
            )}

            <RecentDesignsPanel recentDesigns={recentDesigns} onSelect={handleReopenDesign} />
          </div>
        </section>
      </main>
    </div>
  );
}
