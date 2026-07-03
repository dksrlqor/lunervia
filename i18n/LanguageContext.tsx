"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ko, type Dict } from "./ko";
import { en } from "./en";

export type Lang = "ko" | "en";

const DICTS: Record<Lang, Dict> = { ko, en };
const STORAGE_KEY = "lunervia-lang";

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}>({ lang: "ko", setLang: () => {}, t: ko });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ko");

  useEffect(() => {
    // 저장된 언어를 마운트 후 1회 동기화 — SSR 은 항상 KO 로 렌더되므로
    // hydration 이후에만 외부 상태(localStorage)를 반영할 수 있다.
    // 프라이버시 모드 등 storage 접근이 차단된 환경에서는 KO 로 동작.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (window.localStorage.getItem(STORAGE_KEY) === "en") setLangState("en");
    } catch {
      /* storage 차단 — 기본 언어 유지 */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* storage 차단 — 세션 내 전환은 유지되고 저장만 생략 */
    }
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: DICTS[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useI18n() {
  return useContext(LangContext);
}
