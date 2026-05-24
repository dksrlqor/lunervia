# Lunervia Project Notes

## 프로젝트 개요

Lunervia(루네르비아)는 감정과 기술 사이에서 조용하지만 필요한 소프트웨어를 만드는 작은 브랜드의 공식 홈페이지입니다.
크림/아이보리 베이스의 미니멀·따뜻한 톤이며, 포인트 컬러는 절제된 브라운/차콜입니다.

로컬 서버는 `serve_no_cache.py` 로 실행합니다.

```text
python serve_no_cache.py
http://127.0.0.1:5173/
```

## 2026-05-24 — 정식 소프트웨어 브랜드 사이트 업그레이드

이전 단일 섹션 구성에서 정식 브랜드 사이트 수준으로 확장했습니다. 모든 작업은 순수 HTML / CSS / JS 만 사용했으며 외부 프레임워크 의존성이 없습니다.

### 사이트 구조 (단일 페이지 + 내부 오버레이)

상단 네비게이션
1. `Lunervia` 워드마크 (헤더 좌측) — 클릭 시 부드럽게 맨 위로
2. 메뉴: 소개 · 제품 · 협력 · 철학 · 문의 · `Why Lunervia` (오버레이 트리거)
3. 우측에 KO / EN 언어 토글

본문 섹션 — 모두 `01 / About` 형태의 번호 라벨 + 큰 타이틀
- `01 / About` — 브랜드 한 단락 + 4개 메타 (Founded / Based in / Focus / Stage)
- `02 / Philosophy` — Brand Manifesto 블록인용구 + 3개 매니페스토 카드 + `루네르비아를 만든 이유` 자세히 읽기 CTA
- `03 / Products` — Night Letter (실제 코드네임은 노출하지 않음)
- `04 / Partners` — Todak Aquarium Diary (Instagram, App Store)
- `05 / Contact` — 공식 Instagram / 개인 Instagram / Email coming soon

Hero
- 좌: eyebrow / 큰 타이틀 / 부 카피 / CTA 2개 / 브랜드 키워드 칩 (Emotion / Software / Letters / Warmth / Connection / Translation)
- 우: macOS 스타일의 진짜 같은 터미널 창 — 트래픽 라이트 정고증 컬러 (`#FF5F56` / `#FFBD2E` / `#27C93F`). 첫 줄에 `안녕하세요!` 가 미리 들어있고, JS 가 사이클로 다음 문구들로 교체합니다.

Why Lunervia (내부 오버레이)
- 새 탭/페이지가 아니라 사이트 안에서 우측에서 부드럽게 펼쳐지는 스토리룸
- 트리거: 상단 네비 `Why Lunervia`, 푸터 같은 버튼, Philosophy 섹션의 CTA — 모두 `data-open-why`
- 닫기: 우상단 X, 본문 하단 `메인으로 돌아가기`, 배경 클릭, Esc 키
- 열려 있을 때 `body.why-open` 으로 스크롤 잠금 + 포커스 트랩 + 첫 포커스는 close 버튼
- 본문: 인트로 / 본문 5단락 / 강조 인용구 / 영문 한 문장 / 협업사 카드(Todak)

푸터
- 좌: 워드마크 + 태그라인
- 우: Explore / Connect 두 열 (각 메뉴 + Email coming soon)
- 하단 바: 카피라이트 + `Built with warmth.` + `맨 위로 ↑`

전역 모션 / 인터랙션
- 첫 진입 시 `Lunervia` 글자가 1.85초 정도 떴다가 사라지는 부팅 인트로
- 상단 2px 스크롤 진행률 바
- 데스크톱 한정: 마우스를 따라가는 은은한 빛 (반지름 ~260px, multiply 블렌드)
- 부유 애니메이션 — Partner 카드 등에 `.float` 유틸
- `.reveal` 스태거 (IntersectionObserver) — 첫 등장 시 위로 떠오름
- `prefers-reduced-motion` 환경에서는 인트로/타이핑/플로팅/오버레이 트랜지션을 모두 줄입니다.

### i18n (KO / EN)

- 모든 UI 문구는 `data-i18n` (텍스트) 또는 `data-i18n-html` (br/span 포함 마크업) 속성을 갖습니다.
- `script.js` 안 `I18N.ko` / `I18N.en` 두 객체가 번역 소스입니다.
- 사용자가 선택한 언어는 `localStorage["lunervia-lang"]` 으로 저장되며 다음 방문 시 자동 적용됩니다.
- 토글 시 `<html lang="...">` 도 함께 갱신해 스크린리더 / 검색엔진 친화적으로 동작합니다.

### 이미지 자리 (사용자가 채우는 경로)

| 파일 | 어떤 이미지인가 | 어디서 쓰이나 |
|---|---|---|
| `assets/brand/lunervia-logo-text.png` | 텍스트형 LUNERVIA 워드마크 (흰색) | 상단 네비 좌측 (CSS 로 어둡게 처리) |
| `assets/brand/lunervia-logo-symbol.png` | 심볼 + 텍스트 일체형 (흰색) | 푸터 워드마크 |
| `assets/brand/product-letter.png` | 편지/봉투 비주얼 | 제품 섹션 카드 (Night Letter) |
| `assets/brand/partner-todak.png` | 어항 아이콘 | 파트너 섹션 카드 + Why 오버레이 안 협업사 카드 |

이미지가 없으면 텍스트 워드마크 또는 placeholder 가 보이고, 이미지가 있으면 `script.js` 의 `wireImageFallback` 이 자동으로 띄웁니다.

### 디자인 토큰 (요약)

```text
배경    : --bg #F7F3EA / --bg-soft #EFE7DA / --bg-card #FBF8F1 / --bg-paper #F4EFE2
경계    : --line-soft #E5DDCE / --line #D8CFC0 / --line-strong #BFB4A4
텍스트  : --text #1F1F1B / --text-2 #3D3933 / --text-3 #5F5A50 / --text-4 #8A8378
포인트  : --accent #8A6F4D / --accent-2 #6B5238 / --accent-soft / --accent-line
모션    : --ease-out / --ease-spring / --t-fast .18s / --t-mid .32s / --t-slow .56s
글꼴    : Space Grotesk (display) + Plus Jakarta Sans (sans) + system mono
```

### 절대 화면에 노출하지 않을 것

- 실제 프로젝트 이름 `WorldLetter` / `월드레터` (Night Letter 만 표기)

### 외부 링크 (모두 새 탭, `rel="noopener noreferrer"`)

- Instagram `@lunerviasoft` → https://www.instagram.com/lunerviasoft/
- Instagram `@dksrlqor`     → https://www.instagram.com/dksrlqor/
- Instagram `@todaklife`    → https://www.instagram.com/todaklife/
- App Store 토닥어항일기   → https://apps.apple.com/kr/app/todak-aquarium-diary/id6765705899?l=en-GB

### 보안 / 시크릿 정책 (중요)

프론트엔드 (HTML / CSS / JS) 에 **민감한 정보를 절대 넣지 않습니다.** 다음은 절대 노출 금지:

- API Key, Secret Key, Access Token, Private Key
- Supabase Service Role Key, Firebase Admin Key
- OpenAI API Key, 결제 관련 Secret Key
- 서버 관리자용 토큰, 실제 이메일/DB 자격 증명

규칙:
1. 민감한 API 호출은 백엔드(서버리스 함수 등)에서 환경변수로 처리.
2. 로컬 개발용 실제 값은 `.env` 파일에만 두고, `.gitignore` 로 절대 커밋되지 않게 한다.
3. 다른 개발자에게 형식을 알릴 때는 `.env.example` (placeholder 만 들어 있음) 을 사용한다.
4. 코드 리뷰 / 커밋 직전에 `key`, `token`, `secret`, `password` 같은 단어를 grep 해 우연한 노출이 없는지 확인.

## 주요 파일

- `index.html` — 사이트 구조 + i18n 마크업 + Why 오버레이
- `styles.css` — 디자인 시스템 + 모든 컴포넌트 + 반응형 + reduced-motion
- `script.js` — 인트로 / 이미지 폴백 / 네비 / 타이핑 / reveal / 진행률 바 / 커서 라이트 / 언어 토글 / Why 오버레이
- `why.html` — Why Lunervia 본문의 정적 fallback 페이지 (메인 UI 에선 직접 링크하지 않음 — 검색엔진/딥링크용)
- `serve_no_cache.py` — 로컬 무캐시 개발 서버 (포트 5173)
- `assets/brand/` — 4장의 브랜드/제품/협업사 이미지
- `.env.example` — 환경변수 형식 예시 (실제 키는 절대 넣지 않음)
- `.gitignore` — `.env`, `__pycache__`, OS 임시 파일 등 제외

## 검증 체크리스트

1. `python serve_no_cache.py` 실행 → `http://127.0.0.1:5173/` 접속.
2. 첫 진입 시 `Lunervia` 부팅 인트로가 잠깐 떴다 사라지는지 확인.
3. 헤더 워드마크 클릭 시 부드럽게 맨 위로 스크롤되는지 확인.
4. 상단 우측 KO / EN 토글로 본문이 모두 바뀌는지 + 새로고침 후에도 유지되는지 확인.
5. Hero 터미널 창에 `안녕하세요!` 부터 시작해 다섯 개 문구가 사이클로 타이핑되는지.
6. `Why Lunervia` 버튼(네비 / 푸터 / 철학 CTA) 셋 모두에서 오버레이가 우측에서 부드럽게 펼쳐지는지.
   - X 버튼 / 배경 클릭 / Esc / `메인으로 돌아가기` 로 닫히는지.
   - 열린 동안 뒤 배경 스크롤이 잠기는지 + 포커스가 안에 갇히는지.
7. 데스크톱 마우스 이동 시 은은한 빛이 따라오는지 (모바일에서는 자동 비활성).
8. 상단 진행률 바가 스크롤에 따라 채워지는지.
9. 모바일 뷰포트에서 햄버거 메뉴가 정상 동작하고, 가로 스크롤이 없는지.
10. 콘솔 에러 0.

## 배포

GitHub 저장소:

```text
https://github.com/dksrlqor/lunervia
```

GitHub Pages:

- Source: Deploy from a branch
- Branch: `main` / `(root)`

사이트는 정적이므로 `serve_no_cache.py` 는 로컬 전용이며, GitHub Pages 는 정적 파일을 자동 서빙합니다.
브라우저 캐시가 강해 변경이 안 보일 때는 `?v=...` 쿼리를 갱신하거나 시크릿 창으로 확인하세요.
