# Lunervia Project Notes

## 프로젝트 개요

Lunervia(루네르비아)는 사용자 경험을 중심으로 웹과 모바일 서비스를 설계하는 소프트웨어 브랜드의 공식 홈페이지입니다.
2026-07-03 전면 리뉴얼 이후: **Next.js(App Router) + TypeScript + Tailwind v4**, 다크(#171717)↔라이트(#FFF9FA) 교차 + 민트(#21F1A8) 포인트, Pretendard 단일 서체. 구 순수 HTML/CSS/JS 사이트는 `legacy/`에 보존.

로컬 서버:

```text
npm run dev
http://localhost:3000/
```

## 2026-07-15 — Coena 섹션 개편: 균사 캔버스 삭제 → GooeyText 모프 + 요금제 카드

사용자 지시: ① 코이나 섹션 변경 ② 균사체 히어로 삭제 ③ GooeyText 로 짧은 단어 모션 ④ CreativePricing 기반 결제창 ⑤ 사이트 전체 점검 + 색상 코드 보고. (동봉 스펙의 "메인 히어로 교체"는 균사체=Coena 캔버스 오인으로 판단해 달 히어로 유지, SmoothScrollHero 는 코드 미제공+사진 기반이라 3색 규율 충돌로 보류 — 둘 다 사용자 확인 대기.)

- **`components/home/CoenaSection.tsx` 재작성**: 균사 생태 캔버스 엔진 전체 삭제(Canvas 3장·생장·풍화·펄스 ~500줄). 새 흐름 = 인트로 → **모프 밴드**(섹션의 유일한 볼드 요소, border-y paper/10) → 기능 3열(기존 mono 태그+설명 유지) → 요금제 → 상태 라인. `PROTOTYPE_URL`/`NOTES_URL` 상수 패턴 유지.
- **`components/coena/GooeyText.tsx` 신규**: 짧은 동사들이 blur 모프로 순환(KO 검증하고→회복하고→기억하고→내보낸다 / EN Verify.→Recover.→Remember.→Ship. — 실제 파이프라인 순서). 데모 코드 대비 수정: rAF id 저장·cancel(누수 방지), filter id `useId`(다중 인스턴스 충돌 방지), blur 분모 하한 1e-4(NaN 방지), dt 클램프 0.1s(탭 복귀 점프 방지), IO 로 화면 밖 정지, 모션 텍스트 aria-hidden + sr-only 문장, **reduced-motion = 루프 미기동 + `motion-reduce:` CSS 로 전체 문구 정적 표시**. 스팬 A 는 흐름에 남겨 밴드 높이 고정(레이아웃 흔들림 없음).
- **`components/coena/CoenaPricing.tsx` 신규**: 오프셋 섀도 카드 3장(rounded-2xl border-2, 호버 transform 만). 원본 CreativePricing 의 동적 `text-${color}` 제거(정적 분기), 손글씨 폰트·이모지·달러가격·카드 회전 제거. **가격 임의 생성 금지** — Preview 무료(공개 시)/Standard 가격 미정/Studio 별도 문의(highlighted, 민트 보더+배지 "지금 가능"). CTA 전부 실존 앵커 `/#contact`. TODO: 가격 확정 시 i18n `coena.pricing` 교체.
- **i18n**: ko/en `coena.gooey`/`gooeySr`/`pricing` 추가, `srHero` 삭제(캔버스 소멸). 개인 인스타 핸들 `@_dksrlqor → @4ever2short`(대표 직통, contact 채널 + layout JSON-LD sameAs — 공식 `@lunerviasoft`·틱톡은 그대로) 도 이 커밋에 포함.
- **색상 감사**: 코어 3색 규율 정확히 준수(#171717/#FFF9FA/#21F1A8 + 투명도 파생만). 신규 색 없음 — 요금제 섀도도 rgba 파생. §3-1 받아줘 존 14색은 프레임 밖 유출 없음. 대비 실측 paper/ink 17:1·mint/ink 12:1.
- **검증**: tsc 0 · eslint 0 · build 10라우트 OK · 콘솔 0(/,/work,/why,404) · 320/375px 오버플로 0 · KO/EN 전환 OK · CTA 터치 44px+. 프리뷰 패널이 이 세션 미렌더(document.hidden, rAF 0 — 기존 기록된 환경 이슈 재발)라 스크린샷 불가 → DOM 수치 + **Node 상태머신 시뮬 20s**(전체 순환·3s 점프·NaN 0)로 대체 검증.

## 2026-07-08 — 대개편: 모듈 전삭제 → Coena(코이나) 승격, 홈 초간단화, 소개 통합

사용자 지시(prompt-A-website-section.md + 구두 지시가 스펙을 확장): ① 지시서의 "살아있는 계층" 섹션을 만들되 이름은 **Coena(코이나)** ② 홈 첫 화면은 아주 단순하게 — 받아줘와 Coena만 남김 ③ 소개성 콘텐츠(만든이유·하는일·프로세스)는 비슷한 것끼리 소개로 통합 ④ **모듈(구독/결제) 부분 전체 삭제 — 그 자리를 Coena가 채움**. 지시서의 "모듈 코드 금지·브랜치 작업" 원칙은 사용자 구두 지시(전삭제·main 직행 관행)가 우선해 대체됨.

- **모듈 전삭제**: `app/modules/**`·`app/checkout/**`·`components/modules/**`·`components/checkout/**`·`data/modules.ts`·`lib/subscription.ts` git rm. i18n `modulesHub`/`checkout`/`serviceBuilder` 블록 제거(ko 129-351·en 131-353, **sed 라인삭제** — PS BOM 이슈 회피). sitemap에서 모듈 URL 2개 제거, robots `/checkout` disallow 제거, contact lead의 "월간 모듈" 문구 제거. 빌드 라우트 13→9. `/modules`·`/checkout` = 404 확인.
- **`components/home/CoenaSection.tsx` 신규** (`id="coena"`, ink 시트): 지시서 §4 문구 그대로(KO) + EN 쌍. eyebrow `COENA · 코이나 — LIVING LAYER R&D`(이름 반영), t-display 제목, 본문 2문장, 기능 3줄(mono 민트 태그+설명, 번호 없음), 상태 라인. **CTA는 `PROTOTYPE_URL`/`NOTES_URL` 상수가 비어 있으면 렌더 안 됨**(현재 둘 다 비움 — URL 생기면 파일 상단 상수만 채우면 됨). 사이트 컨벤션(i18n 컨텍스트) 때문에 지시서의 "서버 컴포넌트" 대신 클라이언트 컴포넌트 — 애니메이션은 여전히 순수 CSS.
  - **히어로 SVG(생물 도식)**: viewBox 480², 핵(민트 r36)+dashed 궤도(r58), 비대칭 5제어점 blob 세포막(scale 1↔1.02 9s 호흡, transform-box:view-box), 합격 입자 4(민트, 각기 다른 각도·6.5~11s·딜레이로 막 통과 후 페이드아웃), 불합격 입자 2(#E8735A, 막 근처 왕복 귀환), 마이크로 라벨 3(verify()/retry ×3/pass, mono 11px 35%). 그라데이션·blur·라이브러리 없음, transform+opacity만. **reduced-motion: 기본 CSS가 정적 배치**(합격 2 막 밖·불합격 1 귀환 중)이고 모션은 `no-preference` 쿼리에서만 — 코드 구조로 보장. sr-only 설명 병기.
- **홈 초간단화**: Hero(ink) → Work/받아줘(paper) → **Coena(ink)** → Contact(paper) → Footer(ink). 지시서는 "히어로 다음 다크 슬롯"이지만 히어로가 ink라 그 직후는 교차가 깨짐 → **첫 다크 슬롯(Work 다음)**으로 조정(지시서 §2가 허용한 조정). WhyInvite 섹션 삭제(git rm), i18n `whyInvite`→`coena` 대체.
- **소개 통합(/why)**: WhyHero(ink) → 스토리 4챕터(paper) → **Process(ink) → Services(paper)** 를 홈에서 이식(컴포넌트 재사용, 교차 유지). 홈의 `#services`/`#process` 앵커는 /why로 이동.
- **네비/푸터**: 소개(/why) · 작업(/work) · **Coena(/#coena)** · 문의(/#contact). services/modules 항목 삭제, Header 스크롤스파이 ids [work,coena,contact], isActive의 modules 분기 제거. nav.coena 키 신설.
- **검증**: `.next` 캐시가 삭제 라우트 타입을 물고 있어 tsc 실패 → 캐시 삭제 후 재빌드로 해소(향후 라우트 삭제 시 주의). tsc 0·eslint 0·build 9라우트 OK·콘솔 0·홈/why 섹션 순서·SVG 4요소(막·핵·입자6·라벨3)·애니메이션 동작(transform 실측 변화)·375px 오버플로 0(SVG 335px) 확인.

## 2026-07-04 (5) — 별 섬세화 팩(디자인 방향 제안 후 사용자 채택)

사용자: "별들이 훨씬 더 섬세하고 백엔드적으로 더 탄탄했으면" → 별 섬세화 / 문의폼 백엔드 / 모니터링·CI 등 제안(AskUserQuestion) → **별 섬세화 팩 채택**. 백엔드(문의폼·Sentry·CI·CSP·결제)는 다음 세션 후보로 대기.

- **`components/canvas/sprites.ts` 신설**: MoonParticles 인라인이던 스프라이트 팩토리(`makeGlowSprite`·`makeRadialSprite`) 공용 모듈화 + `makeDotSprite`(원형 광점) 신규. MoonParticles·WritingParticles 공유.
- **MoonParticles 딥필드 고도화**:
  · **별 등급(magnitude)**: `mag=rand^2.6` 멱법칙 — 밝은 별 극소수·희미한 별 다수(실제 밤하늘 분포). 크기·알파·글로우 여부가 mag 로 갈림.
  · **원형 소프트 스프라이트**: r>1.15dpr 인 큰 별은 fillRect→`dotPaper/dotMint` drawImage(확대해도 네모 안 보임). 작은 별은 fillRect 유지(성능).
  · **2주파수 트윙클 + 신틸레이션 버스트**: 트윙클 tw+tw2 합성, 아주 느린 사인의 상위 14% 구간에서만 잠깐 밝아지는 불규칙 깜빡임.
  · **회절 스파이크**: 최상위 등급(mag>0.93)에 상시 십자 스파이크, 트윙클과 함께 길이 호흡.
  · **지구조(earthshine)**: 초승달 위상에서만 어두운 면을 옅은 별점 130개로 채움(alpha 0.03~0.09), shapeIdx 기반 `earthA` lerp 로 형태 전환 시 자연 소멸.
  · **웨이브 모프**: 형태 전환 지연을 랜덤→**중심 거리 기반**(md=maxR/R·SPREAD+지터) — 물결처럼 안→밖 전파.
  · **유성 잔해**: 유성 소멸 지점에서 불티 2~4개가 옅게 낙하하며 사그라짐(`sparks`, drawSparks).
- **WritingParticles(/why) 필기 압력 + 펜촉 미광**: 잉크 굵기·알파를 저주파(꾹 눌러쓰기)+고주파(획) 압력 곡선으로 변조(손글씨 질감). write 모드에서만 펜촉에 민트 글로우 펄스(makeGlowSprite 도입). raw MINT 상수 추가.
- **성능**: 전부 스프라이트 사전 베이크·globalAlpha 유지. 실측 **61fps**(딥필드 diff 1309 = 모션 정상, /why diff 847·민트 픽셀 21 = 잉크·펜촉 미광 렌더). 다크 배경 모서리 (24,24,24)=글로우 얹힌 #171717. dpr 상한 2·픽셀 상한 7M 유지.
- tsc 0 · eslint 0 · build 13라우트 OK · 콘솔 에러 0 · 홈/why 스크린샷 확인.

## 2026-07-04 (4) — 홈 최종 재배치: Work 라이트 2번째 · 만든이유 다크 히어로 3번째 · 완전 교대 복원

사용자 피드백 흐름: ① 히어로+만든이유 다크 연속(~2화면)은 부족해 보임 ② 블랙이 지정 색이 아닌 것 같다 ③ (중간안이었던 다크 패널 카드는) "포인트 짚은 것처럼 섬처럼 있으면 별로" → **차라리 "증명은 배포로 합니다"(Work)를 라이트로 2번째에 두고, 만든이유는 3번째에서 검은 배경 히어로로**.

- **최종 홈 순서**: Hero(ink) → **Work(paper — 라이트로 반전, 2번째)** → **WhyInvite(ink 히어로형, 3번째 — WritingParticles 풀블리드 배경, 92svh, `sheet`)** → Services(paper) → **Process(ink — 다크로 반전)** → Contact(paper) → Footer(ink). **모든 경계가 교대** — 실측 시퀀스 (23,23,23)→(255,249,250)→(23,23,23)→(255,249,250)→(23,23,23)→(255,249,250)→footer(23,23,23).
- **WorkSection 라이트 반전**: bg-ink→bg-paper, paper/*→ink/* 일괄, 라벨 = 민트도트+ink/60, featured CTA 호버는 민트 텍스트(저대비) 대신 **민트 밑줄**(`decoration-mint group-hover:underline`), 받아줘 PixelWindow(§3-1)는 자체 팔레트라 라이트 위에서도 정상 — 스크린샷 확인.
- **ProcessSection 다크 반전**: bg-paper→bg-ink, ink/*→paper/* 일괄, 라벨 `text-mint/80`, 번호 paper/80+민트 언더라인 바 유지. (라이트 3연속 방지 — Services·Contact 사이에서 교대 리듬 유지용.)
- **WhyInvite**: (3)에서 만든 다크 히어로형 복원 + `sheet` 추가(라이트 Work 위로 라운드 닫힘). 민트 단어 "이유"는 fmt(text-mint — 다크 위 고대비). 중간안의 라이트+다크패널 버전은 폐기(로컬 `accent()` 밑줄 렌더러도 함께 제거). `WritingParticles` 의 `variant="panel"` prop 은 남겨둠(미사용, 재사용 가능).
- **블랙 색상 의혹 해소(실측)**: 전 다크 섹션 computed bg = **rgb(23,23,23) = #171717 정확**. 캔버스 모서리 픽셀도 (23,23,23)~(24,24,24) — +1은 성운 후광(paper 0.02α)이 얹힌 별빛 글로우이지 색 지정 오류 아님.
- tsc 0 · eslint 0 · build OK · 콘솔 에러 0 · Work/WhyInvite 스크린샷 확인.

## 2026-07-04 (3) — 홈 재배치: Philosophy 삭제 → "만든 이유" 히어로형 2번째 섹션 승격

사용자 지시: Philosophy 인용문+4카드("화려한 화면보다…"/Clarity/Reliable/Scale/Care)는 홈에서 전부 잘라내고, "루네르비아를 만든 이유"를 **두 번째 섹션**으로 — 히어로처럼 배경(별-글쓰기)을 깔고 크게.

- **홈 순서**: Hero → **WhyInvite(신규)** → Services → Work → Process → Contact. Philosophy.tsx 삭제(git rm), i18n `philosophy` 섹션 제거 → `whyInvite`(label/titleLines/lead/cta) 신설(KO/EN).
- **`components/home/WhyInvite.tsx`**: 히어로 문법 그대로 — `min-h-[92svh] items-end`, 시트 없음(히어로의 밤하늘이 그대로 이어짐), 배경 = `WritingParticles` 풀블리드(책+손 필기 장면, 홈에서 재사용), 콘텐츠 = 민트 eyebrow + 대형 헤드라인 "루네르비아를 / 만든 **이유**"(clamp 2.5rem~5.5rem, 민트 단어 "이유") + 리드 1줄 + `만든 이유 읽기 →`(btnPaper→/why). 아래에서 Services 시트가 닫고 들어옴.
- 4원칙 카피 자체는 /why 스토리 03장(일하는 방식)에 서사로 녹아 있어 내용 유실 없음. Header 스크롤스파이 ids 에서 "philosophy" 제거.
- 시트 교차: ink(Hero)+ink(WhyInvite)는 의도적 연속(한 밤하늘), Process(paper)→Contact(paper)는 동색 시트 오버랩이라 경계 자연 소멸 — 확인됨.
- **검증**: tsc 0 · eslint 0 · `next build` OK · 프리뷰 실측 — 섹션 순서/캔버스 배치 확인(두 번째 섹션 canvas 1), Philosophy 텍스트 0, 스크린샷 확인. 콘솔의 Philosophy label 에러는 편집 도중 HMR 잔재(최종 로드·빌드 정상).

## 2026-07-04 (2) — SMBEST 제거 · /why "만든 이유" 재구축(별-글쓰기) · 민트+가독성 스윕

사용자 지시: ① SMBEST(개인 간 계약) 관련 전부 삭제 ② 강조색 사용 확대 ③ 가독성 최대화 ④ /why 를 "무조건 사람이 읽게" — 히어로급 대형 타이포 + 장문 스토리 + 별이 손·책·글쓰기를 그리는 모션.

- **SMBEST 제거**: i18n ko/en `work.smbest*` 키 + workPage showcase 배열 항목 삭제, `WorkSection` 카드 제거(하단 그리드 3열→2열), `/work` metadata description 갱신. legacy/ 와 PROJECT_NOTES 과거 기록은 보존(서빙 안 됨).
- **`components/why/WritingParticles.tsx` 신규 — "별이 쓰는 글"**: 펼친 책(두 페이지 사변형+책등)과 펜을 쥔 손(펜대·손가락 3마디·손등·엄지·손목 캡슐/타원 샘플링) 실루엣을 별 입자로 구성. 손이 오른쪽 페이지 위를 실제로 이동하며 **민트 잉크 점으로 4줄을 필기**(줄당 2.6s, 단어 공백 랜덤, 손글씨 흔들림) → 줄 사이 transit(펜 들림) → 다 쓰면 hold 1.6s → 잉크 페이드 → 반복. 왼쪽 페이지엔 바랜 기존 글, 주변에 표류+트윙클 별, 진입은 홈과 같은 산개→수렴, 구성 전체 리사주·회전·호흡(정지 없음). MoonParticles 성능 문법 동일(불투명 캔버스·fillRect·픽셀 상한). reduced-motion: 4줄 완성 정적 1프레임.
- **`WhyView` 재구축**: PageHeader 폐기 → 홈 히어로 문법의 풀블리드 다크 히어로(t-hero 2줄 "왜 만들었는지, / 여기 **적어** 둡니다." — 민트 단어 "적어", 마스크 리빌) + `만든 이유 읽기 ↓` 버튼(#story 앵커). 스토리 = **4챕터 장문**(01 이름 / 02 시작(받아줘) / 03 일하는 방식 / 04 앞으로) — max-w-2xl, 17~18px, leading 1.95, text-ink/82, 챕터 헤더 = 민트 도트+모노 번호. 챕터 2·3 뒤 **다크 인용 카드**(bg-ink + t-quote, 민트 단어 — 라이트 지면에서 민트 텍스트 저대비 회피). 마지막 서명 모노 라인 + CTA 2. i18n `why.*` 전면 재작성(heroLines/heroSub/readCta/chapters[4]/quote1·2/sign, KO/EN 쌍), `/why` metadata desc 갱신.
- **홈 Philosophy**: 작은 텍스트 링크 → **대형 초대 블록**(보더 카드, t-quote 크기 "루네르비아를 만든 이유" + `만든 이유 읽기 →`, hover 민트 보더). `philosophy.ctaBtn` 키 신설.
- **민트+가독성 스윕(전 사이트)**: 다크 섹션 eyebrow 라벨 → `text-mint/80`(홈 히어로·Work·Philosophy·PageHeader=전 서브페이지), 라이트 섹션 라벨 → 민트 도트 + ink/60(Services·Process·Contact). 본문 대비 일괄 상향: paper/55~65→/70~78, ink/60~65→/72~75, 카드 설명 text-sm→15px, Process 번호 ink/40→/70+**민트 언더라인 바**, Philosophy 카드 민트 도트, Footer 헤딩 민트/링크·서브 대비↑, 상태 라벨 /40→/55.
- **검증**: tsc 0 · eslint 0 · `next build` 13 라우트 OK(= /why SSG 프리렌더 통과) · /why 실측: 4챕터/16문단/2인용 렌더, 캔버스 픽셀 diff 900(필기 모션 동작), 홈 SMBEST 0·/work SMBEST 0, Philosophy CTA 블록 스크린샷 확인. 콘솔의 WhyView map 에러는 편집 도중 HMR 잔재(빌드+fresh 로드 정상으로 실증).

## 2026-07-04 — 백엔드 하드닝 + 성능 최적화 + 버그 스윕

사용자 지시: "백엔드 더 튼튼하게, 렉 줄게 최적화, 버그 다 잡아".

- **보안 헤더(`next.config.ts`)**: HSTS(2y, preload) · X-Content-Type-Options nosniff · X-Frame-Options DENY · Referrer-Policy strict-origin-when-cross-origin · Permissions-Policy(camera/mic/geo 차단) 전 경로 적용 + `poweredByHeader: false`(X-Powered-By 제거). CSP 는 인라인 스크립트(Next 런타임·JSON-LD)·CDN 허용 목록 관리 비용 대비 보류.
- **캐노니컬 도메인 정합(버그)**: apex 는 www 로 308 리다이렉트되는데 metadataBase·og:url·JSON-LD(url/logo)·sitemap·robots 가 전부 apex 를 가리키고 있었음 → 검색엔진에 리다이렉트 체인 제공. 전부 `https://www.lunervia.xyz` 로 통일(layout `SITE_URL` 상수). 홈 canonical `/` 도 layout 에 추가(서브페이지는 기존 개별 canonical 유지).
- **에러 바운더리 신설**: `app/error.tsx`(세그먼트 — 404 와 같은 디자인 언어, 흐린 크레센트 + "다시 시도"/"홈으로", i18n 컨텍스트 비의존) + `app/global-error.tsx`(루트 최후 방어선, html/body 직접 렌더 + globals.css 자체 import). 이전엔 클라이언트 크래시 = 백지.
- **버그 픽스**: ① ScrollProgress 혜성 머리가 `innerWidth`(스크롤바 포함) 기준이라 끝에서 스크롤바 폭만큼 오버슛 → `documentElement.clientWidth` 로 교정 ② LanguageContext localStorage get/set 을 try/catch — 프라이버시 모드 등 storage 차단 환경에서 크래시 방지(세션 내 전환은 유지) ③ Galmuri CDN `@latest` → `@2.40.3` 고정(릴리스마다 캐시 무효화 + 공급망 노출 제거).
- **MoonParticles 성능 패스(렉 원인 3개 제거)**: ① 매 프레임 radial gradient 3개 생성(성운2+후광) → **사전 베이크 256px 스프라이트**(부드러운 그라디언트는 확대 무손실, `makeRadialSprite`) drawImage + globalAlpha 로 교체 ② ~1,400개/프레임 `beginPath+arc+fill` → **`fillRect`**(이 크기의 점은 시각 동일, 경로 생성 비용 0) ③ 투명 캔버스 → **`alpha:false` 불투명**(#171717 직접 페인트, DOM 합성 알파 블렌딩 제거). 추가: 백킹스토어 **픽셀 상한 ~7M**(초대형·고DPI 에서 dpr 을 부드럽게 하향 — 4K 등에서 렉 방지), 별 표류속도·시차 진폭 사전 계산.
- **검증**: tsc 0 · eslint 0 · `next build` 13 라우트 정적 OK · 콘솔 에러 0 · dev 실측 — 전 보안 헤더 응답 확인·X-Powered-By 소멸·canonical/og www · **60fps 고정, 평균 프레임 16.67ms, p95 16.8ms, 잭 프레임 0/90** · 픽셀 diff 1198(모션 유지) · 스크린샷 시각 동일. 배포 후 라이브 헤더 재검증 필요.
- 참고: dev 콘솔의 footer 심볼 LCP 힌트는 dev 전용 휴리스틱(에러 아님, 기존).

## 2026-07-03 (2) — 히어로 우주화(풀블리드 "궤도에서 본 밤") + 스크롤 진행 민트 바

사용자 지시: ① 스크롤 진행도를 사이트 최상단에 민트로 표시 ② 히어로 파티클을 별도 사각형 박스가 아니라 배경 전체로 ③ "움직이고 멈추고"가 아니라 진짜 우주에 떠 있는 듯한 상시 부유감(섬세하게). 1차본(139f82e) 직후 사용자가 "작업량 올렸어, 다 다시" → 고밀도 재작업(이 항목은 최종본 기준).

- **`components/ScrollProgress.tsx` 신규 — "유성의 궤적"**: 뷰포트 최상단 고정 2px 민트 라인(`z-[60]`, 헤더 z-50 위) + **혜성 머리**(리딩 엣지 20px 민트 그라디언트 팁 + 글로우, 진행 0에선 숨김) — 히어로 밤하늘과 같은 세계관. `scaleX`(바)·`translateX`(머리, `right:100%` 앵커에 px 단위)를 rAF 스로틀로 직접 갱신(리렌더 없음). scroll/resize 리스너 + `documentElement` ResizeObserver(라우트 이동·언어 전환처럼 스크롤 이벤트 없이 문서 높이만 변하는 경우 대응). 위치 피드백 UI라 reduced-motion에서도 유지(전환 효과 자체가 없음). layout.tsx에서 `<Header/>` 앞 전역 마운트. 민트 면적: 2px 라인 — 10% 규칙 안전.
- **`MoonParticles.tsx` 전면 개편 — 박스 오브젝트 → 히어로 전면 밤하늘**: Hero.tsx의 위치 지정 박스(`right-[-18%]…md:w-[min(50vw,660px)]`) 제거, 캔버스가 `inset-0` 풀블리드. 성단 구도는 캔버스 내부에서 계산(데스크톱 cx=0.76W·cy=0.41H·R=0.27min, 모바일 cx=0.72W·cy=0.27H·R=0.34min — 기존 박스 위치 계승).
  - **성운 헤이즈**(신규): 초저알파(0.02~0.031, 호흡) radial 2겹이 느리게 표류 — 검정이 평면이 되지 않게 깊이의 바닥.
  - **딥필드 별**(신규): 90~300개(면적/6500), `depth = rand^1.6`으로 원경 스큐 — 깊이가 크기·밝기·표류 속도(0.12~1.0×, 원경은 기어가고 근경은 흐름)·포인터 시차 진폭을 전부 가른다. 근경(depth>0.75) 30%는 사전 렌더 글로우 스프라이트. 민트 3~6%. 표류는 wrap 순환.
  - **글린트**(신규): 4~10s 간격으로 근경 별 하나가 1.1~1.6s 동안 십자 스파이크+글로우로 잠깐 밝아진다(sin 엔벨로프, 알파 최대 0.5).
  - **유성 2종**(신규): 첫 6~10s 후 1개, 이후 11~25s 간격. 70%는 빠르고 가는 것(0.7~1.05s), 30%는 느리고 밝은 변종(1.4~1.8s, 머리에 점광). 좌하향 12~25°, 1px 스트로크+꼬리 그라디언트.
  - **정지 프레임 제거**: hold 중에도 성단 전체가 캔버스 transform으로 리사주 표류(±6px·±5px) · 기울기 회전(±1.8°) · 호흡 스케일(1±0.008) — 전부 2주파수 합성이라 같은 자세가 다시 오지 않음. 개별 입자 미세 표류도 두 주파수 합성. HOLD_MS 4600→5200.
  - **포인터 시차**(신규): 마우스 이동에 레이어별 진폭 반응 — 성운 2px < 원경 별 1px … 근경 별 5px < 성단 7px(깊이 질서), lerp 0.045 추종, 창 이탈 시 복귀. `(hover: none)`(터치)·reduced-motion 제외.
  - **성능**: globalAlpha + 사전 계산 rgb 문자열(프레임당 색상 문자열 생성 0), 글로우는 사전 렌더 스프라이트 drawImage, dpr 상한 2, 실측 **59fps**. IntersectionObserver/visibilitychange/ResizeObserver 로직 유지.
  - reduced-motion: 초승달+별하늘 정적 1프레임(글린트·유성·시차 없음).
- **검증(프리뷰 :3000 실측)**: tsc 0 · eslint 0 · 콘솔 에러 0(footer 심볼 LCP dev 힌트만, 기존) · 캔버스=히어로 완전 일치(1265×800, 375×812) · 모바일 가로 오버플로 0 · 진행 바 scaleX 0→0.5→1 + 머리 translateX 0→640→1280px·top에서 숨김(프로그래매틱 스크롤 검증은 `scroll-behavior:smooth` 때문에 `behavior:"instant"` 필요) · hold 1초 픽셀 diff 1257(정지 없음) · 합성 pointermove 후 diff 1680(시차 반응) · 59fps · 스크린샷에서 초승달/큰 별/고리 행성 순환 확인.

## 2026-07-03 — 전면 리뉴얼: Next.js 재건축 (Pretendard 원툴 · 파티클 달 · 받아줘 픽셀 구역)

지시서 2건(`lunervia-redesign-prompt_1.md` + `lunervia-typography-patch.md`) 기반 재건축. 부분 수정이 아니라 스택·디자인·카피 전면 교체. 기존 파일은 전부 `legacy/`로 git mv(삭제 없음).

- **스택**: Next.js 16.2(App Router, Turbopack) + TypeScript + Tailwind v4(CSS-first `@theme`). 배포 타깃 Vercel(도메인/DNS 작업은 범위 외 — 배포 가능 상태까지만). GitHub Pages 루트 서빙은 이 커밋들이 push되기 전까지 기존 사이트 유지.
- **디자인 토큰(협상 불가 3색)**: `--black #171717`(다크 섹션 배경/라이트 텍스트) · `--white #FFF9FA`(라이트 배경/다크 텍스트) · `--accent #21F1A8`(민트, 화면의 10% 미만 — 호버·상태 도트·헤드라인 1단어·스크롤스파이 도트·포커스 링·가는 구분선만). 그 외 색은 두 색의 투명도 변형만. Tailwind 유틸 `bg-ink/bg-paper/text-mint`.
- **타이포(패치 반영)**: 마루부리 폐기 → **Pretendard 단일 서체** 극단 웨이트 대비(히어로 900 `clamp(2.75rem,8vw,7rem)` 자간 -0.035em/EN -0.045em, 본문 400-500) + JetBrains Mono(라벨·메타·숫자, next/font). Pretendard는 variable dynamic-subset CDN + preload + `font-display:swap`.
- **시그니처**: 다크 히어로에서 **흩어진 입자 ~900개가 모여 초승달 + 4점 별(로고 모티프 그대로)이 되는 캔버스 연출**(`components/MoonParticles.tsx`, 라이브러리 없음). 진입 1회(헤드라인 줄단위 마스크 리빌과 동기) → 이후 미세 표류·반짝임. IntersectionObserver·visibilitychange로 화면 밖 rAF 정지, reduced-motion은 완성된 달 정적 1프레임. 헤드라인(사용자 확정): **"당신의 생각을 / 현실로 만들어 드립니다."**(민트 = "현실") / EN "Your ideas, / made real."
- **로고 자산**: 사용자 제공 흰색 로고(구 `legacy/assets/brand`)를 알파 경계 트리밍해 `public/brand/`(wordmark 1320×129 · symbol 852×612 · mark 333×505)로. 헤더=워드마크, 푸터=심볼 로크업. 파비콘 `app/icon.svg` + `apple-icon.png` = 민트 크레센트+4점별(#171717/#21F1A8), OG `app/opengraph-image.png` = 다크+화이트 심볼 로크업(1200×630, GDI 생성).
- **IA(사용자 확정 통합안)**: `/`(Hero다크→Services라이트→Work다크→Process라이트→Philosophy다크→Contact라이트→푸터다크, 시트 오버랩 `.sheet`로 경계 연출) · `/modules`(구독 모듈 허브) · `/modules/service-builder`(판매 10섹션: 문제→해결4→샘플→구성품8→대상→비교표→가격3→안내→FAQ6→최종CTA+구매안내, 모달 2종은 섹션으로 흡수) · `/checkout?plan=`(스텁·noindex) · `/work`(받아줘 상세+Lab/SMBEST/Todak — partners 흡수) · `/why`(브랜드 스토리 유지) · 404("달 뒤편"). **sns.html은 Contact 섹션+푸터로 흡수**, partners.html 폐지.
- **§3-1 받아줘 예외 구역**: 사용자 제공 받아줘 소스(`바탕 화면\badajwo`)에서 `MailCat`/`Sprite` 원본 이식(`components/badajwo/`, 의존성 반입 없음). 크림 프레임(`LetterScene`) 안에 구름·하트·잔디·**편지 문 배달 고양이**(bob+꼬리 2프레임). `/work`에선 **쓰다듬기 인터랙션**(클릭→stage 0→3 표정 변화+점프+하트, §2 모션 4종의 유일 예외). 팔레트·모션 모두 프레임 밖 유출 없음. reduced-motion 정지.
- **i18n**: next-intl 대신 **자체 경량 컨텍스트**(`i18n/LanguageContext.tsx` + `ko.ts`/`en.ts` 구조화 사전, localStorage `lunervia-lang`, `<html lang>` 동기화). 사유: 페이지 6개·정적 사전 2개 규모에 미들웨어/로케일 라우팅은 과설계, "불필요한 라이브러리 최소화" 원칙. 전 카피 KO/EN 쌍 재작성(겸손 모드 제거, Vercel/Linear 톤). 도메인 레이어는 `data/modules.ts`+`lib/subscription.ts`로 TS 이식(시그니처 유지, secret 서버 전용 seam 보존, `buildCheckoutUrl`만 `/checkout?plan=`로).
- **모션 4종 준수**: ①히어로 마스크 리빌+달 수렴 ②IO 스크롤 리빌(`Reveal`, 카드 스태거) ③다크↔라이트 경계(시트 라운드 오버랩) ④호버(transform/opacity). `prefers-reduced-motion` 전역 정지.
- **SEO**: Metadata API(페이지별 title/desc/canonical), JSON-LD(Organization+WebSite), `app/sitemap.ts`(5 URL)·`app/robots.ts`(checkout 차단). checkout `robots:{index:false}`.
- **검증**: `next build` 13라우트 전부 정적 프리렌더 OK · tsc 0 · eslint 0(legacy 제외) · 콘솔 에러 0 · 375px 가로 오버플로 0(전 라우트, 비교표는 모바일 카드 스택 전환) · KO/EN 토글+localStorage 영속(EN 자간 오버라이드 동작) · 파티클 달/받아줘 씬/쓰다듬기 실동작 스크린샷 확인. Lighthouse 실측은 배포 후 권장.
- **(추가) 6단계 다듬기 + push**: 히어로 입자를 1100개로 정밀화하고 **형태 순환 모프** 도입(초승달+로고별 4.6s 유지 → 1.5s 모프 → 큰 4점 별+잔별 → 고리 행성(위쪽 고리는 행성 뒤로 컬링) → 반복, reduced-motion 은 초승달 정적). 받아줘 구역은 원본 **PixelWindow**(♡ 받아줘 ♡ 핑크 타이틀바 + Galmuri — §3-1 전용 예외 서체, layout 에 galmuri.css 로드) 프레임으로 교체, 고양이 표정 기본 stage 1(은은한 미소)로 톤다운, **창 안 좌우 산책 모션**(px-stroll 18s steps, 방향 전환 시 scaleX 플립, 호버 시 일시정지), 쓰다듬기는 원본 PettableCat 로직(쿨다운 350ms·하트 2~4개 랜덤 burst·표정 4.5s 후 복귀). 꽃 스프라이트 2종 추가. **2026-07-03 `git push origin main` 완료(6e32dd7..38c0c3d)** — 이 시점부터 GitHub Pages 라이브(lunervia.xyz)는 404. **Vercel 임포트 + 도메인 연결이 즉시 필요**(Pages 는 Next 소스를 서빙 못 함).
- **작업 방식**: 단계별 커밋 6건(smbes 명의). dev 서버는 `dev.cmd`(launch.json `lunervia-next`, :3000). package.json 등 JSON은 **BOM 없는 UTF-8**이어야 함(PS5.1 `Set-Content -Encoding utf8`이 BOM을 넣어 Turbopack이 거부했던 사고 있음 — Write 도구/`WriteAllText`로 저장할 것).

## 2026-06-22 (2) — 히어로 회전 지구본 · 로고 다듬기 · 카피 디-AI화

재설계 후속 작업(같은 날). 이 항목까지 반영해 배포(사용자 "푸시" 지시).

- **히어로 우측 = 실제 대륙이 자전하는 지구본**. 원래 있던 AI 코드 에디터 패널(`lunervia/app.tsx`·SYSTEM_READY·Build passed)을 사용자가 "이걸 로더로 교체하라"고 해서 교체. (처음엔 인트로 프리로더로 오해해 구현 → 프리로더 제거하고 히어로 비주얼로 이동.)
  - 실제 세계지도(world-atlas 110m → topojson merge) 해안선을 41링/1640점으로 데시메이션해 `<script type="application/json" id="globe-land-data">`(약 11.6KB)로 index.html 에 인라인. **외부 라이브러리 없음.**
  - `script.js` `initHeroGlobe`: 직교투영(orthographic) 자전, tilt 20°, 뒷면 cull, 회전속도 `0.0002 rad/ms`(약 31s/회전). 초기 `draw(0)` 정적 프레임 필수(화면 밖이어도 대륙 보이게). IntersectionObserver + visibilitychange 로 **화면 밖/백그라운드 시 rAF 정지**(성능). reduced-motion 정적.
  - 마크업 `.hero-globe` > `svg.globe-svg`(`#hero-globe-grat`/`#hero-globe-land` path + whirl 링/오빗 도트 + globe-disc/edge) + `Global-ready` 칩. CSS `.hero-globe/.globe-disc/.globe-grat/.globe-land-path/.whirl*/.hero-globe-tag`. 구 `.code-*`/`.preloader`/`.loader-globe` CSS 는 일부 dead 로 남음(무해).
  - 데이터 재생성: `npm i topojson-client world-atlas` → merge + 거리기반 데시메이션(`/tmp/lvglobe`).
- **로고 다듬음**: 헤더 `.brand-mark` 를 잉크 라운드스퀘어 + **달(lune) 크레센트 + 퍼플 도트**(매끈한 곡선)로 교체. 파비콘도 전 페이지 동일 모티프(구 Georgia serif "L" 제거).
- **카피 디-AI화**("글자가 AI 같다" 피드백): hero/services/process/work 제목·리드 담백하게 재작성(KO/EN). 예) services.title `한 화면이 실제 서비스가…` → `Lunervia가 하는 일`, process.title `정돈된 과정에서…` → `이런 순서로 만듭니다`, hero "AI 시대의…" → "사용자가 쓰기 쉬운 웹서비스를…".
- 검증: 데스크톱 지구본 430px·모바일 335px, 가로 오버플로 0, 콘솔 0, 투영 방향 정확. 자전은 rAF 라 보이는 탭에서만(프리뷰 hidden 탭/screenshot 도구는 이 세션 먹통이라 eval·좌표로 검증). **클로드 디자인(visualize show_widget)으로 로더/로고 시안 인라인 렌더**(1차 시안 "대충" 반려 → D3 실측 지구본 재시안 → 글로벌 확정).
- 캐시 버스팅 `?v=20260622a → ?v=20260622e` (중간 b/c/d 거침). 폰트도 전 페이지 Pretendard+Inter+JetBrains 로 교체됨.

## 2026-06-22 — 프리미엄 소프트웨어 스튜디오 재설계 (디자인 시스템 + 메인 전면 개편)

사용자 요청: "고급 AI 소프트웨어 스튜디오 / AI 코딩 기술 브랜드 / 프리미엄 웹서비스 제작사"처럼 보이도록 프론트엔드·UI/UX·디자인 시스템·타이포·인터랙션·반응형·성능까지 전면 강화. **순수 HTML/CSS/JS 유지** (React/Next/Tailwind 미도입 — GitHub Pages 정적 배포 모델 보존 + "불필요한 라이브러리 금지" 룰). **이번엔 git push/commit 보류** (사용자가 "완성본 바로 푸시하지 말아줘" 라고 함 → 검토 후 별도 지시 시 배포). 백업: `index.html.bak-20260622` · `styles.css.bak-20260622` · `script.js.bak-20260622`.

- **디자인 토큰 전면 교체** (`styles.css` :root): 크림 베이스 유지(`--bg #F7F3EA`), 포인트를 **브라운 → 조용한 AI 퍼플**(`--accent #6A4DE0` 텍스트용 AA 5:1, `--accent-bright #7C5CFF` 글로우/오브용), 잉크 텍스트 `#161616`, 경계선은 잉크 기반 rgba 투명도. 신규 토큰: `--code-green #2F855A`, `--warning-soft`, 코드에디터 IDE 라이트 테마 팔레트(`--code-*`), shadow(`--shadow-sm/md/lg/accent`), radius 8~28px. `--px-*`(픽셀)·`--tml-*`(받아줘 로즈)는 유지.
- **폰트 교체** (궁서체/Georgia·Space Grotesk·Plus Jakarta 전면 제거): 본문/한글 **Pretendard**(jsdelivr variable dynamic-subset), 영문 디스플레이 **Inter**(Google), 코드/라벨 **JetBrains Mono**(Google). `--font-sans/display/mono` 매핑. 파비콘도 Georgia serif "L" → Inter sans "L" + 퍼플 도트로 교체(전 페이지).
- **메인(`index.html`) 전면 재작성** — 새 섹션 흐름: Hero(좌 카피 + 우 **AI 코드 에디터 패널**: 탭·라인넘버·구문 강조·SYSTEM_READY 배지·Build passed/UX flow optimized 로그·blinking caret + 얇은 grid·gradient orb·떠다니는 상태 노드) → **Capability Strip**(역량 6개) → **01 Services**(6 카드: Web Service Dev / Frontend System Design / UI/UX Redesign / Landing Page Opt / Brand Experience / AI Workflow Integration, 선형 아이콘 + 모노 태그 + hover 부상/그라데이션) → **02 Process**(5단계 타임라인 + 상태배지 + 우측 **다크 터미널 build.log** sticky 패널) → **03 Work**(받아줘 픽셀 배너를 Featured 로 유지 + 보조 카드 3개: Lunervia Lab/SMBEST/더 많은 프로젝트→partners.html) → **04 About**(메타 4개) → **05 Philosophy**(빅 인용구 + 4 원칙: Clarity before complexity / Reliable interfaces / Designed to scale / Built with care, 영문 제목+한글 보조) → **06 Contact**(좌 CTA 2개 + 우 4채널 카드 패널) → Footer(+ status dot "Available for new projects"). skip-link 추가.
- **헤더 개편**: nav `소개▾(브랜드/철학/전체 프로젝트/Why) · 서비스 · 작업 · 프로세스 · 문의 · 모듈 · SNS`. **스크롤 스파이**(`script.js` 7b) — 현재 섹션 nav 링크에 `aria-current="page"` 부여 + CSS 밑줄 강조. sticky + blur + border 유지.
- **`styles.css` 구조**: 토큰~푸터+반응형+신규 컴포넌트는 새로 작성(코어 1~17번), **페이지 전용 블록(Showcase 마키·Take My Letter 배너·Article·Why 오버레이·Partners·SNS·Module·Modal·전역 reduced-motion)은 백업에서 그대로 이어붙임**(18~20번). 헤더/푸터/토큰이 공유라 새 디자인이 sns/partners/module/why 전 페이지에 일관 전파. 다른 페이지 마크업은 미수정(폰트 링크·파비콘·캐시버전만 갱신).
- **i18n**: `script.js` I18N 에 KO/EN 모두 신규 키 추가(`nav.services/work/process`, `nav.intro.projects*`, `hero.cta.work`, `services.*`, `process.*`, `work.*`, `philosophy.card*.kr`, `tml.role`) + 변경 키 갱신(`hero.*`, `philosophy.big/card1~4`, `contact.title/lead`, `about.focusValue`, `tml.label`). 미사용 `trust.*`/`about.step*` 키는 무해하게 잔존.
- **반응형/접근성/성능**: 375px 가로 오버플로 0 확인. 모바일 히어로 스택·프로세스 단일열·연락처 스택·서비스 1열. 모션은 transform/opacity 중심, 전역 `prefers-reduced-motion` 리셋이 caret/펄스/오브 정지. `aria-hidden` 장식, 키보드 포커스, heading 구조 유지.
- 검증(로컬 :8095, preview): 콘솔 에러 0, 데스크톱/모바일 전 섹션 렌더, KO/EN 토글 전체 전환, 스크롤 스파이 동작, partners/sns(CRLF 폰트 수정)/module 페이지 무결성 확인.
- 캐시 버스팅 `?v=20260620b → ?v=20260622a` (index/partners/sns/why/module 일괄). sitemap `/` lastmod 2026-06-22.

## 2026-06-20 (2) — 개인 SNS 핸들 변경 (@dksrlqor → @_dksrlqor)

개인 Instagram·TikTok 핸들을 `_dksrlqor` 로 변경. 공식 `@lunerviasoft` 와 GitHub 저장소(dksrlqor/lunervia)는 그대로 유지.

- personal IG URL `instagram.com/dksrlqor/ → instagram.com/_dksrlqor/`, TikTok URL·핸들 표기 `@dksrlqor → @_dksrlqor` 일괄. 위치: index(JSON-LD sameAs · Contact 카드 · Footer) · partners(Footer) · sns(개인 IG/TikTok 카드 + Footer) · module-service-builder(Footer). why.html 은 해당 링크 없음.
- 캐시 버스팅 `?v=20260620a → ?v=20260620b` 전 HTML 일괄.

## 2026-06-20 — Service Builder Module 판매 페이지 추가 (Lunervia Module 시리즈 01)

디지털 상품(문서형 AI 모듈) 상품 상세/판매 랜딩을 새 서브페이지로 추가. 기존 디자인 시스템(크림 톤·공유 nav/footer·i18n) 그대로 재사용.

- 신규 `module-service-builder.html` — sns.html 골격(head/nav/footer) 복제 + `<main class="module-page">` 10섹션: 히어로 · 문제 제기 · 해결 방식(분석→판단→출력→검수 4단계) · 구성품(8 아이콘 카드) · 누구에게 · 무료 프롬프트 비교표 · 가격(Starter 14,900원 / **Pro 39,000원 추천** / Custom 별도 문의) · 구매 전 안내 · FAQ(`<details>`) · 최종 CTA. 경량 모달 2종(예시 진단 결과 / 구매 안내).
- 포지셔닝: "프롬프트 모음"이 아니라 "범용 AI(ChatGPT·Claude·Gemini·Cursor) 전문화 레이어·작업 시스템". 과장 표현("100% 보장"·"전문가 완전 대체" 등) 금지 준수, 차분한 브랜드 톤.
- **구매 흐름(결제 미연동):** 자동 다운로드 막고 가격만 노출 + 먼저 써보려면 Instagram DM(@lunerviasoft) 문의 → 계좌이체로 패키지(zip·노션) 수동 전달. 히어로/최종 "받기"는 `#pricing` 스크롤, 가격 카드 CTA는 구매 안내 모달(선택 플랜 주입).
- `styles.css` 끝에 `MODULE PAGE` 섹션 추가(토큰·프리미티브 재사용, 반응형 ≤920/≤560, 센터 모달). `.visually-hidden` · `body.modal-open` 스크롤 잠금 추가.
- `script.js`: i18n `mod.*`(146키)·`nav.module` KO/EN 일괄 추가. 모듈 페이지는 **새로고침 시 메인으로 안 보내고 그 자리 유지**(맨 위 스크롤)하도록 #0 예외 처리. 가드형 `initModulePage()`(포커스트랩 경량 모달 + 플랜 주입). FAQ는 `<details>`라 JS 불필요.
- 상단 nav(프로젝트↔문의 사이) + 푸터 Explore 에 `모듈` 링크 추가 — index/partners/sns + 신규 페이지. why.html은 구형 nav/footer(미사용 SEO fallback)라 캐시 버전만 갱신하고 링크는 생략.
- `sitemap.xml` 에 module-service-builder.html(priority 0.8, lastmod 2026-06-20) 추가, `/` lastmod 갱신.
- 캐시 버스팅 `?v=20260612e → ?v=20260620a` (index/partners/sns/why/신규 일괄).
- 검증(로컬 :8095): 콘솔 에러 0, KO/EN 토글 전체 전환, 375px 가로 스크롤 없음, 가격 3카드 Pro 추천 강조, 두 모달 열기/닫기·포커스트랩·스크롤 잠금·플랜 주입, 모듈 페이지 새로고침 유지 + sns는 기존대로 메인 바운스(회귀 없음) 확인.

## 2026-06-12 (5) — Take My Letter 픽셀 풍경 디테일 강화 (섬세하게)

사용자 요청: 더 섬세하게.

- 픽셀 스프라이트를 inline `<svg class="tml-defs"><defs><symbol>…` 12종으로 정의하고 장면은 `<use href="#...">`로 재사용(마크업 간결 + 재사용). symbol: 해(음영/하이라이트) · 구름 · 새 · 편지 · 둥근나무(4톤 음영) · 솔잎나무 · 덤불 · **우편함(로즈, 깃발)** · 튤립꽃 · 데이지꽃 · **나비** · 잔디포기.
- 장면 구성 확장: 구름 3 · 새 2 · 근경 둥근나무 2 + 솔잎나무 1 + 덤불 1 · 원경(흐릿) 나무 3(깊이감) · 우편함 1 · 꽃 4(튤립/데이지) · 잔디포기 2 · 나비 1(살랑 flutter) · 편지/하트.
- 잔디 그라데이션 5단계로 더 부드럽게, 윗면 픽셀 잎 결 유지. 배너 키움: min-height clamp(320→404), `--tml-ground-h` clamp(106→142).
- `.tml-scene svg { shape-rendering: crispEdges }`로 use 콘텐츠도 픽셀 또렷하게. `.tml-defs`는 0×0 숨김.
- 모바일은 구름2·3, 원경나무, 새2, 꽃4, 잔디포기2 숨겨 산만함↓. reduced-motion에서 모든 모션 정지(전역).
- 캐시 버스팅 `?v=20260612e`.

## 2026-06-12 (4) — Take My Letter 배너를 8비트 픽셀 풍경으로 재제작

사용자 요청: 배너를 받아줘 사이트 감성처럼 8비트로, 하늘·땅·나무 있는 풍경으로. + "섬세하게".

- 기존 앱아이콘 이미지(`work-badajwo.png`) 제거 → 순수 CSS/inline-SVG 픽셀 풍경으로 교체(성능도 개선, 1.3MB 이미지 안 씀).
- `.tml-scene`(aria-hidden) 구성: 노을 핑크 하늘(배너 배경 그라데이션) + 픽셀 해(글로우 drop-shadow) + 구름 2개(천천히 드리프트) + 떠다니는 하트 2개 + 날아가는 편지봉투(float+rotate) + 잔디 땅 밴드(`.tml-ground`, 결 텍스처 + 윗면 픽셀 잎 `::before`) + 근경 나무 3 + 덤불 + **원경 나무 3(흐릿·작게 → 깊이감)** + 작은 새 2 + 꽃 3.
- 나무는 SVG 한 장 slice 방식이 위쪽을 잘라 안 보이던 문제 → 땅은 CSS 밴드, 나무/덤불/꽃은 개별 스프라이트를 `--tml-ground-h` 기준 `bottom: calc(...)`로 지면에 세움(항상 보이고 크기 일정).
- 가독성: 텍스트는 좌측 크림 스크림(`.tml-banner::before`, 데스크톱 가로/모바일 세로 그라데이션) 위에. 모바일은 `--tml-ground-h` 낮추고 스크림 더 덮어 url 까지 크림 위. 모바일은 원경나무·작은 구름 숨김.
- reduced-motion: 전역 규칙으로 구름/편지/하트/새 애니메이션 정지(정적 풍경).
- 캐시 버스팅 `?v=20260612d`.

## 2026-06-12 (3) — 메인에 Take My Letter(받아줘) '하러가기' 피처 배너 추가

사용자 요청: 메인 아래에 자체 작품 takemyletter.site 로 가는 탭(배너)을 받아줘 감성으로 추가.

- 위치: Philosophy(02) 와 Contact(03) 사이, 번호 없는 풀 배너 섹션 `.section-tml`. 카드 전체가 `https://takemyletter.site` 새 탭 링크.
- 비주얼: 실제 받아줘 앱 아이콘 `assets/brand/work-badajwo.png` 사용(둥근 사각, lazy + width/height 로 CLS 방지, 1.3MB 라 below-the-fold lazy 로딩). 좌측 아이콘 + 우측 라벨/제목/설명/CTA. 떠다니는 작은 하트 3개(CSS, aria-hidden).
- 톤: Lunervia 크림 베이스에 받아줘의 따뜻한 핑크/편지 감성. 신규 토큰 `--tml-rose #A85878`(CTA, 흰 글씨 AA 4.8:1), `--tml-rose-hover`, `--tml-pink-soft`, `--tml-pink-line`. 배경은 cream→#FCEAF0 그라데이션 + 우상단 핑크 글로우.
- 접근성: 배너 `a` 에 aria-label, 아이콘 `alt=""` + `aria-hidden`(장식), 하트 장식 aria-hidden, CTA 텍스트는 i18n. hover 시 살짝 부상 + CTA 진한 로즈.
- i18n 신규 키 `tml.label/title(html)/desc/cta` (KO/EN). 반응형 ≤720 1열 스택, 360px 가로 스크롤 없음 확인.
- 캐시 버스팅 `?v=20260612c`.

## 2026-06-12 (2) — 주요 프로젝트 섹션을 메인에서 분리, 상단/푸터 '프로젝트' 링크로

사용자 요청: 주요 프로젝트는 메인이 아니라 별도 페이지에 두고, 상단 네비와 푸터에서 연결.

- 메인 `01 / Projects` 마키 섹션 제거 → 섹션 번호 원복 (About 01 / Philosophy 02 / Contact 03). TRUST 밴드는 히어로 바로 아래 유지.
- `partners.html` 을 `주요 프로젝트 및 협력` 페이지로 격상: head title/og/description, hero(eyebrow `Projects` · 제목 `주요 프로젝트 및 협력` · 보조 `Projects & Works` · 신규 리드), 마키 region aria-label 갱신. i18n `showcase.label/title/subtitle/lead` 값 교체 (KO/EN).
- 상단 네비/푸터 링크 라벨 `협력` → `프로젝트` (`nav.partners` 키 KO `프로젝트` / EN `Projects` — index/partners/sns 정적 기본 텍스트도 동기화). href 는 그대로 `partners.html` 새 탭.
- 히어로 CTA `프로젝트 보기` → `partners.html` 새 탭 (`#projects` 앵커 제거됨).
- `projects.*` i18n 키 제거(미사용), `.section-projects` CSS 제거. `is-pixel`(Lab 플라스크)·`showcase-card-role` 은 partners 마키에서 계속 사용.
- 캐시 버스팅 `?v=20260612b`.

## 2026-06-12 — 포트폴리오형 브랜드 사이트 개편 (히어로 대시보드 + Projects 마키 복귀)

고객 신뢰·포트폴리오 설득력·문의 전환을 높이는 방향으로 메인 페이지 전면 개편. 8비트 고양이/픽셀 캐릭터는 이번 작업에서 제외 (나중에 별도 작업으로 추가 예정).

- **Hero 좌측 카피 교체**: eyebrow `Lunervia Software Studio`, h1 `사용자 경험을 설계하고,<br/>작동하는 웹서비스를 만듭니다.` (data-i18n-html, keep-all 줄바꿈), 서브 카피·CTA 2개(`프로젝트 보기` → `#projects` / `문의하기` → `#contact`), 신뢰 태그 칩 5개 (UX Design / Web Service / Frontend / Product Planning / Brand Experience).
- **Hero 우측 — 터미널 창 제거 → 서비스 제작 대시보드** (`.dashboard-preview`, aria-hidden 장식): 브라우저 바(`lunervia.studio — service build`) + Build Process 5단계 (Plan/UX Flow/UI Design/Frontend/Launch, Done·In progress·Next·Ready 상태 + 진행률 바) + Checklist/Focus 카드 + `Ready to build` 상태 배지(세이지 그린 펄스 도트). 장식 텍스트라 i18n 비대상. 기존 터미널 타이핑 JS 모듈(#5) 통째 제거.
- **TRUST 섹션 신설** (히어로 바로 아래, 번호 없음): `Lunervia가 중요하게 보는 것` + 카드 3개 (이해하기 쉬운 흐름 / 실제로 작동하는 구현 / 오래 다듬을 수 있는 구조). `--bg-soft` 배경 밴드.
- **01 / Projects 섹션 신설**: Showcase 마키를 메인에도 복귀 (`#projects`, partners.html 은 그대로 유지 — 같은 `renderShowcase()` 가 `#showcase-track` 만 있으면 채움). 섹션 번호 재조정: Projects 01 / About 02 / Philosophy 03 / Contact 04.
- **SHOWCASE 배열 확장**: `Lunervia Lab` 카드 추가 (픽셀 플라스크 SVG 미디어 `is-pixel`, 상태 `준비 중`, 역할 `서비스 실험 · UI 연구 · 프로토타입`). 받아줘 카드에 상태(`운영 중 · takemyletter.site`)+역할(`기획 · UX 구조 · UI 방향 · 프론트엔드`) 추가. 렌더러에 `statusKey`/`statusSuffix`/`roleKey` 지원 + `.showcase-card-role` 스타일.
- **About 개선**: 타이틀 `아이디어를 실제 서비스로 만드는 작은 소프트웨어 스튜디오`, 4단계 카드 (`.about-steps` — 기획/UX 설계/UI 개발/개선, 미니 픽셀 아이콘, 데스크톱 4열·태블릿 2열·모바일 1열).
- **Philosophy**: 빅 인용구 `감각적인 화면보다 오래 쓰이는 경험을 먼저 설계합니다.` + 카드 4개로 확장 (Maintainable structure 추가, 2x2 그리드). 카드 설명 전부 새 문구.
- **Contact**: 리드 `프로젝트 문의는 Instagram DM으로 가장 빠르게 확인합니다. 웹서비스 제작/랜딩페이지 개선/브랜드 사이트 구성/UI/UX 정리…` + CTA 버튼 2개 (`Instagram으로 문의하기` → @lunerviasoft / `프로젝트 제안하기` → @_dksrlqor).
- **토큰 추가**: `--px-*` 픽셀 팔레트(크림/브라운/핑크/오렌지 — about 아이콘·향후 픽셀 작업용), `--ok/--ok-soft/--ok-line` (세이지 그린), `--cream-shadow`.
- **가독성/반응형**: `.hero-title/.section-title/.section-lead` `word-break: keep-all`, hero 타이틀 클램프 2.05–3.3rem. 360px 가로 스크롤 없음 확인. ≤960 히어로 스택(텍스트 먼저) + 대시보드 max-width 560 중앙. ≤480 대시보드 1열 + 사이드 카드 가로 랩.
- **접근성**: 대시보드 전체 aria-hidden, h1 1개 유지, 마키 클론 `aria-hidden + data-clone` 그대로, reduced-motion 에서 `statusPulse` 등 전부 정지 (전역 규칙).
- i18n 신규/갱신 키: `hero.*`(title 은 html 키), `projects.*`, `trust.*`, `about.step1~4.*`, `philosophy.card4*`, `contact.cta.instagram/propose`, `showcase.lab.*`, `showcase.badajwo.status/role` — KO/EN 양쪽. `hero.cta.brand` 제거.
- sitemap lastmod 갱신 (/ 와 partners.html → 2026-06-12). 캐시 버스팅 `?v=20260612a` (index/partners/sns/why 일괄).
- 검증: 로컬 서버 + 360px/744px 뷰포트, 콘솔 에러 0, KO/EN 토글, CTA 앵커, 마키 클론 8장(원본4+클론4), partners.html Lab 카드 포함 정상.

## 2026-06-03 — 로고 클릭 강제 reload + 새로고침 시 메인 hero 진입

브라우저 새로고침과 브랜드 로고 클릭 동작을 사용자 의도대로 통일.

- 어떤 페이지에서 새로고침해도 항상 메인의 hero 부터 보이도록 `script.js` IIFE 진입 즉시 navigation type 검사. `performance.getEntriesByType("navigation")[0].type === "reload"` 이면:
  - 서브 페이지(sns / why / partners …) 였으면 `location.replace("index.html")` 으로 메인으로 이동.
  - 메인 페이지였으면 `history.scrollRestoration = "manual"` 로 두고 `window.scrollTo(0,0)` 즉시 + `load` 이벤트에서 한 번 더, URL 해시도 `history.replaceState` 로 제거.
- 헤더·푸터 브랜드 로고 클릭 → "무조건 새로고침". `index.html` 의 헤더 brand `href="#hero" id="brand-link"` → `href="index.html"` 로, 푸터 brand 도 동일하게 `href="index.html"`. `script.js` 에 `.brand, .footer-brand` 통합 핸들러 — 메인이면 `location.reload()`, 다른 페이지면 `location.assign("index.html")`. 기존 `#brand-link` 부드러운 스크롤 모듈은 제거.
- 캐시 버스팅 `?v=20260603c`.

## 2026-06-03 — Showcase 마키를 별도 페이지 `partners.html` 로 분리

메인 03 섹션에 있던 Showcase 마키(주요 고객 · 작품 · 파트너)를 별도 페이지로 옮기고, 상단 네비/푸터의 `협력 / Partners` 링크가 새 탭으로 열도록 변경. 메인은 잠시 더 단순한 1·2·3 (About / Philosophy / Contact) 흐름으로 운영.

- 새 페이지 `partners.html` 생성 (sns.html 톤 동일 헤더/푸터). 본문은 partners-hero (eyebrow `Showcase` · `주요 고객 · 작품 · 파트너` · 영문 보조 · 리드) + 페이지 풀폭 `.showcase-marquee` (#showcase-track 컨테이너) + back-link. 카드는 `script.js` 의 `renderShowcase()` 가 그대로 채움 — 새 페이지에 별도 코드 없음.
- `index.html`: 기존 `section-showcase` (#partners) 블록 통째 제거. Contact 섹션의 `section-label-num` 04 → 03. 네비 `협력` 링크와 푸터 Explore `협력` 링크를 `partners.html target="_blank"` 로 변경.
- `sns.html` / `why.html` 네비/푸터의 `협력` 링크도 `partners.html target="_blank"` 로 통일.
- `styles.css`: SNS PAGE 블록 앞에 `.partners-page` / `.partners-page-inner` / `.partners-hero` / `.partners-hero-title` / `.partners-hero-sub` / `.partners-hero-lead` 추가. `.partners-page .showcase-marquee` 에 위/아래 margin 보강 — 페이지 풀폭으로 흘러도 헤더/back-link 와 적절한 여백 유지.
- `sitemap.xml` 에 `https://lunervia.xyz/partners.html` 추가 (priority 0.8, monthly). 다른 URL 들 lastmod 갱신.
- 캐시 버스팅 `?v=20260603b`.

## 2026-06-03 — Why 오버레이 협력 파트너 블록 제거 + partner-todak.png 삭제

메인 03 섹션이 Showcase 마키로 바뀌면서 Todak Life 가 이미 거기에 들어갔고, Why Lunervia 오버레이 안에 따로 있던 협업사 카드(구 Todak Aquarium Diary)는 중복이 되어 정리.

- `index.html` 의 `<section class="why-partners">` 블록 통째 제거. Why 본문은 브랜드 이야기에만 집중.
- `styles.css` 의 `.why-partners` / `.why-partners-title` / `.why-partners-intro` / `.why-partner-card` / `.why-partner-media` / `.why-partner-media img` / `.why-partner-content` / `.why-partner-kicker` / `.why-partner-desc` / `.why-partner-actions` / `.why-partner-actions a` (hover 포함) + 720px 모바일 반응형 제거.
- `script.js` 의 `why.partners.title` / `why.partners.intro` / `why.partners.todak` i18n 키 KO/EN 양쪽 제거.
- 자산 정리: `assets/brand/partner-todak.png` (구 Todak 어항일기 어항 아이콘) 삭제. 이제 사이트 어디에서도 참조하지 않음.
- 캐시 버스팅 `?v=20260603a`.

## 2026-05-30 — Showcase 마키 섹션 (주요 고객 · 작품 · 파트너)

메인 03 섹션을 단일 협력사 카드(Todak Aquarium Diary)에서 **주요 고객 / 루네르비아 작품 / 파트너** 세 가지 성격을 함께 보여주는 marquee 쇼케이스로 교체했습니다. 받아줘는 협력사가 아니라 루네르비아가 직접 만든 자체 웹 서비스로 명확히 구분해 표기.

- `index.html` 의 `section-partners` (Todak 카드) → `section-showcase` + `.showcase-marquee` + `.showcase-track` 빈 컨테이너로 교체. 섹션 id 는 앵커 호환성 위해 `#partners` 유지.
- `script.js` 안 `SHOWCASE` 배열 + `renderShowcase()` 추가 — 카드 한 세트를 그린 뒤 `aria-hidden="true" data-clone="true"` 로 한 번 더 복제하여 seamless loop.
- 카드 마크업은 i18n 키만 박아두고 `applyI18n` 이 텍스트 매핑. KO/EN 토글 시 카드 라벨/타입/설명이 자동 갱신됨.
- 새 i18n 키: `showcase.label/title/subtitle/lead/comingSoon`, `showcase.label.{client,work,partner}`, `showcase.type.{client,work,partner}`, `showcase.{smbest,badajwo,todak}.desc`. 기존 `partners.label/title/lead/name/desc` 는 제거 (`why.partners.*` 는 Why 오버레이 전용이라 그대로 유지).
- `styles.css`: 기존 `.partner-card / .partner-media / .partner-img / .media-placeholder / .partner-actions / .section-partners` 통째 제거 + 모바일 반응형 정리. 새 `.section-showcase / .showcase-marquee / .showcase-track / .showcase-card-*` 컴포넌트와 `@keyframes showcase-scroll`, fade mask, hover-pause, 720px/480px 반응형, `prefers-reduced-motion` 분기 추가.
- 카드 미디어 스타일 3종: `is-logo` (흰 배경 + 내부 패딩, SMBEST 류 기업 로고용) / `is-icon-rounded` (앱 아이콘처럼 둥근 사각, 받아줘) / `is-avatar` (CSS/SVG 기본 프로필 아바타, Todak Life).
- 카드 호버 → `translateY(-3px)` + 부드러운 그림자 + arrow 살짝 이동. 마키 전체에 hover 시 `animation-play-state: paused`.
- 첨부 이미지 자산: `assets/brand/client-smbest.png` (SMBEST 로고), `assets/brand/work-badajwo.png` (받아줘 앱 아이콘) — 사용자가 직접 두 파일을 해당 경로에 저장해야 함. 파일이 없으면 카드 이름 텍스트 placeholder 가 자동 표시.

## 2026-05-30 — Todak App Store 링크 제거 (서비스 종료)

토닥 어항일기 앱이 서비스 종료되어 App Store CTA를 제거했습니다. (메인 partner-card 와 Why 오버레이 내 partner-actions 양쪽) Instagram(@todaklife) 만 채널로 남김.

## 2026-05-30 — Products 페이지·Night Letter 제거

Night Letter 프로젝트를 더 이상 진행하지 않게 되어, 관련 콘텐츠와 흔적을 사이트에서 통째로 정리했습니다.

- `products.html` 페이지와 사용하지 않게 된 `assets/brand/product-letter.png` 자산 삭제.
- 상단 네비 '제품' 드롭다운, 푸터 Explore '제품' 링크, `sitemap.xml` 의 products URL 제거.
- `script.js` 의 `nav.products*` / `products.*` / `product.*` / `hero.cta.products` i18n 키와 `.product-card` 폴백 코드 정리.
- `styles.css` 의 `.product-card` / `.product-media` / `.products-page` / `.badge*` / `.feature-pills` 블록과 모바일 반응형 규칙 제거. partner 에서도 쓰는 `.media-placeholder`, `.partner-img` 만 남김.
- Hero 좌측 첫 CTA 를 `제품 살펴보기 → products.html` 에서 `브랜드 살펴보기 → #about` 로 변경.
- 메인 메타 description / keywords 에서 Night Letter 표현 제거.

## 2026-05-24 — 정식 소프트웨어 브랜드 사이트 업그레이드

이전 단일 섹션 구성에서 정식 브랜드 사이트 수준으로 확장했습니다. 모든 작업은 순수 HTML / CSS / JS 만 사용했으며 외부 프레임워크 의존성이 없습니다.

### 사이트 구조 (단일 페이지 + 내부 오버레이)

상단 네비게이션
1. `Lunervia` 워드마크 (헤더 좌측) — 클릭 시 부드럽게 맨 위로
2. 메뉴: 소개 · `협력`(새 탭으로 `partners.html`) · 문의 · `SNS`(새 탭으로 `sns.html`) · `Why Lunervia` (오버레이 트리거)
3. 우측에 KO / EN 언어 토글

본문 섹션 — 모두 `01 / About` 형태의 번호 라벨 + 큰 타이틀
- `01 / About` — 브랜드 한 단락 + 4개 메타 (Founded / Based in / Focus / Stage)
- `02 / Philosophy` — Brand Manifesto 블록인용구 + 3개 매니페스토 카드 + `루네르비아를 만든 이유` 자세히 읽기 CTA
- `03 / Contact` — 공식 Instagram / 개인 Instagram / TikTok / Email coming soon (4 카드)

> 메인에 있던 Showcase 마키 (주요 고객 · 작품 · 파트너) 는 별도 페이지 `partners.html` 로 분리됨. 상단 네비 / 푸터의 `협력 / Partners` 링크가 새 탭으로 열어줌.

SNS 페이지 (sns.html)
- 상단 네비 `SNS` 또는 푸터 `모든 SNS 모아보기` 링크로 새 탭 열림.
- 카드별 플랫폼 풀 브랜딩 — 인스타 카드는 보라·핑크·오렌지 그라데이션이 천천히 도는 모션, 틱톡 카드는 블랙 + 시안/마젠타 글로우 글리치 모션.
- 4 카드 구성: 공식 Instagram, 개인 Instagram, TikTok, Email (조용한 회색).
- 헤더/푸터/언어토글은 메인과 동일 마크업 — `script.js` 의 i18n / 메뉴 토글 등이 그대로 작동.

Hero
- 좌: eyebrow / 큰 타이틀 / 부 카피 / CTA 2개 / 브랜드 키워드 칩 (Software / UX / Web / Mobile / Letters / Translation)
- 우: macOS 스타일의 진짜 같은 터미널 창 — 트래픽 라이트 정고증 컬러 (`#FF5F56` / `#FFBD2E` / `#27C93F`). 첫 줄에 `안녕하세요!` 가 미리 들어있고, JS 가 사이클로 다음 문구들로 교체합니다.

Why Lunervia (내부 오버레이)
- 새 탭/페이지가 아니라 사이트 안에서 우측에서 부드럽게 펼쳐지는 스토리룸
- 트리거: 상단 네비 `Why Lunervia`, 푸터 같은 버튼, Philosophy 섹션의 CTA — 모두 `data-open-why`
- 닫기: 우상단 X, 본문 하단 `메인으로 돌아가기`, 배경 클릭, Esc 키
- 열려 있을 때 `body.why-open` 으로 스크롤 잠금 + 포커스 트랩 + 첫 포커스는 close 버튼
- 본문: 인트로 / 본문 5단락 / 강조 인용구 / 영문 한 문장

푸터
- 좌: 워드마크 + 태그라인
- 우: Explore / Connect 두 열 (각 메뉴 + Email coming soon)
- 하단 바: 카피라이트 + `Built with warmth.` + `맨 위로 ↑`

전역 모션 / 인터랙션
- 상단 2px 스크롤 진행률 바
- 부유 애니메이션 — Partner 카드 등에 `.float` 유틸
- `.reveal` 스태거 (IntersectionObserver) — 첫 등장 시 위로 떠오름
- `prefers-reduced-motion` 환경에서는 타이핑/플로팅/오버레이 트랜지션을 모두 줄입니다.

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
| `assets/brand/client-smbest.png` | SMBEST 기업 로고 (흰 배경) | Showcase 마키 — Client 카드 |
| `assets/brand/work-badajwo.png` | `받아줘` 앱 아이콘 (손이 편지 든 일러스트) | Showcase 마키 — Lunervia Work 카드 |

> Showcase 카드 이미지가 없으면 카드 미디어 영역에 카드 이름이 mono 폰트로 placeholder 처리됨 (`script.js` 의 `wireImageFallback` + `.showcase-card-fallback`). Todak Life 카드는 CSS/SVG 기본 프로필 아바타라 이미지 파일이 필요 없음.

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

### 외부 링크 (모두 새 탭, `rel="noopener noreferrer"`)

- Instagram `@lunerviasoft` → https://www.instagram.com/lunerviasoft/
- Instagram `@_dksrlqor`     → https://www.instagram.com/_dksrlqor/
- TikTok    `@_dksrlqor`     → https://www.tiktok.com/@_dksrlqor
- Instagram `@todaklife`    → https://www.instagram.com/todaklife/

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
- `sns.html` — 인스타·틱톡·이메일을 모아 보여주는 SNS 페이지. 카드별 플랫폼 풀 브랜딩 + 모션. 상단 `SNS` 네비에서 새 탭으로 연결됨.
- `partners.html` — `주요 고객 · 작품 · 파트너` 마키 페이지. 헤더(eyebrow / 제목 / 영문 보조 / 리드) + 페이지 풀폭 `.showcase-marquee` + back-link. 상단 `협력` 네비 / 푸터 `Partners` 링크에서 새 탭으로 연결됨. 카드 데이터는 `script.js` 의 `SHOWCASE` 배열이 그대로 채움 — 메인이든 별도 페이지든 `#showcase-track` 컨테이너만 있으면 자동 작동.
- `serve_no_cache.py` — 로컬 무캐시 개발 서버 (포트 5173)
- `assets/brand/` — 브랜드 워드마크 2장 + showcase 이미지 2장 (SMBEST, 받아줘)
- `.env.example` — 환경변수 형식 예시 (실제 키는 절대 넣지 않음)
- `.gitignore` — `.env`, `__pycache__`, OS 임시 파일 등 제외

## 검증 체크리스트

1. `python serve_no_cache.py` 실행 → `http://127.0.0.1:5173/` 접속.
2. 헤더 워드마크 클릭 시 부드럽게 맨 위로 스크롤되는지 확인.
3. 상단 우측 KO / EN 토글로 본문이 모두 바뀌는지 + 새로고침 후에도 유지되는지 확인.
4. Hero 터미널 창에 `안녕하세요!` 부터 시작해 다섯 개 문구가 사이클로 타이핑되는지.
5. `Why Lunervia` 버튼(네비 / 푸터 / 철학 CTA) 셋 모두에서 오버레이가 우측에서 부드럽게 펼쳐지는지.
   - X 버튼 / 배경 클릭 / Esc / `메인으로 돌아가기` 로 닫히는지.
   - 열린 동안 뒤 배경 스크롤이 잠기는지 + 포커스가 안에 갇히는지.
6. 상단 진행률 바가 스크롤에 따라 채워지는지.
7. 모바일 뷰포트에서 햄버거 메뉴가 정상 동작하고, 가로 스크롤이 없는지.
8. 상단 `SNS` 클릭 시 새 탭으로 `sns.html` 이 열리고, 인스타 카드는 그라데이션이 천천히 도는지 + 틱톡 카드는 시안/마젠타 글로우가 보이는지.
9. 콘솔 에러 0.

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
