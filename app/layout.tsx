import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const jbm = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jbm",
  display: "swap",
});

const PRETENDARD =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css";

/* 캐노니컬 도메인 — Vercel 이 apex(lunervia.xyz)를 www 로 308 리다이렉트하므로
   검색엔진·OG 에 주는 절대 URL 은 전부 www 기준이어야 한다. */
const SITE_URL = "https://www.lunervia.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: {
    default: "Lunervia — 작동하는 서비스를 만드는 소프트웨어 스튜디오",
    template: "%s · Lunervia",
  },
  description:
    "기획, 구현, 검증, 배포까지 한 팀이 책임지는 소프트웨어 스튜디오. 화면이 아니라 주소가 있고 접속되는 서비스를 만듭니다.",
  openGraph: {
    type: "website",
    siteName: "Lunervia",
    locale: "ko_KR",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0b0e13",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Lunervia",
      url: SITE_URL,
      logo: `${SITE_URL}/brand/lunervia-symbol.png`,
      sameAs: [
        "https://www.instagram.com/lunerviasoft/",
        "https://www.instagram.com/4ever2short/",
        "https://www.tiktok.com/@_dksrlqor",
        "https://github.com/dksrlqor",
      ],
    },
    {
      "@type": "WebSite",
      name: "Lunervia",
      url: SITE_URL,
      inLanguage: "ko-KR",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={jbm.variable}>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preload" as="style" href={PRETENDARD} />
        <link rel="stylesheet" href={PRETENDARD} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body id="top">
        <LanguageProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
