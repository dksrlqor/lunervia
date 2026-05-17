"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Provider = "user" | "gpt" | "gemini" | "claude" | "codex" | "system";
type AiProvider = "gpt" | "gemini" | "claude" | "codex";
type Mode = "all" | AiProvider;

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  provider: Provider;
  content: string;
  ok?: boolean;
  createdAt: string;
};

type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};

type ApiResult = {
  provider: AiProvider;
  ok: boolean;
  content: string;
};

const STORAGE_KEY = "ai-group-chat-conversations-v2";
const ACTIVE_ID_KEY = "ai-group-chat-active-id-v2";
const EMPTY_MESSAGES: ChatMessage[] = [];

const providerLabel: Record<Provider, string> = {
  user: "나",
  gpt: "GPT",
  gemini: "Gemini",
  claude: "Claude",
  codex: "Codex",
  system: "System",
};

const providerShortLabel: Record<Provider, string> = {
  user: "ME",
  gpt: "GPT",
  gemini: "GM",
  claude: "CL",
  codex: "CX",
  system: "!",
};

const providerDescription: Record<Provider, string> = {
  user: "사용자 메시지",
  gpt: "빠른 정리와 실행 중심",
  gemini: "넓은 관점과 아이디어",
  claude: "깊은 분석과 문장 정리",
  codex: "코딩 구현과 버그 점검",
  system: "시스템 알림",
};

const providerStyle: Record<Provider, string> = {
  user: "border-sky-300/30 bg-sky-400/10",
  gpt: "border-emerald-300/30 bg-emerald-400/10",
  gemini: "border-violet-300/30 bg-violet-400/10",
  claude: "border-orange-300/30 bg-orange-400/10",
  codex: "border-cyan-300/30 bg-cyan-400/10",
  system: "border-red-300/30 bg-red-400/10",
};

const logoSrc: Partial<Record<Provider, string>> = {
  gpt: "/logos/gpt.svg",
  gemini: "/logos/gemini.svg",
  claude: "/logos/claude.svg",
  codex: "/logos/codex.svg",
};

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function createNewConversation(): Conversation {
  const now = nowIso();

  return {
    id: makeId(),
    title: "새 AI 회의",
    messages: [],
    archived: false,
    createdAt: now,
    updatedAt: now,
  };
}

function formatTime(value: string) {
  try {
    return new Intl.DateTimeFormat("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function makeTitleFromMessage(content: string) {
  const compact = content.replace(/\s+/g, " ").trim();
  if (!compact) return "새 AI 회의";
  return compact.length > 28 ? `${compact.slice(0, 28)}...` : compact;
}

function ProviderLogo({ provider }: { provider: Provider }) {
  const [failed, setFailed] = useState(false);
  const src = logoSrc[provider];

  if (src && !failed) {
    return (
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/10">
        <Image
          src={src}
          alt={`${providerLabel[provider]} logo`}
          width={28}
          height={28}
          onError={() => setFailed(true)}
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-xs font-black text-white">
      {providerShortLabel[provider]}
    </div>
  );
}

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("all");
  const [showArchived, setShowArchived] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const activeConversation = useMemo(() => {
    return conversations.find((conversation) => conversation.id === activeId) ?? conversations[0];
  }, [activeId, conversations]);

  const visibleConversations = useMemo(() => {
    return conversations
      .filter((conversation) => conversation.archived === showArchived)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [conversations, showArchived]);

  const messages = activeConversation?.messages ?? EMPTY_MESSAGES;
  const hasMessages = messages.length > 0;

  const modeLabel = useMemo(() => {
    if (mode === "all") return "전체 AI 호출";
    if (mode === "gpt") return "GPT만 호출";
    if (mode === "gemini") return "Gemini만 호출";
    if (mode === "claude") return "Claude만 호출";
    return "Codex만 호출";
  }, [mode]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      const savedActiveId = window.localStorage.getItem(ACTIVE_ID_KEY);

      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Conversation[];

          if (Array.isArray(parsed) && parsed.length > 0) {
            setConversations(parsed);
            setActiveId(savedActiveId || parsed[0].id);
            return;
          }
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
          window.localStorage.removeItem(ACTIVE_ID_KEY);
        }
      }

      const first = createNewConversation();
      setConversations([first]);
      setActiveId(first.id);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

  useEffect(() => {
    if (activeId) {
      window.localStorage.setItem(ACTIVE_ID_KEY, activeId);
    }
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  function updateConversation(
    conversationId: string,
    updater: (conversation: Conversation) => Conversation,
  ) {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId ? updater(conversation) : conversation,
      ),
    );
  }

  function startNewChat() {
    const conversation = createNewConversation();
    setConversations((prev) => [conversation, ...prev]);
    setActiveId(conversation.id);
    setShowArchived(false);
    setInput("");
  }

  function deleteConversation(conversationId: string) {
    const ok = window.confirm("이 대화를 삭제할까요? 삭제하면 복구할 수 없습니다.");
    if (!ok) return;

    setConversations((prev) => {
      const next = prev.filter((conversation) => conversation.id !== conversationId);

      if (next.length === 0) {
        const fresh = createNewConversation();
        setActiveId(fresh.id);
        setShowArchived(false);
        return [fresh];
      }

      if (activeId === conversationId) {
        setActiveId(next[0].id);
      }

      return next;
    });
  }

  function archiveConversation(conversationId: string) {
    updateConversation(conversationId, (conversation) => ({
      ...conversation,
      archived: true,
      updatedAt: nowIso(),
    }));

    const nextActive = conversations.find(
      (conversation) => conversation.id !== conversationId && !conversation.archived,
    );

    if (activeId === conversationId) {
      if (nextActive) {
        setActiveId(nextActive.id);
      } else {
        const fresh = createNewConversation();
        setConversations((prev) => [fresh, ...prev]);
        setActiveId(fresh.id);
      }
    }
  }

  function restoreConversation(conversationId: string) {
    updateConversation(conversationId, (conversation) => ({
      ...conversation,
      archived: false,
      updatedAt: nowIso(),
    }));

    setActiveId(conversationId);
    setShowArchived(false);
  }

  function clearCurrentMessages() {
    if (!activeConversation) return;

    const ok = window.confirm("현재 대화의 메시지만 전부 비울까요?");
    if (!ok) return;

    updateConversation(activeConversation.id, (conversation) => ({
      ...conversation,
      messages: [],
      title: "새 AI 회의",
      updatedAt: nowIso(),
    }));
  }

  function deleteMessage(messageId: string) {
    if (!activeConversation) return;

    updateConversation(activeConversation.id, (conversation) => ({
      ...conversation,
      messages: conversation.messages.filter((message) => message.id !== messageId),
      updatedAt: nowIso(),
    }));
  }

  async function sendMessage() {
    if (!activeConversation) return;

    const content = input.trim();

    if (!content || isLoading) return;

    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      provider: "user",
      content,
      createdAt: nowIso(),
    };

    const historyBeforeSend = activeConversation.messages;
    const nextMessages = [...historyBeforeSend, userMessage];
    const shouldRename = !activeConversation.messages.length;

    updateConversation(activeConversation.id, (conversation) => ({
      ...conversation,
      title: shouldRename ? makeTitleFromMessage(content) : conversation.title,
      messages: nextMessages,
      updatedAt: nowIso(),
    }));

    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/group-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          history: historyBeforeSend,
          mode,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "API 요청에 실패했습니다.");
      }

      const aiMessages: ChatMessage[] = (data.results as ApiResult[]).map((result) => ({
        id: makeId(),
        role: "assistant",
        provider: result.provider,
        content: result.content,
        ok: result.ok,
        createdAt: nowIso(),
      }));

      updateConversation(activeConversation.id, (conversation) => ({
        ...conversation,
        messages: [...conversation.messages, ...aiMessages],
        updatedAt: nowIso(),
      }));
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: makeId(),
        role: "assistant",
        provider: "system",
        content: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        ok: false,
        createdAt: nowIso(),
      };

      updateConversation(activeConversation.id, (conversation) => ({
        ...conversation,
        messages: [...conversation.messages, errorMessage],
        updatedAt: nowIso(),
      }));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-3 py-4 text-slate-50 sm:px-5 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-32px)] w-full max-w-7xl grid-cols-1 overflow-hidden rounded-[32px] border border-white/10 bg-white/10 shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-[320px_1fr]">
        <aside className="border-b border-white/10 bg-slate-950/30 p-4 lg:border-b-0 lg:border-r">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-sky-200/80">Personal AI Council</p>
              <h1 className="mt-1 text-xl font-black">AI 단톡방</h1>
            </div>

            <button
              type="button"
              onClick={startNewChat}
              className="rounded-2xl bg-sky-300 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-sky-200"
            >
              새 대화
            </button>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setShowArchived(false)}
              className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                !showArchived ? "bg-white/15 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              대화
            </button>
            <button
              type="button"
              onClick={() => setShowArchived(true)}
              className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                showArchived ? "bg-white/15 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              보관함
            </button>
          </div>

          <div className="max-h-[260px] space-y-2 overflow-y-auto pr-1 lg:max-h-[calc(100vh-190px)]">
            {visibleConversations.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                {showArchived ? "보관된 대화가 없습니다." : "대화가 없습니다."}
              </div>
            ) : (
              visibleConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => setActiveId(conversation.id)}
                  className={`w-full rounded-2xl border p-3 text-left transition ${
                    activeId === conversation.id
                      ? "border-sky-300/40 bg-sky-300/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="line-clamp-1 text-sm font-bold">{conversation.title}</div>
                  <div className="mt-1 flex items-center justify-between gap-2 text-xs text-slate-400">
                    <span>{conversation.messages.length}개 메시지</span>
                    <span>{formatDate(conversation.updatedAt)}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <section className="flex min-h-[720px] flex-col overflow-hidden">
          <header className="border-b border-white/10 px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="mb-2 text-sm font-medium text-sky-200/80">
                  GPT · Gemini · Claude · Codex
                </p>
                <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                  {activeConversation?.title || "AI 회의"}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                  한 번 질문하면 여러 AI가 같은 채팅방에서 각자 답변합니다. 대화는 이 브라우저 localStorage에 저장됩니다.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={mode}
                  onChange={(event) => setMode(event.target.value as Mode)}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition hover:border-white/20 focus:border-sky-300/50"
                >
                  <option value="all">전체 AI 호출</option>
                  <option value="gpt">GPT만 호출</option>
                  <option value="gemini">Gemini만 호출</option>
                  <option value="claude">Claude만 호출</option>
                  <option value="codex">Codex만 호출</option>
                </select>

                <button
                  type="button"
                  onClick={clearCurrentMessages}
                  disabled={!hasMessages || isLoading}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  비우기
                </button>

                {activeConversation?.archived ? (
                  <button
                    type="button"
                    onClick={() => restoreConversation(activeConversation.id)}
                    className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/15"
                  >
                    복원
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => activeConversation && archiveConversation(activeConversation.id)}
                    disabled={!activeConversation || isLoading}
                    className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    보관
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => activeConversation && deleteConversation(activeConversation.id)}
                  disabled={!activeConversation || isLoading}
                  className="rounded-2xl border border-red-300/20 bg-red-300/10 px-4 py-3 text-sm font-semibold text-red-100 transition hover:bg-red-300/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  삭제
                </button>
              </div>
            </div>
          </header>

          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-7">
              {!hasMessages ? (
                <div className="flex min-h-[360px] items-center justify-center">
                  <div className="max-w-xl rounded-[28px] border border-white/10 bg-slate-950/35 p-6 text-center shadow-xl">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-sky-200/20 bg-sky-300/10 text-3xl">
                      💬
                    </div>
                    <h3 className="text-xl font-bold">첫 질문을 던져봐</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      예: “루네르비아 회사 소개 사이트 구조를 GPT, Gemini, Claude, Codex가 각자 의견 내줘”
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <article
                    key={message.id}
                    className={`rounded-[26px] border p-4 shadow-lg backdrop-blur ${providerStyle[message.provider]}`}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <ProviderLogo provider={message.provider} />

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <strong className="text-base">{providerLabel[message.provider]}</strong>
                            {message.ok === false ? (
                              <span className="rounded-full bg-red-400/15 px-2 py-1 text-xs font-semibold text-red-200">
                                오류
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-xs text-slate-300">
                            {providerDescription[message.provider]}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <time className="text-xs text-slate-400">{formatTime(message.createdAt)}</time>
                        <button
                          type="button"
                          onClick={() => deleteMessage(message.id)}
                          className="rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300 transition hover:bg-red-400/10 hover:text-red-100"
                        >
                          삭제
                        </button>
                      </div>
                    </div>

                    <div className="whitespace-pre-wrap break-words text-[15px] leading-7 text-slate-50">
                      {message.content}
                    </div>
                  </article>
                ))
              )}

              {isLoading ? (
                <div className="rounded-[26px] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <div className="mb-2 font-semibold text-slate-100">AI 회의 중...</div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-1/3 animate-pulse rounded-full bg-white/40" />
                  </div>
                </div>
              ) : null}

              <div ref={bottomRef} />
            </div>

            <footer className="border-t border-white/10 bg-slate-950/35 p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                <span>현재 모드: {modeLabel}</span>
                <span>Enter 전송 · Shift+Enter 줄바꿈</span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="AI 단톡방에 보낼 내용을 입력..."
                  rows={3}
                  disabled={activeConversation?.archived || isLoading}
                  className="min-h-24 flex-1 resize-none rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-4 text-sm leading-6 text-slate-50 outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-sky-300/50 disabled:cursor-not-allowed disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading || activeConversation?.archived}
                  className="rounded-3xl bg-sky-300 px-6 py-4 text-sm font-black text-slate-950 shadow-lg shadow-sky-950/30 transition hover:-translate-y-0.5 hover:bg-sky-200 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-slate-500 disabled:text-slate-300 sm:w-36"
                >
                  {isLoading ? "대기" : "전송"}
                </button>
              </div>

              {activeConversation?.archived ? (
                <p className="mt-3 text-xs text-amber-200">
                  이 대화는 보관된 상태라 메시지를 보낼 수 없습니다. 다시 쓰려면 복원하세요.
                </p>
              ) : null}
            </footer>
          </div>
        </section>
      </section>
    </main>
  );
}
