# Lunervia Project Notes

## 프로젝트 개요

Lunervia는 아이디어를 웹, 앱, 자동화, AI 연동으로 연결하는 런칭 준비 중 소프트웨어 브랜드 사이트입니다.
아직 출시된 제품은 없지만, 첫 릴리스를 준비하는 작은 소프트웨어 스튜디오처럼 신뢰감 있게 보이는 것을 목표로 합니다.
현재 디자인은 블랙 기반(`#0a0a0b`)의 고대비 디자인 시스템이며, 포인트 컬러는 인디고/바이올렛(`#7b74ff`)입니다.
브랜드의 깊은 인디고 `#170C79`는 그라데이션 등 깊은 채움에 사용합니다.

로컬 서버는 `serve_no_cache.py` 로 실행하며, 주소는 다음과 같습니다.

```text
http://127.0.0.1:5173/
```

## 2026-05-18 black redesign + 코드 인트로 업데이트

- 사이트 전체를 라이트 테마에서 **블랙 기반 고대비 디자인 시스템**으로 리뉴얼했습니다.
- `styles.css` 의 4중 색상 팔레트(약 5,500줄)를 폐기하고, 단일 블랙/인디고 디자인 시스템으로 다시 작성했습니다.
- 첫 진입 시 검정 배경 위 코드 에디터에서 `안녕하세요 ><` 가 타이핑되는 **코드 인트로 모션**을 추가했습니다. (`index.html` 의 `#code-intro`, `script.js` 상단 컨트롤러)
  - `index.html` 접속/새로고침 시 매번 재생되며, Skip 버튼·화면 클릭·Esc 로 건너뛸 수 있습니다.
  - `prefers-reduced-motion` 사용자는 타이핑 없이 짧게 표시 후 메인으로 넘어갑니다.
- 새 브랜드 로고를 적용했습니다. 흰색 로고 PNG 2장을 `assets/brand/` 에 저장합니다.
  - 헤더: `assets/brand/lunervia-logo-text.png` (텍스트형 워드마크)
  - hero · 푸터 · reason 패널: `assets/brand/lunervia-logo-symbol-text.png` (심볼+텍스트)
  - 각 사용 위치는 HTML 주석 `LOGO(...)` 으로 표시되어 있어 파일명만 바꿔 끼울 수 있습니다.
- 검정 배경에서 글자가 묻히지 않도록 텍스트 대비를 전반적으로 강화했습니다.
- 섹션별로 다른 등장 모션(hero 스태거, 카드 부상, 타임라인 슬라이드 등)과 hover 모션을 추가했습니다.
- 헤더 글자 분해(`LUA`) 로고 모션은 정적 이미지 로고로 대체되어 더 이상 사용하지 않습니다. 관련 JS는 null 가드로 안전하게 유지됩니다.
- 캐시 버전 문자열을 `?v=20260518a` 로 갱신했습니다.

## 2026-05-08 brand/studio redesign update

- 전체 사이트 톤을 “초기 소프트웨어 브랜드/스튜디오” 방향으로 리디자인했습니다.
- 사이트 내부 문구는 한국어 중심으로 유지하고, 영어는 `Lunervia Lab`, `Dev Log`, `Web`, `App`, `AI` 같은 짧은 메뉴/태그에만 제한적으로 사용합니다.
- “회사” 표현은 줄이고 `소프트웨어 브랜드`, `소프트웨어 스튜디오`, `런칭 준비 중인 제품`, `프로젝트 문의` 중심으로 바꿨습니다.
- 컬러 팔레트를 `#170C79`, `#EFE3CA`, `#56B6C6`, `#8ACBD0` 기반으로 통일했습니다.
- 메인 히어로는 웹, 앱, 자동화, AI 연동을 만드는 브랜드라는 점이 바로 보이도록 수정했습니다.
- 앱 섹션은 `개발중` 느낌을 줄이고 `기획 및 설계 중`, `프로토타입 준비 중`, `초기 개발 단계` 같은 상태 문구로 바꿨습니다.
- 문의 섹션은 웹사이트 제작, 앱 기획, 자동화, AI 연동 카드형 CTA로 개편했습니다.
- `공부방` 메뉴는 `Lunervia Lab`으로 바꾸고, study-room.html은 개인 생산성 실험실 느낌으로 정리했습니다.
- `업데이트` 메뉴는 `Dev Log`로 바꾸고, updates.html은 날짜별 작업 기록 타임라인으로 정리했습니다.
- reason.html 본문 위에 3줄 브랜드 선언 요약 박스를 추가했습니다.
- 스크롤 시 `LA`로 응축되는 로고 모션은 유지하고, hover/focus 시 전체 `LUNERVIA`가 다시 보이도록 개선했습니다.
- 푸터는 Brand, Services, Projects, Resources, Social 구조로 정리했습니다.
- 코드처럼 움직이는 첫 영역의 이름은 `코드 배너`이며, 가운데 타이핑 메시지는 `안녕하세요 ><` 인사로 시작합니다.
- 모바일/태블릿에서는 hover 효과가 끈적하게 남지 않도록, 로고가 문서 최상단에서만 `LUNERVIA`로 펼쳐지게 조정했습니다.
- 더 이상 사용하지 않는 assets 폴더의 과거 로고 이미지 파일은 삭제했습니다.

## 2026-05-04 background layout update

- Header uses white background with `#E5E7EB` bottom border.
- Hero uses white plus soft sky/purple radial gradients.
- Products/Features section uses `#F5F3FF`; product cards are white with `#E9D5FF` borders.
- Community/Services section uses white; service panel/cards use `#F8FAFC` and `#E5E7EB`.
- Updates/About section uses `#F8FAFC`.
- CTA section uses `#1E1B4B` with white text and purple primary button.
- Footer was added with `#0F172A` background.
- Footer now uses a 5-column structure: brand, Services, Solutions, Resources, Company.
- Footer email is `contact@lunervia.com`; bottom line is `© 2026 Lunervia. All rights reserved.`
- Header brand click refreshes the current page from the top and disables browser scroll restoration.
- Header nav order is now Study Room, Apps, Community, Updates, Contact.
- Updates moved to a dedicated `updates.html` page with date-based update notes.
- Code banner no longer shows the `Lunervia 작업 콘솔` label; only the moving code chips and typed message remain.
- Code banner lanes now use two identical `.code-loop` groups and one `lane-marquee` animation so the upper/lower chip rows move continuously in the same direction.
- Overall contrast was raised slightly: darker muted text, stronger borders, and slightly clearer card shadows.
- Main top area now wraps Instagram/contact, code banner, and hero in one `intro-surface` so the area above the hero and the hero share the same background.
- The old top Instagram contact strip was removed.
- A dark scroll-focused reason section was added: `우리가 루네르비아를 만든 이유`.
- The reason section is now shorter on desktop and links to a dedicated `reason.html` reading page instead of a modal.
- `reason.html` includes the full founder-style note and a Korean-labeled Lunervia software/idea connection motion graphic.
- `reason.html` uses the same dark/purple tone in the header and article area, and the duplicated bottom return button was removed.
- The reason article was expanded into a longer, polished Korean brand note based on the user's draft.
- On every page, clicking the header `LUNERVIA` logo now always navigates to `index.html` and starts from the top of the main page.
- Header logo motion now stays condensed while the page is even slightly scrolled; it expands back to `LUNERVIA` only when the page reaches the very top.
- Bottom CTA now includes both Lunervia official Instagram `@lunerviasoft` and personal Instagram `@dksrlqor`.

GitHub Pages 공개 주소는 저장소 설정 후 다음 형태를 사용합니다.

```text
https://dksrlqor.github.io/lunervia/
```

## 주요 파일

- `index.html`: 사이트 내용, 섹션 구조, 문구
- `reason.html`: `우리가 루네르비아를 만든 이유` 전문과 모션 그래픽
- `styles.css`: 디자인, 반응형, 카드/버튼/배경 스타일
- `script.js`: 메뉴, 인스타 패널, 개발/배포 탭, 제품 상세 펼치기, 디데이 타이머
- `assets/`: 현재 사용 중인 이미지가 없으면 비어 있을 수 있음

GitHub 업로드용 복사본은 바탕 화면에 있습니다.

```text
C:\Users\smbes\OneDrive\바탕 화면\Lunervia-site
```

수정 후 GitHub에 다시 올릴 때는 `New project 2`의 최신 파일을 위 폴더로 다시 복사하면 됩니다.

## 현재 사이트 구성

1. 상단 네비게이션
   - `LUNERVIA` 텍스트 로고
   - 화면 맨 위에서는 전체 글자 표시
   - 스크롤을 내리면 마지막 `A`가 `L` 옆으로 이동해 `LA`처럼 보이는 모션
   - 메뉴: Lunervia Lab, 프로젝트, 브랜드, Dev Log, 문의
   - 모바일에서는 햄버거 메뉴로 접힘
   - `Lunervia Lab` 메뉴는 메인 페이지 섹션이 아니라 `study-room.html` 별도 페이지로 이동

2. 문의 영역
   - 메인 하단에 카드형 프로젝트 문의 CTA 표시
   - 문의 유형: 웹사이트 제작, 앱 기획, 자동화, AI 연동
   - Lunervia 공식 인스타그램 `@lunerviasoft`, 개인 인스타그램 `@dksrlqor`, 이메일 `contact@lunervia.com` 유지

3. 코드 배너
   - Web, App, 자동화 설계, AI 연동, 제품 구조 같은 짧은 칩이 좌우로 움직임
   - 가운데 한국어 타이핑 문구가 입력/삭제 반복

4. 히어로 영역
   - Lunervia가 웹, 앱, 자동화, AI 연동을 만드는 소프트웨어 브랜드라는 설명
   - 개발 현황/배포 현황 탭
   - 배포 현황은 아직 출시 전이라 `런칭 준비 중` 상태로 표시

5. 브랜드 노트
   - 메인에는 어두운 `우리가 루네르비아를 만든 이유` 섹션을 짧게 표시
   - `글 읽기`를 누르면 `reason.html` 전용 페이지로 이동
   - 별도 페이지에서는 모션 그래픽과 전문을 함께 읽을 수 있음

6. 제품 섹션
   - 모두 아직 공개 전인 런칭 준비 중 제품으로 표시
   - `DidingGo (디딩고)`: 상황 해결형 언어 학습 게임
   - `LUNÉ (루네)`: 우주 컨셉 감성 기록 앱
   - `Loop (루프)`: 관계 기반 공부/집중 앱
   - 각 카드의 `기획 요약 보기` 버튼을 누르면 짧은 설명 펼침

7. Lunervia Lab
   - `study-room.html` 별도 페이지
   - 공부, 기록, 집중처럼 일상 문제를 작은 소프트웨어 도구로 풀어보는 실험 공간
   - 현재는 시험 디데이 타이머 섹션 운영
   - 컴퓨터 시간을 기준으로 자동 계산
   - 가까운 날짜 순서로 자동 정렬
   - 시험 일정:
     - 기말고사: 2026-06-30
     - 학평/모평: 2026-06-04
   - 각 카드에는 `D-숫자`와 총 남은 `시간/분/초`를 표시

8. 커뮤니티 섹션
   - 아직 실제 커뮤니티는 없지만, 제품 지원/배포 토론/크리에이터 공간 소개 형태

9. Dev Log
   - `updates.html` 별도 페이지
   - 사이트 구조, 디자인, 제품 기획, 실험 기능처럼 실제로 바뀐 내용을 날짜별 작업 기록으로 표시
   - 태그는 `Design`, `Structure`, `Product`, `Lab`, `Brand`처럼 짧은 영어 사용 가능

10. 문의 영역
   - Lunervia 공식 인스타그램 `@lunerviasoft`
   - 개인 인스타그램 `@dksrlqor`
   - 이메일 `contact@lunervia.com`
   - 웹사이트 제작, 앱 기획, 자동화, AI 연동 문의 카드

## 사용자의 취향 및 요청

- 한국어 중심 문구 선호
- 흰색 배경 유지
- 루네르비아 이름에 맞는 달빛/판타지/기술 브랜드 느낌 선호
- 현재 팔레트: 메인 `#170C79`, 크림 `#EFE3CA`, 포인트 `#56B6C6`, 보조 포인트 `#8ACBD0`
- UI는 간단하지만 모던해야 함
- 너무 긴 설명은 싫어함. 짧고 읽기 쉽게 요약해야 함
- 아직 출시 전인 앱들이므로 출시된 앱처럼 보이면 안 됨
- 아직 사업자등록 전이므로 `회사` 표현은 많이 쓰지 말고 `소프트웨어 브랜드`, `소프트웨어 스튜디오`, `프로젝트 문의` 중심으로 작성
- 모바일 화면에서 글자가 튀어나오거나 세로로 한 글자씩 쪼개지는 것을 싫어함
- 카드/박스는 마우스를 올리면 살짝 튀어나오고 색감이 변하는 효과 선호

## 배포 흐름

GitHub 저장소:

```text
https://github.com/dksrlqor/lunervia
```

GitHub Pages 설정:

- Source: Deploy from a branch
- Branch: main
- Folder: /root

수정 후 다시 배포하려면:

1. Codex가 `New project 2` 파일 수정
2. 바탕 화면 `Lunervia-site` 폴더로 최신 파일 복사
3. GitHub 저장소에서 파일 업로드 또는 기존 파일 교체
4. Commit changes
5. 몇 분 기다리면 Pages에 반영

## 새 채팅에서 이어갈 때

새 채팅에서는 이 대화가 자동으로 기억되지 않을 수 있습니다.
다음처럼 요청하면 됩니다.

```text
C:\Users\smbes\OneDrive\문서\New project 2 에 있는 Lunervia 사이트를 이어서 수정해줘.
PROJECT_NOTES.md를 먼저 읽고 현재 방향을 맞춰줘.
수정 후 바탕 화면 Lunervia-site 폴더도 갱신해줘.
```
