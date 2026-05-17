# AI Group Chat

GPT, Gemini, Claude, Codex를 한 채팅방에 모아 쓰는 개인용 AI 단톡방 웹앱입니다.

## 설치

```bash
npm install
```

## 환경 변수

`.env.example`을 참고해서 `.env.local`을 만들고 API 키를 넣습니다.

```bash
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

OPENAI_MODEL=gpt-4.1-mini
CODEX_MODEL=gpt-4.1-mini
GEMINI_MODEL=gemini-3.1-flash-lite
ANTHROPIC_MODEL=claude-sonnet-4-5
```

API 키는 프론트엔드에 노출하지 않고 `app/api/group-chat/route.ts` 서버 라우트에서만 사용합니다.

## 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## 빌드

```bash
npm run build
```

## 로고

공식 로고 파일을 직접 넣으려면 아래 경로를 사용합니다.

- `public/logos/gpt.svg`
- `public/logos/gemini.svg`
- `public/logos/claude.svg`
- `public/logos/codex.svg`

파일이 없거나 로딩에 실패하면 GPT, GM, CL, CX 텍스트 배지가 표시됩니다.
