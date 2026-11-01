# 스쿨모아 (SchoolMoa)

인하대학교 학생을 위한 **근로장학·인턴·장학금·공모전/해커톤·봉사** 공고 모음 웹사이트.
공고는 각 사이트 링크로 연결하고, 검색·카테고리·정렬·마감일 확인, 소셜 로그인 후 보관함·캘린더·맞춤 추천을 제공합니다.

## 실행
```bash
npm install
cp .env.example .env.local   # 로그인 키 설정은 docs/AUTH_SETUP.md
npm run dev                  # http://localhost:3000
```
- `npm run lint` 타입 검사 / `npm run build` 빌드
- 키 없이도 개발 모드에서 '체험 계정' 로그인으로 모든 기능을 확인할 수 있습니다.

## 폴더 구조
```
src/
  config/constants.ts        전역 상수(카테고리·출처·옵션·저장키·환경변수)   [공유]
  types/                     타입 정의                                       [공유]
  features/
    notices/                 공고 목록·검색·필터·상세·제보                   [역할 A]
    auth/                    로그인·프로필                                   [역할 B]
    bookmarks/               보관함(스크랩)                                  [역할 C]
    calendar/                마감일 캘린더                                   [역할 D]
  components/layout/         헤더·긴급 배너                                  [역할 D]
  data/, services/, utils/   데이터·서비스·유틸 (파일별 담당은 문서 참고)
  App.tsx, main.tsx          화면 조립                                       [역할 D]
docs/                        TEAM_ROLES / AUTH_SETUP / CHANGES / AI_CONTEXT
```
역할별 담당 파일과 작업 규칙: [`docs/TEAM_ROLES.md`](docs/TEAM_ROLES.md) · 변경 내역: [`docs/CHANGES.md`](docs/CHANGES.md)
