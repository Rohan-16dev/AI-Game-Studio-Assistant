import knowledgeBase from "@/data/foundryKnowledge.json";
import type { FoundryKnowledge } from "@/lib/types";

type KnowledgeRecord = Record<string, FoundryKnowledge>;

const knowledgeIndex = knowledgeBase as KnowledgeRecord;

export function getFoundryKnowledge(genre: string): FoundryKnowledge {
  const lookupKey = genre.trim().toLowerCase();
  const cached = knowledgeIndex[lookupKey];

  if (cached) {
    return cached;
  }

  return {
    genreConventions: [
      `Core ${genre} design principles`,
      "Balance pacing and reward systems",
      "Use a strong hook that fits the genre",
    ],
    recommendedMechanics: [
      "Player empowerment loops",
      "Clear progression feedback",
      "Accessible onboarding mechanics",
    ],
    referenceGames: [
      `Classic ${genre} example`,
      "Genre-defining experience",
      "Modern design reference",
    ],
    recommendedProgressionSystems: [
      "Tiered unlocks",
      "Skill and equipment growth",
      "Milestone-based advancement",
    ],
  };
}
