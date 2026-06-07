export type EnrichedGameDesignContext = {
  genre: string;
  theme?: string;
  audience?: string;
  genreConventions?: string[];
  recommendedMechanics?: string[];
  referenceGames?: string[];
  recommendedProgressionSystems?: string[];
  notes?: string;
};

export function buildGameIdeaPrompt(context: EnrichedGameDesignContext): string {
  const lines: string[] = [
    "You are an expert game designer.",
    "Use the enriched game design context below to generate a complete game concept.",
    "Respond with valid JSON only, without markdown, explanations, or extra text.",
    "The JSON object must include these fields:",
    "  - title",
    "  - story",
    "  - mainCharacter",
    "  - coverPrompt",
    "  - mechanics",
    "  - enemies",
    "  - boss",
    "  - levels",
    "",
    "Enriched game design context:",
    `genre: ${context.genre}`,
  ];

  if (context.theme) {
    lines.push(`theme: ${context.theme}`);
  }

  if (context.audience) {
    lines.push(`audience: ${context.audience}`);
  }

  if (context.genreConventions?.length) {
    lines.push("genre conventions:");
    context.genreConventions.forEach((item) => lines.push(`- ${item}`));
  }

  if (context.recommendedMechanics?.length) {
    lines.push("recommended mechanics:");
    context.recommendedMechanics.forEach((item) => lines.push(`- ${item}`));
  }

  if (context.referenceGames?.length) {
    lines.push("reference games:");
    context.referenceGames.forEach((item) => lines.push(`- ${item}`));
  }

  if (context.recommendedProgressionSystems?.length) {
    lines.push("recommended progression systems:");
    context.recommendedProgressionSystems.forEach((item) => lines.push(`- ${item}`));
  }

  if (context.notes) {
    lines.push("notes:");
    lines.push(context.notes);
  }

  lines.push(
    "",
    "For the coverPrompt field, create a detailed AI image prompt describing the main character, environment, art style, mood, lighting, and composition.",
    "Return a single JSON object with the required fields."
  );

  return lines.join("\n");
}
