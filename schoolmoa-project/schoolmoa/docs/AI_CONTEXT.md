# AI 작업 시작용 프로젝트 컨텍스트 (새 대화 첫 메시지에 붙여넣기)

프로젝트: '스쿨모아' — 인하대 학생용 지원·취업·활동 공고 모음 웹앱 (React 19 + Vite + TypeScript(strict) + Tailwind v4 + lucide-react).
공고는 외부 사이트 링크로 연결하며, 앱은 검색/카테고리/정렬/마감일(D-Day)/북마크/캘린더/맞춤 추천을 제공한다.

규칙
- 구조: `src/features/{notices,auth,bookmarks,calendar}`, `src/components/layout`, `src/config/constants.ts`(모든 상수), `src/types`, `src/utils`, `src/services`, `src/data`
- import는 `@/` 별칭 사용 (`@/config/constants`, `@/types`, ...)
- 상수·옵션·localStorage 키는 컴포넌트에 새로 만들지 말고 `config/constants.ts`에 추가
- '오늘'은 `getToday()`, 저장은 `services/storage.ts`, 날짜 표기는 `utils/dateUtils.ts` 사용
- 기존 디자인(Tailwind 클래스, neutral/indigo 톤, 한국어 UI 문구)을 유지
- 내 담당 영역 밖의 파일은 수정하지 말고, 필요하면 제안만 할 것 (담당표: docs/TEAM_ROLES.md)
- 변경 후 `npm run lint` 와 `npm run build` 가 통과해야 함

내 역할: (A/B/C/D 중 하나를 적기)
요청: 
