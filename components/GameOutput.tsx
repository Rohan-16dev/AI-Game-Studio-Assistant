"use client";

import { useEffect, useState } from "react";
import CopyButton from "@/components/CopyButton";
import { exportGameIdeaPDF } from "@/lib/pdfExport";
import { GameIdea } from "@/lib/types";

type GameOutputProps = {
  idea: GameIdea;
};

export default function GameOutput({ idea }: GameOutputProps) {
  const copyText = `Title: ${idea.title}\n\nStory:\n${idea.story}\n\nMain Character:\n${idea.mainCharacter}\n\nMechanics:\n${idea.mechanics.map((mechanic) => `- ${mechanic}`).join("\n")}\n\nEnemies:\n${idea.enemies.map((enemy) => `- ${enemy}`).join("\n")}\n\nBoss:\n${idea.boss}\n\nLevels:\n${idea.levels.map((level) => `- ${level}`).join("\n")}\n`;

  const [coverImageSrc, setCoverImageSrc] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    setCoverImageSrc(null);
    setImageError(null);
    setIsGeneratingImage(false);
  }, [idea.coverPrompt]);

  async function handleGenerateCoverArt() {
    setImageError(null);
    setIsGeneratingImage(true);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coverPrompt: idea.coverPrompt }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to generate cover art.");
      }

      const imageSrc = `data:${data.mimeType};base64,${data.imageData}`;
      setCoverImageSrc(imageSrc);
    } catch (err) {
      setImageError((err as Error).message || "Unable to generate cover art.");
      setCoverImageSrc(null);
    } finally {
      setIsGeneratingImage(false);
    }
  }

  return (
    <div className="space-y-6 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/40 transition dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-700 dark:text-violet-300">Game concept</p>
          <h2 className="text-3xl font-semibold text-zinc-950 dark:text-zinc-100">{idea.title}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <CopyButton text={copyText} />
          <button
            type="button"
            onClick={() => exportGameIdeaPDF(idea)}
            className="inline-flex items-center justify-center rounded-full bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            Export PDF
          </button>
          <button
            type="button"
            onClick={handleGenerateCoverArt}
            disabled={isGeneratingImage}
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            {isGeneratingImage ? "Generating cover art…" : "Generate Cover Art"}
          </button>
        </div>
      </div>

      <div className="space-y-5 text-sm text-zinc-700 dark:text-zinc-200">
        <section className="rounded-3xl bg-zinc-50 p-5 dark:bg-zinc-900">
          <h3 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">Story</h3>
          <p>{idea.story}</p>
        </section>

        <section className="rounded-3xl bg-zinc-50 p-5 dark:bg-zinc-900">
          <h3 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">Main Character</h3>
          <p>{idea.mainCharacter}</p>
        </section>

        <section className="rounded-3xl bg-zinc-50 p-5 dark:bg-zinc-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">Game Cover Concept</h3>
              <p>{idea.coverPrompt}</p>
            </div>
            {coverImageSrc ? (
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
                Cover art ready
              </span>
            ) : null}
          </div>
          {imageError ? (
            <p className="mt-4 rounded-3xl bg-red-500/10 p-4 text-sm text-red-100">{imageError}</p>
          ) : null}
          {coverImageSrc ? (
            <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950">
              <img
                src={coverImageSrc}
                alt="Generated cover art"
                className="h-auto w-full object-cover"
              />
            </div>
          ) : null}
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-3xl bg-zinc-50 p-5 dark:bg-zinc-900">
            <h3 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">Mechanics</h3>
            <ul className="space-y-2">
              {idea.mechanics.map((mechanic) => (
                <li key={mechanic} className="rounded-2xl bg-white p-3 text-zinc-700 shadow-sm dark:bg-zinc-950 dark:text-zinc-200">
                  {mechanic}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl bg-zinc-50 p-5 dark:bg-zinc-900">
            <h3 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">Enemies</h3>
            <ul className="space-y-2">
              {idea.enemies.map((enemy) => (
                <li key={enemy} className="rounded-2xl bg-white p-3 text-zinc-700 shadow-sm dark:bg-zinc-950 dark:text-zinc-200">
                  {enemy}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="rounded-3xl bg-zinc-50 p-5 dark:bg-zinc-900">
          <h3 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">Boss Fight</h3>
          <p>{idea.boss}</p>
        </section>

        <section className="rounded-3xl bg-zinc-50 p-5 dark:bg-zinc-900">
          <h3 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">Levels</h3>
          <ul className="space-y-2">
            {idea.levels.map((level) => (
              <li key={level} className="rounded-2xl bg-white p-3 text-zinc-700 shadow-sm dark:bg-zinc-950 dark:text-zinc-200">
                {level}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
