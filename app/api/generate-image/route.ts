import { NextResponse } from "next/server";

type GenerateImageRequestBody = {
  coverPrompt: string;
};

type ImageGenerationResponse = {
  imageData: string;
  mimeType: string;
};

const imageEndpoints = [
  "https://generativeai.googleapis.com/v1/images:generate",
  "https://generativemodels.googleapis.com/v1/images:generate",
];

const imageModels = ["models/image-bison-001", "image-bison-001"];

function isValidRequestBody(data: unknown): data is GenerateImageRequestBody {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const record = data as Record<string, unknown>;
  const coverPrompt = record.coverPrompt;

  return typeof coverPrompt === "string" && coverPrompt.trim().length > 0;
}

function parseImageResponse(json: unknown): string | null {
  if (typeof json !== "object" || json === null) {
    return null;
  }

  const response = json as Record<string, unknown>;
  const data = response.data;

  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const firstItem = data[0] as Record<string, unknown>;
  return (
    typeof firstItem.b64Json === "string" ? firstItem.b64Json :
    typeof firstItem.b64_json === "string" ? firstItem.b64_json :
    typeof firstItem.b64json === "string" ? firstItem.b64json :
    null
  );
}

async function generateCoverArt(prompt: string): Promise<ImageGenerationResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("AI service is not configured. Set GEMINI_API_KEY.");
  }

  for (const endpoint of imageEndpoints) {
    for (const model of imageModels) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt,
          size: "1024x1024",
          responseFormat: "b64_json",
        }),
      });

      const json = await response.json().catch(() => null);
      const imageData = parseImageResponse(json);

      if (response.ok && imageData) {
        return {
          imageData,
          mimeType: "image/png",
        };
      }

      const errorDetails = typeof json === "object" && json !== null ? json : { message: "Unknown image generation failure." };
      const message = response.ok
        ? "Image generation did not return valid data."
        : `Image generation failed (${response.status}): ${(errorDetails as Record<string, unknown>).error ?? (errorDetails as Record<string, unknown>).message ?? response.statusText}`;

      if (response.status === 404 || response.status === 400) {
        continue;
      }

      throw new Error(typeof message === "string" ? message : "Image generation failed.");
    }
  }

  throw new Error("Unable to generate cover art with the configured Gemini image endpoint.");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!isValidRequestBody(body)) {
    return NextResponse.json(
      { error: "Request body must include a coverPrompt string." },
      { status: 400 }
    );
  }

  try {
    const image = await generateCoverArt(body.coverPrompt);
    return NextResponse.json(image);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to generate cover art." },
      { status: 502 }
    );
  }
}
