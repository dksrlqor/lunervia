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

export const metadata: Metadata = {
  metadataBase: new URL("https://lunervia.xyz"),
  title: {
    default: "Lunervia — 생각을 현실로 만드는 소프트웨어 스튜디오",
    template: "%s · Lunervia",
  },
  description:
    "기획, 설계, 구현, 배포까지. 화면이 아니라 작동하는 웹서비스를 만드는 소프트웨어 스튜디오, Lunervia.",
  openGraph: {
    type: "website",
    siteName: "Lunervia",
    locale: "ko_KR",
    url: "https://lunervia.xyz",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#171717",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Lunervia",
      url: "https://lunervia.xyz",
      logo: "https://lunervia.xyz/brand/lunervia-symbol.png",
      sameAs: [
        "https://www.instagram.com/lunerviasoft/",
        "https://www.instagram.com/_dksrlqor/",
        "https://www.tiktok.com/@_dksrlqor",
        "https://github.com/dksrlqor",
      ],
    },
    {
      "@type": "WebSite",
      name: "Lunervia",
      url: "https://lunervia.xyz",
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
      <body>
        <LanguageProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
