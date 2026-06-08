import { NextResponse } from "next/server";
import { InferenceClient } from "@huggingface/inference";

type GenerateImageRequestBody = {
  coverPrompt: string;
};

type ImageGenerationResponse = {
  imageData?: string;
  mimeType?: string;
  imageUrl?: string;
};

const HUGGING_FACE_MODEL = "stabilityai/stable-diffusion-xl-base-1.0";
const HUGGING_FACE_URL = `https://api-inference.huggingface.co/models/${HUGGING_FACE_MODEL}`;

function isValidRequestBody(data: unknown): data is GenerateImageRequestBody {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const record = data as Record<string, unknown>;
  const coverPrompt = record.coverPrompt;

  return typeof coverPrompt === "string" && coverPrompt.trim().length > 0;
}

async function generateCoverArt(prompt: string): Promise<ImageGenerationResponse> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  const hasApiKey = Boolean(apiKey);
  if (!apiKey) {
    console.error("Hugging Face image generation failed: missing API key.", {
      model: HUGGING_FACE_MODEL,
      endpoint: HUGGING_FACE_URL,
      hasApiKey,
    });
    throw new Error("AI service is not configured. Set HUGGINGFACE_API_KEY.");
  }

  console.info("Hugging Face image generation request", {
    model: HUGGING_FACE_MODEL,
    endpoint: HUGGING_FACE_URL,
    hasApiKey,
    prompt,
  });

  const client = new InferenceClient(apiKey);

  try {
    const blob = await client.textToImage(
      {
        model: HUGGING_FACE_MODEL,
        inputs: prompt,
      },
      { outputType: "blob" },
    );

    const contentType = blob.type || "image/png";
    const buffer = Buffer.from(await blob.arrayBuffer());
    const base64 = buffer.toString("base64");

    console.info("Hugging Face image generation success", {
      model: HUGGING_FACE_MODEL,
      endpoint: HUGGING_FACE_URL,
      contentType,
      prompt,
    });

    return {
      imageData: base64,
      mimeType: contentType,
    };
  } catch (error) {
    const err: any = error;
    console.error("Hugging Face image generation failed", {
      model: HUGGING_FACE_MODEL,
      endpoint: HUGGING_FACE_URL,
      prompt,
      error: err?.message ?? String(err),
    });

    try {
      console.error("Hugging Face image generation error details", {
        name: err?.name,
        message: err?.message,
        cause: err?.cause,
        serialized: JSON.stringify(err, Object.getOwnPropertyNames(err)),
      });
    } catch (stringifyError) {
      console.error("Failed to serialize Hugging Face error", { error: (stringifyError as Error).message });
    }

    throw new Error(
      `Hugging Face image generation failed: ${err?.message ?? "Unknown error from Hugging Face."}`,
    );
  }
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
