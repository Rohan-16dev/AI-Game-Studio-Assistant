import type { GameIdea } from "@/lib/types";
import { GoogleGenerativeAI } from "@google/generative-ai";

function isValidStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isValidGameIdea(data: unknown): data is GameIdea {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const record = data as Record<string, unknown>;
  return (
    typeof record.title === "string" &&
    typeof record.story === "string" &&
    typeof record.mainCharacter === "string" &&
    typeof record.coverPrompt === "string" &&
    isValidStringArray(record.mechanics) &&
    isValidStringArray(record.enemies) &&
    typeof record.boss === "string" &&
    isValidStringArray(record.levels)
  );
}

function parseGameIdea(responseText: string): GameIdea {
  let parsed: unknown;

  try {
    parsed = JSON.parse(responseText);
  } catch (error) {
    throw new Error(`AI response is not valid JSON: ${(error as Error).message}`);
  }

  if (!isValidGameIdea(parsed)) {
    throw new Error("AI response does not match the required GameIdea shape.");
  }

  return parsed;
}

function extractTextFromResponse(response: unknown): string {
  if (typeof response !== "object" || response === null) {
    return "";
  }

  const responseObj = response as {
    response?: {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };
  };

  const candidate = responseObj.response?.candidates?.[0];
  if (!candidate?.content?.parts?.length) {
    return "";
  }

  return candidate.content.parts.map((part) => part?.text ?? "").join("");
}

export async function sendPromptToAI(prompt: string): Promise<GameIdea> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("AI service is not configured. Set GEMINI_API_KEY.");
  }

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({
    model: "gemini-3.1-flash-lite",
    generationConfig: { maxOutputTokens: 600 },
  });

  const result = await model.generateContent(prompt);
  const generatedText = extractTextFromResponse(result);

  if (!generatedText.trim()) {
    throw new Error("AI service returned an empty response.");
  }

  return parseGameIdea(generatedText);
}
