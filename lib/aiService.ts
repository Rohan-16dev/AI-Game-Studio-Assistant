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

function stripMarkdownCodeFences(text: string): string {
  let cleaned = text.trim();

  cleaned = cleaned.replace(/(^|\n)```(?:json)?\n([\s\S]*?)\n```/gi, "$1$2");
  cleaned = cleaned.replace(/(^|\n)~~~(?:json)?\n([\s\S]*?)\n~~~/gi, "$1$2");
  cleaned = cleaned.replace(/(^|\n)`([^`\n]+)`(\n|$)/g, "$1$2$3");

  return cleaned.trim();
}

function extractFirstJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) {
    return null;
  }

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < text.length; i++) {
    const char = text[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (char === "\\") {
      escape = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }

  return null;
}

function parseGameIdea(responseText: string): GameIdea {
  const cleanedResponse = stripMarkdownCodeFences(responseText);
  const jsonCandidate = extractFirstJsonObject(cleanedResponse) ?? cleanedResponse;
  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonCandidate);
  } catch (error) {
    console.error("Failed to parse AI response as JSON.", {
      rawResponse: responseText,
      cleanedResponse,
      jsonCandidate,
      error: (error as Error).message,
    });
    throw new Error(
      "The AI service returned an invalid response format. Please try again or refine your prompt."
    );
  }

  if (!isValidGameIdea(parsed)) {
    console.error("AI response does not match expected GameIdea shape.", {
      rawResponse: responseText,
      cleanedResponse,
      jsonCandidate,
      parsed,
    });
    throw new Error("The AI returned malformed game idea data. Please try again.");
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
    generationConfig: {
      maxOutputTokens: 3000,
      temperature: 0,
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });
  const generatedText = extractTextFromResponse(result);

  if (!generatedText.trim()) {
    console.error("AI service returned an empty response.", { result });
    throw new Error("AI service returned an empty response.");
  }

  return parseGameIdea(generatedText);
}
