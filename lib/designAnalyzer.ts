import type { GameIdea } from "@/lib/types";

export type GameDesignScore = {
  score: number;
  explanation: string;
};

export type GameDesignAnalysis = {
  creativity: GameDesignScore;
  replayability: GameDesignScore;
  marketPotential: GameDesignScore;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function uniqueItemsCount(items: string[]): number {
  return new Set(items.map((item) => item.toLowerCase().trim())).size;
}

function scoreFromCount(count: number, thresholds: number[], weights: number[]): number {
  return thresholds.reduce((acc, threshold, index) => {
    if (count >= threshold) {
      return acc + weights[index];
    }
    return acc;
  }, 0);
}

function hasStrongVisualPrompt(prompt: string): boolean {
  const visualKeywords = [
    "cinematic",
    "vibrant",
    "moody",
    "dramatic",
    "epic",
    "detailed",
    "surreal",
    "stylized",
    "photorealistic",
    "dynamic",
    "fantasy",
    "futuristic",
    "neon",
    "dark",
    "glowing",
  ];

  const normalized = prompt.toLowerCase();
  return visualKeywords.some((keyword) => normalized.includes(keyword));
}

function getKeyPhraseStrength(text: string): number {
  const phrases = ["first-person", "open world", "roguelike", "boss fight", "narrative", "multiplayer", "co-op", "metroidvania", "dynamic", "strategy", "puzzle"];
  const normalized = text.toLowerCase();
  return phrases.reduce((acc, phrase) => (normalized.includes(phrase) ? acc + 5 : acc), 0);
}

export function analyzeGameIdea(idea: GameIdea): GameDesignAnalysis {
  const mechanicsCount = idea.mechanics.length;
  const enemiesCount = idea.enemies.length;
  const levelsCount = idea.levels.length;
  const titleLength = idea.title.trim().split(/\s+/).length;
  const storyLength = idea.story.trim().split(/\s+/).length;
  const uniqueMechanics = uniqueItemsCount(idea.mechanics);
  const uniqueEnemies = uniqueItemsCount(idea.enemies);
  const storyOriginality = Math.min(20, Math.max(0, Math.floor((new Set(idea.story.toLowerCase().split(/\W+/)).size / Math.max(1, storyLength)) * 100) - 50)) ;

  const creativityBase = 35;
  const creativityFromMechanics = scoreFromCount(mechanicsCount, [2, 4, 6], [10, 10, 10]);
  const creativityFromUniqueMechanics = scoreFromCount(uniqueMechanics, [2, 4], [5, 5]);
  const creativityFromVisualPrompt = hasStrongVisualPrompt(idea.coverPrompt) ? 15 : 5;
  const creativityFromTitle = titleLength >= 4 ? 10 : 5;
  const creativityScore = clampScore(
    creativityBase + creativityFromMechanics + creativityFromUniqueMechanics + creativityFromVisualPrompt + creativityFromTitle + storyOriginality
  );

  const replayBase = 25;
  const replayFromMechanics = scoreFromCount(mechanicsCount, [2, 4, 6], [10, 10, 10]);
  const replayFromLevels = scoreFromCount(levelsCount, [2, 4, 6], [10, 10, 10]);
  const replayFromEnemies = scoreFromCount(enemiesCount, [2, 4], [5, 10]);
  const replayFromBoss = idea.boss.trim().length > 0 ? 10 : 0;
  const replayFromProgressionLanguage = getKeyPhraseStrength(idea.story) > 0 ? 5 : 0;
  const replayabilityScore = clampScore(
    replayBase + replayFromMechanics + replayFromLevels + replayFromEnemies + replayFromBoss + replayFromProgressionLanguage
  );

  const marketBase = 30;
  const marketFromTitle = idea.title.length > 20 ? 10 : 5;
  const marketFromIntroduction = storyLength > 40 ? 10 : 5;
  const marketFromMechanics = scoreFromCount(mechanicsCount, [2, 4], [10, 15]);
  const marketFromVisualPromptQuality = hasStrongVisualPrompt(idea.coverPrompt) ? 10 : 5;
  const marketFromReferenceAppeal = getKeyPhraseStrength([idea.title, idea.story, idea.coverPrompt].join(" "));
  const marketPotentialScore = clampScore(
    marketBase + marketFromTitle + marketFromIntroduction + marketFromMechanics + marketFromVisualPromptQuality + marketFromReferenceAppeal
  );

  return {
    creativity: {
      score: creativityScore,
      explanation: `Creativity is based on the number of distinct mechanics, the strength of the visual cover prompt, and whether the title and story feel rich and varied. This idea has ${mechanicsCount} mechanic${mechanicsCount === 1 ? "" : "s"} and ${uniqueMechanics} unique mechanic${uniqueMechanics === 1 ? "" : "s"}, plus ${hasStrongVisualPrompt(idea.coverPrompt) ? "a vivid cover direction" : "a simpler cover prompt"}.`,
    },
    replayability: {
      score: replayabilityScore,
      explanation: `Replayability is driven by mechanics depth, level variety, enemy diversity, and a defined boss encounter. This idea includes ${levelsCount} level${levelsCount === 1 ? "" : "s"}, ${enemiesCount} enemy type${enemiesCount === 1 ? "" : "s"}, and ${idea.boss.trim().length > 0 ? "a named boss" : "no boss specified"}.`,
    },
    marketPotential: {
      score: marketPotentialScore,
      explanation: `Market potential reflects clear concept communication, strong hooks, and visual appeal. The title and story length suggest ${titleLength >= 4 ? "a clear concept" : "a concise pitch"}, and the cover art prompt adds ${hasStrongVisualPrompt(idea.coverPrompt) ? "distinct visual appeal" : "basic visual direction"}.`,
    },
  };
}
