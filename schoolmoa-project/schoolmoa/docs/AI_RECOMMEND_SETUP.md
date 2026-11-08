# AI 맞춤 추천 설정 (역할 B)

「맞춤 추천에 LLM 연결하기」 문서의 ① 재정렬 + 추천 이유를 구현했습니다.

```
맞춤 추천 탭 열기 → 규칙 추천(recommend.ts) 즉시 표시
                 → 상위 30개를 /api/recommend 로 전송 (Supabase 로그인 토큰 포함)
                 → 서버: 토큰 확인 → 캐시 확인 → 하루 횟수 확인 → LLM 호출 → 후보 밖 id 제거 → 캐시·사용량 저장
                 → 화면: AI 순서·이유로 교체 (실패·5초 초과·체험 로그인이면 규칙 추천 그대로)
```

## 파일
| 파일 | 담당 | 내용 |
|---|---|---|
| `api/recommend.ts` | B | 서버 함수 (LLM 호출, 캐시, 횟수 제한, 검증) — `"type": "module"` 때문에 한 파일로 작성 |
| `src/features/auth/useAiRecommendations.ts` | B | 프론트 훅 + `mergeAiOrder` |
| `src/App.tsx` | D | 맞춤 추천 탭에 상태 문구·AI 새로고침 버튼 연결 |
| `docs/ai-recommend.sql` | B | `recommendation_cache`, `ai_usage` 테이블 |
| `.env.example` | 공유 | 서버용 환경변수 안내 (주석) |

새 npm 패키지 없음 (LLM은 `fetch`로 직접 호출, Supabase는 기존 `@supabase/supabase-js`).

## 설정 순서
1. **LLM 키 발급 (무료)** — 기본은 **Gemini 무료 등급**(`gemini-3.5-flash-lite`). [Google AI Studio](https://aistudio.google.com/apikey)에서 API 키를 만들면 됩니다. **결제(Billing)를 연결하지 않으면 무료 등급으로 유지되어 요금이 나가지 않습니다.**
   - 무료 등급 한도: 프로젝트당 하루 약 500회(모든 사용자 합산). 실제 한도는 [AI Studio 사용량 페이지](https://aistudio.google.com/rate-limit)에서 확인. 한도를 넘으면 오류가 나고, 화면은 규칙 추천을 그대로 보여줍니다.
   - 무료 등급에 보낸 내용은 Google 서비스 개선에 쓰일 수 있습니다. 그래서 LLM에는 이름·이메일 없이 학과·진로·관심 분야와 공고 내용만 보냅니다.
   - Claude·OpenAI로 바꾸려면 `LLM_PROVIDER`와 해당 키만 넣으면 됩니다(유료, 콘솔에서 월 한도 설정).
2. **Supabase SQL Editor**에서 `docs/ai-recommend.sql` 실행.
3. **Vercel → Settings → Environment Variables** (모두 `VITE_` 없이):
   - `SUPABASE_SECRET_KEY` (Supabase → Project Settings → API Keys → secret)
   - `GEMINI_API_KEY` (다른 회사를 쓰면 `LLM_PROVIDER` + 그 회사 키)
   - 선택: `SUPABASE_URL`(없으면 `VITE_SUPABASE_URL` 사용), `LLM_MODEL`, `AI_DAILY_LIMIT`(기본 3)
4. **로컬 테스트**: `/api` 함수는 `npm run dev`로 실행되지 않습니다. `npx vercel dev` 사용.
   - `.env.local`에 위 서버용 값도 넣기 (`VITE_` 없이). 안 읽히면 `npx vercel env pull .env.local`.
   - 이메일 회원가입으로 로그인해야 합니다. **체험 로그인은 Supabase 세션이 없어 AI 추천이 꺼지고 규칙 추천만 보입니다.**

## 동작 규칙
- 맞춤 추천 탭을 열 때만 요청 (다른 탭에서는 호출 안 함)
- 같은 날 · 같은 프로필 · 같은 후보 → 캐시 사용 (LLM 호출 0회, 횟수 차감 없음)
- 사용자당 하루 `AI_DAILY_LIMIT`회 (한국 시간 0시 초기화), "AI 새로고침"은 캐시를 건너뛰고 1회 차감
- 후보는 최대 30개, LLM 응답 12초 제한, 출력 800토큰
- DB(`notices`)에 있는 공고는 DB 내용으로 다시 읽음. 예시 데이터·인하대 크롤러 공고는 DB에 없으므로 브라우저가 보낸 값을 길이 제한해서 사용
- LLM에는 학과·희망 진로·관심 분야만 보냄 (이름·이메일 X), 공고 글 속 지시문은 따르지 않도록 지시
- LLM이 후보에 없는 id를 내면 버림

## 비용 확인
`docs/ai-recommend.sql` 맨 아래 쿼리로 이번 달 호출 수·토큰을 볼 수 있습니다. Gemini 무료 등급은 비용 0원(하루 호출 한도만 있음). 유료 모델로 바꾸면 소형 모델 기준 추천 1회 약 0.5~3원.

## 다음 단계 (선택)
- 프로필에 "지금 찾는 것(goal)" 입력칸 추가 → `profiles.goal` 컬럼 + `ProfileModal` + 서버 `loadProfile`에서 DB 값 사용
- ③ 자동 태깅: 새 공고에 LLM으로 `career_fields`·`majors`·`summary` 채우기 (크롤러·제보 저장 시)
