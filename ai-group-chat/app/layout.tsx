import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Group Chat",
  description: "GPT, Gemini, Claude, Codex를 한 채팅방에 모은 개인용 AI 단톡방",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
