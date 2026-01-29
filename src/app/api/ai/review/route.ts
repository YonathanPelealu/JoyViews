import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getProvider, isValidProvider, isValidModel } from "@/lib/ai/providers";
import { reviewRequestSchema } from "@/lib/utils/validators";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limit";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimitResult = await checkRateLimit(`review:${session.user.id}`);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      );
    }

    const body = await request.json();
    const validationResult = reviewRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { code, language, context, focusAreas, provider, model, title } =
      validationResult.data;

    // Validate provider and model
    if (!isValidProvider(provider)) {
      return NextResponse.json(
        { error: `Invalid provider: ${provider}` },
        { status: 400 }
      );
    }

    if (!isValidModel(provider, model)) {
      return NextResponse.json(
        { error: `Invalid model for ${provider}: ${model}` },
        { status: 400 }
      );
    }

    // Get AI provider and perform review
    const aiProvider = getProvider(provider);
    const result = await aiProvider.review(
      { code, language, context, focusAreas },
      model
    );

    // Save review to database
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        title: title || `Code Review - ${new Date().toLocaleDateString()}`,
        code,
        language,
        provider,
        model,
        result: JSON.stringify(result),
        sourceType: "PASTE",
      },
    });

    return NextResponse.json(
      {
        id: review.id,
        result,
      },
      { headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    console.error("Review error:", error);

    if (error instanceof Error) {
      // Handle specific API errors
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "AI provider configuration error" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to process review" },
      { status: 500 }
    );
  }
}
