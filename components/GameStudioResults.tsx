import SectionHeading from "@/components/SectionHeading";
import { GameStudioIdea } from "@/lib/types";

type GameStudioResultsProps = {
  idea: GameStudioIdea | null;
};

export default function GameStudioResults({ idea }: GameStudioResultsProps) {
  if (!idea) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-300 bg-white/80 p-6 text-sm text-zinc-600 shadow-sm dark:border-zinc-700 dark:bg-zinc-950/90 dark:text-zinc-300">
        Enter a genre, theme, and audience to generate your game studio briefing.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <SectionHeading title="Game concept" description="AI-generated high-level studio idea." />
        <div className="mt-6 space-y-4 text-sm text-zinc-700 dark:text-zinc-200">
          <div>
            <p className="font-semibold">Title</p>
            <p>{idea.title}</p>
          </div>
          <div>
            <p className="font-semibold">Story</p>
            <p>{idea.story}</p>
          </div>
          <div>
            <p className="font-semibold">Main character</p>
            <p>{idea.mainCharacter}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <SectionHeading title="Mechanics" />
          <ul className="mt-4 space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
            {idea.mechanics.map((mechanic) => (
              <li key={mechanic} className="rounded-2xl bg-zinc-100 p-3 dark:bg-zinc-900">
                {mechanic}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <SectionHeading title="Enemies" />
          <ul className="mt-4 space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
            {idea.enemies.map((enemy) => (
              <li key={enemy} className="rounded-2xl bg-zinc-100 p-3 dark:bg-zinc-900">
                {enemy}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <SectionHeading title="Boss fight" />
        <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-200">{idea.bossFight}</p>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <SectionHeading title="Level ideas" />
        <ul className="mt-4 space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
          {idea.levelIdeas.map((levelIdea) => (
            <li key={levelIdea} className="rounded-2xl bg-zinc-100 p-3 dark:bg-zinc-900">
              {levelIdea}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
