# 팀 역할 분담 & 파일 담당표

모든 소스 파일 첫 줄에 `[담당: 역할 X]` 주석이 있습니다. 자기 역할 폴더는 자유롭게 수정하고,
**다른 역할 파일이나 [공유] 파일을 바꿔야 할 땐 해당 담당자에게 confirm(PR 승인)을 받으세요.**

| 역할 | 담당 영역 | 수정 가능한 파일 |
|---|---|---|
| **A. 공고 데이터·목록** | 공고 데이터 관리, 카테고리/검색/정렬/필터, 상세·제보, 인하대 공지 연동, 외부 사이트 링크 수집 | `src/features/notices/**`, `src/data/**`, `src/services/inhaNoticeService.ts` |
| **B. 인증·회원·추천** | 구글/네이버 로그인, 학과·희망 진로 입력, 맞춤 추천 로직 | `src/features/auth/**`, `src/utils/recommend.ts`, `docs/AUTH_SETUP.md` |
| **C. 북마크·스크랩** | 관심 보관함, 지원 단계·메모, 사용자별 저장 | `src/features/bookmarks/**` |
| **D. 캘린더·레이아웃·공통** | 마감일 캘린더, 헤더/푸터/배너, 화면 조립, 스타일, 날짜 유틸 | `src/features/calendar/**`, `src/components/layout/**`, `src/App.tsx`, `src/main.tsx`, `src/index.css`, `src/utils/dateUtils.ts`, `index.html` |
| **공유 (전원 confirm)** | 전역 상수, 타입, 저장소 래퍼, 빌드 설정 | `src/config/constants.ts`, `src/types/**`, `src/services/storage.ts`, `package.json`, `vite.config.ts`, `tsconfig.json` |

## 역할별 다음 작업 제안

- **A**: 실제 공고 수집(잡코리아·사람인·링커리어·캠퍼스픽·위비티·1365 등) 후 `mockNotices.ts`의 `officialUrl`을 개별 공고 주소로 교체 → 인하대 공지 서버 연동(`inhaNoticeService.ts` 상단 주석 참고)
- **B**: 구글/네이버 콘솔 등록 후 실제 로그인 테스트(`docs/AUTH_SETUP.md`), 추천 점수 규칙 다듬기
- **C**: 보관함 정렬·카테고리별 보기, (서버 도입 시) `useBookmarks` 저장 방식 교체
- **D**: 반응형/접근성 점검, 캘린더 UX(주간 보기, 시작일 표시 등), 배포 설정

## 변수·상수 규칙 (main 정리 기준)

| 종류 | 위치 |
|---|---|
| 앱 이름, 카테고리, 출처 사이트, 진로 분야, 정렬/상태 옵션, 기본 필터, 지원 단계, 내비 탭, localStorage 키, 환경변수 | `src/config/constants.ts` |
| 데이터 모양(타입) | `src/types/notice.ts`, `src/types/user.ts` |
| '오늘' 날짜 | `getToday()` (직접 `new Date()` 쓰지 않기) |
| 날짜 계산/표기 | `src/utils/dateUtils.ts` |
| 저장/불러오기 | `src/services/storage.ts` (직접 `localStorage` 호출 금지) |

새 카테고리를 추가하려면: `types/notice.ts`의 `NoticeCategory` → `constants.ts`의 `CATEGORIES` → `NoticeFilters.tsx`의 `CATEGORY_ICONS` 순서로 수정 (공유 파일이므로 전원 confirm).

## Git 작업 규칙

1. 브랜치: `feature/역할-작업명` (예: `feature/B-naver-login`) — `main`에 직접 push 금지
2. 커밋 메시지: `feat(B): 네이버 로그인 추가`, `fix(C): 로그아웃 시 보관함 초기화`, `docs: ...`
3. PR 올리기 → 담당 역할 + 변경한 공유 파일의 경우 전원 승인 후 merge (`.github/CODEOWNERS`)
4. GitHub 저장소 설정에서 **Branch protection → Require a pull request / Require review from Code Owners** 를 켜야 승인 규칙이 실제로 강제됩니다.
5. `.github/CODEOWNERS` 의 `@A-github-id` 등을 실제 GitHub 아이디로 바꾸세요.
6. `.env.local`은 절대 커밋하지 않기 (`.gitignore`에 포함됨). 키가 필요하면 팀 채팅으로 공유.

## AI 도구 혼용 시 주의 (Claude / Gemini / Anti Gravity)

- 새 AI 대화를 시작할 때마다 `docs/AI_CONTEXT.md` 내용을 먼저 붙여넣으세요. 구조·규칙이 어긋나는 것을 막아줍니다.
- AI가 만든 코드는 `npm run lint`(타입 검사)와 `npm run build`를 통과한 뒤 PR을 올리세요.
- AI가 상수를 컴포넌트 안에 새로 만들려 하면 `config/constants.ts`로 옮기도록 요청하세요.
