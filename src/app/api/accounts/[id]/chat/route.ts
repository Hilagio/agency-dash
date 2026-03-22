/**
 * POST /api/accounts/[id]/chat
 *
 * Streaming chat endpoint. The AI reasons exclusively from the account's
 * active constraint snapshot. It does NOT have general Google Ads knowledge
 * beyond what's in the context — it is constraint-aware, not a generic chatbot.
 */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { BUCKET_LABELS, BUCKET_DESCRIPTIONS } from "@/lib/engine/types";

type Params = { params: Promise<{ id: string }> };

const client = new Anthropic();

function buildSystemPrompt(
  accountName: string,
  governingConstraint: string,
  constraintReason: string,
  bucketScores: Record<string, number>,
  topActions: Array<{ title: string; description: string; impact: string }>
): string {
  const bucketSummary = Object.entries(bucketScores)
    .map(([bucket, score]) => {
      const label = BUCKET_LABELS[bucket as keyof typeof BUCKET_LABELS] ?? bucket;
      const desc = BUCKET_DESCRIPTIONS[bucket as keyof typeof BUCKET_DESCRIPTIONS] ?? "";
      return `  - ${label} (${desc}): ${score}/100`;
    })
    .join("\n");

  const actionSummary = topActions
    .slice(0, 4)
    .map((a, i) => `  ${i + 1}. [${a.impact}] ${a.title}`)
    .join("\n");

  return `You are a senior Google Ads optimization advisor for the agency account: ${accountName}.

You operate within a Constraint Optimization System. Your job is to help the specialist understand and address the GOVERNING CONSTRAINT — the single biggest bottleneck blocking account performance. Do NOT give generic optimization advice. Every response must connect back to the constraint.

OPTIMIZATION PHILOSOPHY:
Accounts are systems. There is always one governing constraint. Fix it before touching anything else. The sequence is: Measurement → Traffic → Website Conversion → Funnel → Business Economics.

CURRENT ACCOUNT STATE:
Governing Constraint: ${BUCKET_LABELS[governingConstraint as keyof typeof BUCKET_LABELS] ?? governingConstraint}
Constraint Reason: ${constraintReason}

Bucket Health Scores (higher = healthier):
${bucketSummary}

Top Recommended Actions:
${actionSummary}

RULES FOR YOUR RESPONSES:
1. Always anchor your advice to the governing constraint. If the constraint is MEASUREMENT, don't talk about bid strategies.
2. If a specialist asks about something outside the governing constraint, acknowledge it briefly but redirect: "That matters, but fixing [constraint] first will have more impact."
3. Be specific. Name the signal, name the fix, name the expected outcome.
4. If the governing constraint requires client action (e.g. CRO, offline conversion setup), say so clearly and mark it as an escalation.
5. Keep responses concise. One problem, one cause, one fix per message.
6. Never say "it depends" without giving the most likely answer first.`;
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const { message, sessionId } = await req.json() as {
    message: string;
    sessionId?: string;
  };

  // Load account + latest snapshot + active agency SOPs
  const [account, sops] = await Promise.all([
    prisma.account.findUnique({ where: { id } }),
    prisma.agencySop.findMany({ where: { isActive: true }, orderBy: { createdAt: "asc" } }),
  ]);
  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const snapshot = await prisma.constraintSnapshot.findFirst({
    where: { accountId: id },
    orderBy: { createdAt: "desc" },
    include: { actions: { take: 4, orderBy: { impact: "asc" } } },
  });

  if (!snapshot) {
    return NextResponse.json(
      { error: "No constraint snapshot found. Run a scoring first." },
      { status: 400 }
    );
  }

  // Get or create chat session
  let session;
  if (sessionId) {
    session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } },
    });
  }
  if (!session) {
    session = await prisma.chatSession.create({
      data: { accountId: id },
      include: { messages: true },
    });
  }

  // Save user message
  await prisma.chatMessage.create({
    data: { sessionId: session.id, role: "user", content: message },
  });

  const bucketScores: Record<string, number> = {
    MEASUREMENT: snapshot.scoreMeasurement,
    TRAFFIC:     snapshot.scoreTraffic,
    CONVERSION:  snapshot.scoreConversion,
    FUNNEL:      snapshot.scoreFunnel,
    ECONOMICS:   snapshot.scoreEconomics,
  };

  const sopContext = sops.length > 0
    ? `\n\nAGENCY STANDARD OPERATING PROCEDURES (always follow these):\n${
        sops.map(s => `--- ${s.title} ---\n${s.content}`).join("\n\n").slice(0, 5000)
      }`
    : "";

  const clientBriefContext = account.clientContext
    ? `\n\nCLIENT BRIEF (provided by agency):\n${account.clientContext}`
    : "";

  const systemPrompt = buildSystemPrompt(
    account.name,
    snapshot.governingConstraint,
    snapshot.constraintReason,
    bucketScores,
    snapshot.actions.map((a) => ({
      title: a.title,
      description: a.description,
      impact: a.impact,
    }))
  ) + clientBriefContext + sopContext;

  // Build message history for context
  const history = (session.messages ?? []).map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // Stream response from Claude
  const encoder = new TextEncoder();
  let fullResponse = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          system: systemPrompt,
          messages: [
            ...history,
            { role: "user", content: message },
          ],
        });

        for await (const chunk of anthropicStream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            const text = chunk.delta.text;
            fullResponse += text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
        }

        // Save assistant message
        await prisma.chatMessage.create({
          data: {
            sessionId: session!.id,
            role: "assistant",
            content: fullResponse,
          },
        });

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ done: true, sessionId: session!.id })}\n\n`)
        );
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Stream error";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
