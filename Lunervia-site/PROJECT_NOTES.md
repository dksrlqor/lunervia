# Lunervia Project Notes

## 프로젝트 개요

Lunervia(루네르비아)는 감정과 기술 사이에서 조용하지만 필요한 소프트웨어를 만드는 작은 브랜드의 공식 홈페이지입니다.
검정 기반의 미니멀·프리미엄 톤이며, 포인트 컬러는 절제된 보라/푸른빛(`#8b9cff`)입니다.

로컬 서버는 `serve_no_cache.py` 로 실행하며, 주소는 다음과 같습니다.

```text
http://127.0.0.1:5173/
```

## 2026-05-22 새 시작 — 검정 프리미엄 브랜드 사이트

이전 빌드와 그 백업은 사용자의 지시로 모두 비웠고, 새 계획서를 기준으로 사이트를 다시 만들었습니다.

### 사이트 구조 (단일 페이지)

1. **상단 네비게이션** — `Lunervia` 텍스트 워드마크 + `루네르비아` 보조 텍스트 + 메뉴(소개·제품·협력·문의).
   로고 클릭 시 `window.location.reload()` 로 새로고침.
2. **Hero** — 좌측은 환영 카피와 CTA, 우측은 VS Code 스타일의 큰 코드 에디터 카드.
   - 코드 라인 안 `greet = "..."` 문자열이 사이클로 타이핑됩니다.
   - **첫 문구는 반드시 `안녕하세요!`** 부터 시작합니다.
   - 이후 사이클:
     - `우리는 감정을 소프트웨어로 번역합니다.`
     - `작은 불편함에서 서비스를 만듭니다.`
     - `Lunervia builds quiet, meaningful tools.`
     - `오늘의 아이디어가 내일의 제품이 됩니다.`
3. **About / Why Lunervia** — 브랜드 철학을 길게 읽힐 수 있도록 정리한 본문. 강조 문장은 따로 카드로 띄움.
4. **Products** — 익명 편지 기반 감성 소셜 서비스 카드 한 장. 표시 이름은 **`Night Letter`** (실제 프로젝트 이름은 화면에 노출하지 않음).
5. **Partners** — 토닥어항일기(Todak Aquarium Diary) 협력사 카드. Instagram `@todaklife` + App Store 링크 (모두 새 탭).
6. **Contact** — 공식/파운더 Instagram 두 장 + Email coming soon 카드.
7. **Footer** — 짧은 태그라인 + 카피라이트.

### 이미지 자리 (사용자가 직접 채울 자리)

| 파일 | 어떤 이미지인가 | 어디서 쓰이나 |
|---|---|---|
| `assets/brand/lunervia-logo-text.png` | 텍스트형 LUNERVIA 워드마크 (흰색) | 상단 네비 좌측 |
| `assets/brand/lunervia-logo-symbol.png` | 심볼 + 텍스트가 함께 있는 로고 (흰색) | 푸터 워드마크 |
| `assets/brand/product-letter.png` | 편지/봉투 비주얼 (Night Letter 카드용 — 원본은 사용자의 WorldLetter 아이콘) | 제품 섹션 카드 |
| `assets/brand/partner-todak.png` | 어항 아이콘 (토닥어항일기 협력사 카드) | 파트너 섹션 카드 |

파일이 없으면 텍스트 워드마크 또는 `Product visual / Partner visual` 자리 표시가 보이고,
파일을 넣으면 `script.js` 의 폴백 로직이 자동으로 이미지를 띄웁니다.

### 디자인 토큰 (요약)

```text
배경  : --bg #08080a / --surface #131318 / --surface-2 #1a1a20
경계  : --line rgba(255,255,255,0.09)
텍스트: --text #ffffff / --text-2 #d6d6d6 / --text-3 #a1a1aa / --text-4 #71717a
포인트: --accent #8b9cff / --accent-2 #a78bfa / --accent-mint #94d5c6
모션  : --ease-out cubic-bezier(0.22,0.68,0.24,1), --t-fast .18s, --t-mid .32s
```

### 절대 화면에 노출하지 않을 것

- 실제 프로젝트 이름 `WorldLetter` / `월드레터` (코드 주석은 가능, 사용자 시야 안 들어가는 영역 한정)

### 외부 링크 (모두 새 탭, `rel="noopener noreferrer"`)

- Instagram `@lunerviasoft` → https://www.instagram.com/lunerviasoft/
- Instagram `@dksrlqor`     → https://www.instagram.com/dksrlqor/
- Instagram `@todaklife`    → https://www.instagram.com/todaklife/
- App Store 토닥어항일기    → https://apps.apple.com/kr/app/todak-aquarium-diary/id6765705899?l=en-GB

## 주요 파일

- `index.html` — 사이트 구조와 모든 섹션
- `styles.css` — 검정 기반 디자인 시스템
- `script.js` — 타이핑 사이클, 메뉴 토글, 이미지 폴백, reveal
- `serve_no_cache.py` — 로컬 무캐시 개발 서버
- `assets/brand/` — 사용자가 추가할 4장의 이미지 자리

## 배포

GitHub 저장소:

```text
https://github.com/dksrlqor/lunervia
```

GitHub Pages 설정:

- Source: Deploy from a branch
- Branch: main / `(root)`

사이트는 정적이므로 `serve_no_cache.py` 는 로컬 전용입니다. GitHub Pages 는 정적 파일을 자동으로 서빙합니다.
