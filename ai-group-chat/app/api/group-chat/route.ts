import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

type Provider = "user" | "gpt" | "gemini" | "claude" | "codex" | "system";
type AiProvider = "gpt" | "gemini" | "claude" | "codex";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  provider: Provider;
  content: string;
  ok?: boolean;
  createdAt: string;
};

type RequestBody = {
  message?: string;
  history?: ChatMessage[];
  mode?: "all" | AiProvider;
};

type ProviderResult = {
  provider: AiProvider;
  ok: boolean;
  content: string;
};

const BASE_SYSTEM_PROMPT = `
너는 사용자의 개인 AI 단톡방에 참여한 AI다.
답변은 한국어로 한다.
사용자는 고등학생이므로 설명은 이해하기 쉽게 하되, 수준은 낮추지 않는다.
사용자가 코딩, 사업, 기획, 공부를 물으면 실행 가능한 방식으로 답한다.
다른 AI들도 함께 답변하므로, 네 관점과 장점을 살려 중복을 줄이고 도움이 되는 답을 한다.
위험하거나 불법적인 실행 방법은 제공하지 않는다.
`.trim();

const GPT_SYSTEM_PROMPT = `
${BASE_SYSTEM_PROMPT}

너는 GPT 참가자다.
역할:
- 빠른 정리
- 현실적인 판단
- 전체 방향성 제시
- 사용자의 의도를 파악해서 실행 순서로 정리
`.trim();

const CODEX_SYSTEM_PROMPT = `
${BASE_SYSTEM_PROMPT}

너는 Codex 참가자다.
역할:
- 코딩 구현 담당
- 버그 가능성 점검
- 파일 구조, 명령어, 타입 오류, 보안 문제 확인
- 사용자의 개발 요청을 실제 코드 중심으로 정리
답변은 개발자처럼 구체적으로 하되, 너무 길게 늘어놓지 않는다.
`.trim();

const GEMINI_SYSTEM_PROMPT = `
${BASE_SYSTEM_PROMPT}

너는 Gemini 참가자다.
역할:
- 넓은 관점
- 아이디어 확장
- 사용자 경험과 제품 방향성 제안
- 놓친 가능성 찾기
`.trim();

const CLAUDE_SYSTEM_PROMPT = `
${BASE_SYSTEM_PROMPT}

너는 Claude 참가자다.
역할:
- 깊은 분석
- 문장과 구조 정리
- 리스크와 논리적 허점 점검
- 차분하고 설득력 있는 답변
`.trim();

function buildConversationText(history: ChatMessage[] = [], latestMessage: string) {
  const recentHistory = history.slice(-20);

  const formattedHistory = recentHistory
    .map((message) => {
      const name =
        message.provider === "gpt"
          ? "GPT"
          : message.provider === "gemini"
            ? "Gemini"
            : message.provider === "claude"
              ? "Claude"
              : message.provider === "codex"
                ? "Codex"
                : message.provider === "system"
                  ? "System"
                  : "User";

      return `${name}: ${message.content}`;
    })
    .join("\n\n");

  return `
이전 대화:
${formattedHistory || "없음"}

사용자의 새 메시지:
${latestMessage}
`.trim();
}

function getFallbackError(provider: AiProvider, message: string): ProviderResult {
  return {
    provider,
    ok: false,
    content: message,
  };
}

function extractOpenAIText(response: unknown): string {
  const maybe = response as {
    output_text?: string;
    output?: Array<{
      content?: Array<{
        type?: string;
        text?: string;
      }>;
    }>;
  };

  if (typeof maybe.output_text === "string" && maybe.output_text.trim()) {
    return maybe.output_text.trim();
  }

  const chunks: string[] = [];

  for (const item of maybe.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && typeof content.text === "string") {
        chunks.push(content.text);
      }
    }
  }

  return chunks.join("\n").trim() || "응답을 텍스트로 변환하지 못했습니다.";
}

function extractClaudeText(message: unknown): string {
  const maybe = message as {
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  };

  const chunks: string[] = [];

  for (const block of maybe.content ?? []) {
    if (block.type === "text" && typeof block.text === "string") {
      chunks.push(block.text);
    }
  }

  return chunks.join("\n").trim() || "Claude 응답을 텍스트로 변환하지 못했습니다.";
}

async function askOpenAIAsProvider(
  provider: "gpt" | "codex",
  prompt: string,
): Promise<ProviderResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return getFallbackError(provider, "OPENAI_API_KEY가 .env.local에 없습니다.");
  }

  try {
    const client = new OpenAI({ apiKey });

    const systemPrompt = provider === "codex" ? CODEX_SYSTEM_PROMPT : GPT_SYSTEM_PROMPT;
    const model =
      provider === "codex"
        ? process.env.CODEX_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini"
        : process.env.OPENAI_MODEL || "gpt-4.1-mini";

    const response = await client.responses.create({
      model,
      instructions: systemPrompt,
      input: prompt,
    });

    return {
      provider,
      ok: true,
      content: extractOpenAIText(response),
    };
  } catch (error) {
    return getFallbackError(
      provider,
      error instanceof Error ? error.message : "OpenAI 호출 중 알 수 없는 오류가 발생했습니다.",
    );
  }
}

async function askGemini(prompt: string): Promise<ProviderResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return getFallbackError("gemini", "GEMINI_API_KEY가 .env.local에 없습니다.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
      contents: `${GEMINI_SYSTEM_PROMPT}\n\n${prompt}`,
    });

    return {
      provider: "gemini",
      ok: true,
      content: response.text?.trim() || "Gemini 응답이 비어 있습니다.",
    };
  } catch (error) {
    return getFallbackError(
      "gemini",
      error instanceof Error ? error.message : "Gemini 호출 중 알 수 없는 오류가 발생했습니다.",
    );
  }
}

async function askClaude(prompt: string): Promise<ProviderResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return getFallbackError("claude", "ANTHROPIC_API_KEY가 .env.local에 없습니다.");
  }

  try {
    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
      max_tokens: 1400,
      system: CLAUDE_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return {
      provider: "claude",
      ok: true,
      content: extractClaudeText(message),
    };
  } catch (error) {
    return getFallbackError(
      "claude",
      error instanceof Error ? error.message : "Claude 호출 중 알 수 없는 오류가 발생했습니다.",
    );
  }
}

function getTasks(mode: "all" | AiProvider, prompt: string) {
  if (mode === "gpt") return [askOpenAIAsProvider("gpt", prompt)];
  if (mode === "gemini") return [askGemini(prompt)];
  if (mode === "claude") return [askClaude(prompt)];
  if (mode === "codex") return [askOpenAIAsProvider("codex", prompt)];

  return [
    askOpenAIAsProvider("gpt", prompt),
    askGemini(prompt),
    askClaude(prompt),
    askOpenAIAsProvider("codex", prompt),
  ];
}

function getProviderByIndex(mode: "all" | AiProvider, index: number): AiProvider {
  if (mode !== "all") return mode;

  const providers: AiProvider[] = ["gpt", "gemini", "claude", "codex"];
  return providers[index] ?? "gpt";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;

    const message = body.message?.trim();
    const history = Array.isArray(body.history) ? body.history : [];
    const mode = body.mode || "all";

    if (!message) {
      return Response.json(
        {
          ok: false,
          error: "메시지가 비어 있습니다.",
        },
        { status: 400 },
      );
    }

    const prompt = buildConversationText(history, message);
    const tasks = getTasks(mode, prompt);
    const settled = await Promise.allSettled(tasks);

    const results: ProviderResult[] = settled.map((item, index) => {
      if (item.status === "fulfilled") {
        return item.value;
      }

      return {
        provider: getProviderByIndex(mode, index),
        ok: false,
        content:
          item.reason instanceof Error
            ? item.reason.message
            : "AI 호출 중 알 수 없는 오류가 발생했습니다.",
      };
    });

    return Response.json({
      ok: true,
      results,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "서버 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
