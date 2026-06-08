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
    "IMPORTANT:",
    "Return ONLY valid JSON.",
    "Do not use markdown.",
    "Do not use ```json code fences.",
    "Do not include explanations before or after the JSON.",
    "All strings must be valid JSON strings.",
    "The response must exactly match the required schema.",
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
    "Field requirements:",
    "  * story: maximum 120 words.",
    "  * mechanics: exactly 4 items.",
    "  * enemies: exactly 4 items.",
    "  * levels: exactly 4 items.",
    "  * boss: maximum 50 words.",
    "  * coverPrompt: maximum 80 words.",
    "  * Do not include any extra fields.",
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
    "Return a single JSON object with the required fields.",
    "Do not include any surrounding text or explanation."
  );

  return lines.join("\n");
}
