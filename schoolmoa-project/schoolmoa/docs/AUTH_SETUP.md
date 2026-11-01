# 소셜 로그인 설정 (역할 B)

`.env.example`을 복사해 `.env.local`을 만들고 아래 값을 채웁니다. Client ID는 공개되어도 되는 값이지만,
**Client Secret은 프론트엔드 코드/환경변수(VITE_*)에 절대 넣지 마세요.**

키가 없으면 로그인 창의 구글/네이버 버튼은 비활성화되고, 개발 모드에서는 '체험 계정' 버튼으로 기능을 테스트할 수 있습니다.

## Google
1. Google Cloud Console → API 및 서비스 → 사용자 인증 정보 → **OAuth 클라이언트 ID(웹 애플리케이션)** 생성
2. 승인된 JavaScript 원본에 `http://localhost:3000` (배포 후 배포 주소도 추가)
3. OAuth 동의 화면 설정 (범위: email, profile, openid)
4. 발급된 클라이언트 ID → `VITE_GOOGLE_CLIENT_ID`

## Naver
1. 네이버 개발자센터 → Application 등록 → 사용 API: **네이버 로그인**
2. 제공 정보: 이름, 이메일(필요 시 프로필 사진) 선택
3. 서비스 URL: `http://localhost:3000`, Callback URL: `http://localhost:3000/` (끝의 `/` 포함, 배포 시 배포 주소도 추가)
4. Client ID → `VITE_NAVER_CLIENT_ID`, Callback URL → `VITE_NAVER_CALLBACK_URL`
5. 네이버는 로그인 시 페이지가 이동했다가 돌아옵니다. (돌아온 뒤 `AuthContext`가 자동으로 사용자 정보를 읽음)

## 알아둘 점
- 현재는 서버가 없어 로그인 정보·프로필·보관함이 **브라우저 localStorage**에 저장됩니다. 다른 기기에서는 보이지 않습니다.
- 여러 기기에서 쓰거나 보안이 중요해지면 Firebase Auth / Supabase 같은 백엔드로 교체하세요. 교체 지점: `authService.ts`, `services/storage.ts`.
