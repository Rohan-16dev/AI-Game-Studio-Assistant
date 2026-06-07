"use client";

import type { FoundryKnowledge } from "@/lib/types";

type FoundryIQPanelProps = {
  knowledge: FoundryKnowledge;
};

const sections: Array<{ title: string; items: string[] }> = [];

export default function FoundryIQPanel({ knowledge }: FoundryIQPanelProps) {
  const cards = [
    { title: "Genre conventions", items: knowledge.genreConventions },
    { title: "Mechanics", items: knowledge.recommendedMechanics },
    { title: "Progression systems", items: knowledge.recommendedProgressionSystems },
    { title: "Reference games", items: knowledge.referenceGames },
  ];

  return (
    <div className="space-y-4 rounded-[2rem] border border-zinc-200 bg-white/90 p-6 shadow-xl shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-950/90 dark:shadow-black/20">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-700 dark:text-violet-300">Foundry IQ</p>
        <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-100">Foundry IQ Knowledge Retrieval</h2>
        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          This panel surfaces the genre guidance, mechanics, progression systems, and reference games used to enrich the AI prompt.
        </p>
      </div>

      <div className="space-y-3">
        {cards.map((card) => (
          <details
            key={card.title}
            className="group overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 transition hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-zinc-900 outline-none transition dark:text-zinc-100">
              <span>{card.title}</span>
              <span className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 transition group-open:bg-violet-700 group-open:text-white dark:bg-zinc-800 dark:text-zinc-300 dark:group-open:bg-violet-600">View</span>
            </summary>
            <div className="border-t border-zinc-200 px-5 py-4 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
              <ul className="space-y-2">
                {card.items.map((item) => (
                  <li key={item} className="rounded-2xl bg-white p-3 shadow-sm dark:bg-zinc-950">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
