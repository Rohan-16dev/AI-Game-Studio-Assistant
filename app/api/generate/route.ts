import { NextResponse } from "next/server";
import type { GameIdea } from "@/lib/types";
import { getFoundryKnowledge } from "@/lib/foundryIQ";
import { buildGameIdeaPrompt } from "@/lib/promptBuilder";
import { sendPromptToAI } from "@/lib/aiService";

type GenerateRequestBody = {
  genre: string;
  theme: string;
  audience: string;
};

const requiredFields = ["genre", "theme", "audience"] as const;

function isValidRequestBody(data: unknown): data is GenerateRequestBody {
  return (
    typeof data === "object" &&
    data !== null &&
    requiredFields.every(
      (field) => typeof (data as Record<string, unknown>)[field] === "string" &&
        ((data as Record<string, unknown>)[field] as string).trim().length > 0
    )
  );
}


export async function POST(request: Request) {
  const body = await request.json();

  if (!isValidRequestBody(body)) {
    return NextResponse.json(
      { error: "Request body must include genre, theme, and audience." },
      { status: 400 }
    );
  }

  const knowledge = getFoundryKnowledge(body.genre);
  const prompt = buildGameIdeaPrompt({
    genre: body.genre,
    theme: body.theme,
    audience: body.audience,
    genreConventions: knowledge.genreConventions,
    recommendedMechanics: knowledge.recommendedMechanics,
    referenceGames: knowledge.referenceGames,
    recommendedProgressionSystems: knowledge.recommendedProgressionSystems,
  });

  try {
    const idea = await sendPromptToAI(prompt);
    return NextResponse.json({ idea, knowledge });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Failed to generate game idea." },
      { status: 502 }
    );
  }
}
