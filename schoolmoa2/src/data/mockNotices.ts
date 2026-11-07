import { NoticeItem } from '../types/notice';

export const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'notice-01',
    title: '2026-2학기 수강정정 기간 안내',
    category: 'academic',
    subcategory: '수강정정/신청',
    organizer: '인하대학교 교무처',
    organizerType: 'school',
    sourceTier: 'inha-main',
    sourceSiteName: '인하대 포털',
    targetAudience: '인하대학교 학부 재학생 전원',
    targetGrades: [1, 2, 3, 4],
    benefit: '수강 신청 변경 가능 (취소 및 여석 신청)',
    startDate: '2026-10-28',
    deadline: '2026-11-05',
    views: 4890,
    bookmarkedCount: 612,
    summary: '2026-2학기 개강 후 최종 수강정정 기간입니다. 수강포털 로그인 후 미신청 과목 추가 및 중복 수강 취소가 가능합니다.',
    description: `2026학년도 제2학기 수강신청 정정 기간을 다음과 같이 공고합니다.

■ 정정 기간: 2026년 11월 2일(월) 09:00 ~ 11월 5일(목) 18:00
■ 정정 대상: 본교 학부 재학생 (휴학생 및 수강신청 미완료자 포함)
■ 신청 방법:
  - 수강신청 전용 사이트 (sugang.inha.ac.kr) 로그인
  - 잔여 여석이 있는 강좌에 한하여 실시간 선착순 신청
  - 이미 신청한 과목의 삭제(취소)는 즉시 반영되며 복구 불가하오니 유의하시기 바랍니다.
■ 유의사항: 4학년 졸업예정자의 전공필수 과목 추가요청은 학과 사무실 직접 방문 승인 필수`,
    eligibilityCriteria: [
      {
        id: 'ac-1',
        title: '신청 대상',
        detail: '2026학년도 2학기 등록 완료 학부생',
        required: true,
      },
    ],
    requiredDocuments: ['별도 서류 없음 (수강포털 온라인 신청)'],
    scheduleSteps: [
      { step: '정정 시스템 오픈', date: '2026.11.02 09:00' },
      { step: '최종 마감 및 서버 다운로드', date: '2026.11.05 18:00' },
      { step: '최종 수강확인부 출력', date: '2026.11.09 10:00' },
    ],
    contact: {
      department: '인하대학교 교무처 수업팀',
      phone: '032-860-7043',
      email: 'sugang@inha.ac.kr',
      officeLocation: '본관 1층 학사서비스센터',
    },
    officialUrl: 'https://www.inha.ac.kr/kr/1072/subview.do',
    tags: ['수강정정', '학사일정', '교무처', '필수확인'],
    createdAt: '2026-10-28',
  },
  {
    id: 'notice-02',
    title: '2026년도 국가장학금 2차 신청 안내',
    category: 'scholarship',
    subcategory: '소득연계',
    organizer: '한국장학재단 & 인하대 학생지원팀',
    organizerType: 'government',
    sourceTier: 'external',
    sourceSiteName: '한국장학재단',
    targetAudience: '소득 0~8구간 국내 대학 재학생',
    targetGrades: [1, 2, 3, 4],
    benefit: '소득구간별 등록금 전액~최대 175만원 차등 지원',
    estimatedValueNumber: 3500000,
    startDate: '2026-10-15',
    deadline: '2026-11-06',
    views: 6410,
    bookmarkedCount: 890,
    summary: '경제적 여건과 관계없이 의지와 능력에 따라 고등교육의 기회를 가질 수 있도록 지원하는 국가장학금 2차 통합 신청 기간입니다.',
    description: `2026년도 국가장학금 2차 신청 일정 및 세부 요강입니다.

■ 신청 기간: 2026년 10월 15일(목) 09:00 ~ 11월 6일(금) 18:00
■ 서류제출 및 가구원 동의: 2026년 11월 11일(수) 18:00까지
■ 지원 대상: 신입생·편입생·재입학생·복학생 및 1차 신청을 놓친 재학생(구제신청서 제출 시 2회 인정)
■ 지원 금액:
  - 기초·차상위: 등록금 전액 지원
  - 1~3구간: 학기당 최대 285만원
  - 4~6구간: 학기당 최대 210만원
  - 7~8구간: 학기당 최대 175만원
■ 신청 방법: 한국장학재단 누리집(www.kosaf.go.kr) 및 모바일 앱`,
    eligibilityCriteria: [
      {
        id: 'sch-c1',
        title: '소득 분위 요건',
        detail: '학자금 지원 8구간 이하 (기초~8구간)',
        required: true,
        criterionType: 'income',
        maxIncomeDecile: 8,
      },
      {
        id: 'sch-c2',
        title: '성적 기준',
        detail: '직전학기 12학점 이수 및 평점 2.75 / 4.5 이상 (백분위 80점 이상)',
        required: true,
        criterionType: 'gpa',
        minGpa: 2.75,
      },
    ],
    requiredDocuments: [
      '한국장학재단 온라인 신청서',
      '가구원 정보제공 동의 (공동인증서/간편인증)',
      '가족관계증명서 및 주민등록등본 (해당자)',
    ],
    scheduleSteps: [
      { step: '온라인 신청 마감', date: '2026.11.06 18:00' },
      { step: '가구원 동의 마감', date: '2026.11.11 18:00' },
      { step: '소득구간 산정 및 심사', date: '2026.11.15 ~ 2026.12.05' },
      { step: '장학금 감면/지급', date: '12월 중순 예정' },
    ],
    contact: {
      department: '한국장학재단 상담센터 & 인하대 장학복지팀',
      phone: '1599-2000',
      email: 'scholarship@inha.ac.kr',
    },
    officialUrl: 'https://www.kosaf.go.kr',
    tags: ['국가장학금', '한국장학재단', '등록금지원', '소득구간연계'],
    createdAt: '2026-10-15',
  },
  {
    id: 'notice-03',
    title: '2학기 교내 근로장학생 추가 모집 (도서관·행정부서)',
    category: 'work',
    subcategory: '교내 근로장학',
    organizer: '인하대학교 학생지원처',
    organizerType: 'school',
    sourceTier: 'inha-main',
    sourceSiteName: '인하대 학생지원팀',
    targetAudience: '인하대학교 재학생 (직전학기 평점 2.0 이상)',
    targetGrades: [1, 2, 3, 4],
    benefit: '시급 11,000원 + 근로장학금 (월 최대 50시간)',
    estimatedValueNumber: 1100000,
    startDate: '2026-10-25',
    deadline: '2026-11-07',
    views: 3120,
    bookmarkedCount: 420,
    summary: '정석학술정보관(도서관) 및 공과대학 행정실에서 근무하며 학비 부담을 줄일 수 있는 교내 근로장학생을 추가 선발합니다.',
    description: `2026학년도 2학기 잔여 배정 교내 부서 근로장학생을 모집합니다.

■ 모집 부서:
  - 정석학술정보관 열람실 대출·반납 및 서가 정리 (4명)
  - 공과대학 행정실 문서 수발 및 사무 보조 (2명)
  - 정보통신처 전산실 실습 기자재 관리 (2명)
■ 근무 조건:
  - 시급: 11,000원 (교비 지원)
  - 근무 시간: 주당 10~14시간 (수업 공강 시간에 맞춰 스케줄 조율 가능)
  - 근무 기간: 선발 직후 ~ 2027년 2월 28일
■ 선발 기준:
  - 1순위: 소득 0~4구간 학생
  - 2순위: 직전학기 학점 및 면접 평가 우수자`,
    eligibilityCriteria: [
      {
        id: 'work-c1',
        title: '재학 요건',
        detail: '2026-2학기 정규 등록 재학생 (휴학생 불가)',
        required: true,
      },
      {
        id: 'work-c2',
        title: '성적 기준',
        detail: '직전학기 평점 2.0 / 4.5 이상',
        required: true,
        criterionType: 'gpa',
        minGpa: 2.0,
      },
    ],
    requiredDocuments: [
      '교내 근로장학생 지원서 1부 (포털 양식)',
      '2026-2학기 수업시간표 1부',
    ],
    scheduleSteps: [
      { step: '지원서 접수 마감', date: '2026.11.07 17:00' },
      { step: '부서별 간단 면접', date: '2026.11.10' },
      { step: '최종 선발 공지 및 근로 시작', date: '2026.11.12' },
    ],
    contact: {
      department: '인하대학교 학생지원팀',
      personName: '김민성 담당관',
      phone: '032-860-7065',
      email: 'work-study@inha.ac.kr',
      officeLocation: '학생회관 3층 302호',
    },
    officialUrl: 'https://www.inha.ac.kr/kr/1073/subview.do',
    tags: ['교내근로', '시급11000원', '공강활용', '도서관근무'],
    createdAt: '2026-10-25',
  },
  {
    id: 'notice-04',
    title: '대학생 서포터즈 모집 (활동비 + 수료증)',
    category: 'activity',
    subcategory: '서포터즈',
    organizer: '청년마케팅협의회 & 캠퍼스픽',
    organizerType: 'corporate',
    sourceTier: 'external',
    sourceSiteName: '캠퍼스픽',
    targetAudience: 'SNS 콘텐츠 제작 및 오프라인 행사 참여가 가능한 대학생',
    targetGrades: [1, 2, 3, 4],
    benefit: '월 활동비 15만원 + 공식 수료증 + 우수 활동자 인턴 가점',
    estimatedValueNumber: 450000,
    startDate: '2026-10-20',
    deadline: '2026-11-09',
    views: 2980,
    bookmarkedCount: 310,
    summary: '청년 정책 홍보 숏폼 영상 제작 및 캠퍼스 팝업 부스를 운영하며 실무 마케팅 스펙을 쌓을 수 있는 대외활동입니다.',
    description: `대학생의 참신한 아이디어로 청년 취업·문화 정책을 알릴 2026 하반기 서포터즈를 모집합니다.

■ 주요 활동:
  - 카드뉴스 및 릴스/쇼츠 콘텐츠 월 2회 제작
  - 수도권 대학 캠퍼스 홍보 팝업 프로젝트 기획 및 운영
  - 월 1회 현업 마케터 실무 멘토링 세션 참석
■ 활동 혜택:
  - 매월 개인 활동비 15만원 지급
  - 활동 수료증 발급 (80% 이상 참여 시)
  - 최우수 팀 상금 100만원 및 대행사 서류 전형 면제`,
    eligibilityCriteria: [
      {
        id: 'act-c1',
        title: '신청 자격',
        detail: '수도권 소재 대학 재학생 또는 휴학생',
        required: true,
      },
    ],
    requiredDocuments: [
      '온라인 네이버폼 지원서',
      '인스타그램 또는 포트폴리오 링크 (선택)',
    ],
    scheduleSteps: [
      { step: '서류 마감', date: '2026.11.09 23:59' },
      { step: '비대면 줌 면접', date: '2026.11.12' },
      { step: '발대식 및 OT', date: '2026.11.15' },
    ],
    contact: {
      department: '캠퍼스 서포터즈 운영본부',
      phone: '02-552-9011',
      email: 'supporters@campuspick.com',
    },
    officialUrl: 'https://www.campuspick.com',
    tags: ['대외활동', '서포터즈', '월활동비', '마케팅스펙', '수료증'],
    createdAt: '2026-10-20',
  },
  {
    id: 'notice-05',
    title: '국내 IT 기업 개발자 체험형 인턴 채용',
    category: 'career',
    subcategory: '체험형 인턴',
    organizer: '카카오엔터프라이즈 협력사 & 잡코리아',
    organizerType: 'corporate',
    sourceTier: 'external',
    sourceSiteName: '잡코리아',
    targetAudience: '백엔드/프론트엔드/모바일 직무 취업을 준비하는 3~4학년',
    targetGrades: [3, 4],
    benefit: '월 220만원 + 정규직 전환 심사 기회 제공',
    estimatedValueNumber: 6600000,
    startDate: '2026-10-22',
    deadline: '2026-11-10',
    views: 4120,
    bookmarkedCount: 570,
    recommendationReason: '✦ 추천 · SW·개발 진로와 일치',
    summary: '실제 상용 클라우드 서비스 백엔드 API 개발 및 프론트엔드 대시보드 구축 프로젝트에 참여할 실무형 인턴십입니다.',
    description: `인턴십을 통해 실무 코드베이스를 경험하고 테크 리드의 코드 리뷰를 받으며 성장할 예비 개발자를 찾습니다.

■ 근무 기간: 2026년 12월 ~ 2027년 2월 (3개월, 전환 평가 후 정규직 채용)
■ 근무지: 판교 테크노밸리 (하이브리드 재택 주 2회)
■ 급여: 월 220만원 (식대 별도 제공)
■ 모집 분야:
  - Backend: Java/Spring Boot 또는 Python/FastAPI 기반 마이크로서비스
  - Frontend: TypeScript, React, Next.js 기반 반응형 웹 애플리케이션
■ 우대 사항:
  - 컴퓨터공학 전공자
  - GitHub 리포지토리 또는 배포된 사이드 프로젝트 경험 보유자`,
    eligibilityCriteria: [
      {
        id: 'car-c1',
        title: '대상 학년',
        detail: '3~4학년 재학생, 휴학생 또는 2027년 졸업예정자',
        required: true,
        criterionType: 'grade',
        allowedGrades: [3, 4],
      },
      {
        id: 'car-c2',
        title: '전공/역량',
        detail: '컴퓨터공학, 소프트웨어 전공 또는 이에 준하는 코딩 실력자',
        required: true,
        criterionType: 'major',
        allowedMajors: ['software', 'engineering'],
      },
    ],
    requiredDocuments: [
      '자유 양식 이력서 및 포트폴리오 (PDF)',
      'GitHub 주소 기재 필수',
    ],
    scheduleSteps: [
      { step: '서류 접수 마감', date: '2026.11.10 23:59' },
      { step: '온라인 코딩 테스트', date: '2026.11.14' },
      { step: '실무 면접', date: '2026.11.20' },
      { step: '입사일', date: '2026.12.01' },
    ],
    contact: {
      department: '채용운영팀',
      email: 'recruit-dev@partner-kakao.com',
    },
    officialUrl: 'https://www.jobkorea.co.kr',
    tags: ['개발자인턴', '월220만원', '전환형', '판교', '추천공고'],
    createdAt: '2026-10-22',
  },
  {
    id: 'notice-06',
    title: '취업 특강: 이력서·면접 컨설팅 데이',
    category: 'academic',
    subcategory: '특강/세미나',
    organizer: '인하대학교 대학일자리플러스센터',
    organizerType: 'school',
    sourceTier: 'inha-main',
    sourceSiteName: '인하대 경력개발팀',
    targetAudience: '하반기 공채 및 인턴십을 준비하는 인하대 학생 누구나',
    targetGrades: [1, 2, 3, 4],
    benefit: '전직 대기업·IT 인사담당자 1:1 이력서 밀착 첨삭 제공',
    startDate: '2026-10-26',
    deadline: '2026-11-11',
    views: 1850,
    bookmarkedCount: 290,
    summary: '삼성, 현대, 네이버 등 주요 기업 출신 전문 컨설턴트가 직접 학생의 자기소개서를 1:1로 피드백하고 모의면접을 진행합니다.',
    description: `인하대 학생들의 취업 성공률을 높이기 위한 특별 집중 코칭 데이입니다.

■ 일시: 2026년 11월 13일(금) 13:00 ~ 18:00
■ 장소: 인하대학교 60주년기념관 다목적실 및 온라인 줌
■ 프로그램:
  - 1부: 2026 하반기 채용 트렌드 및 AI 역량검사 대비 전략 (13:00~14:30)
  - 2부: 직무별(개발, 기획, 마케팅, 생산기술) 그룹 모의 면접 (14:40~16:00)
  - 3부: 사전 신청자 1:1 서류 첨삭 클리닉 (16:10~18:00, 1인당 25분)`,
    eligibilityCriteria: [
      {
        id: 'spec-c1',
        title: '신청 대상',
        detail: '인하대학교 재학생 및 졸업생 (선착순 50명)',
        required: true,
      },
    ],
    requiredDocuments: [
      '작성 중인 국문 이력서/자기소개서 초안 1부 (클리닉 신청자)',
    ],
    scheduleSteps: [
      { step: '사전 참가 신청 마감', date: '2026.11.11 18:00' },
      { step: '행사 당일 참석', date: '2026.11.13 13:00' },
    ],
    contact: {
      department: '인하대 대학일자리플러스센터',
      phone: '032-860-7080',
      email: 'job@inha.ac.kr',
      officeLocation: '학생회관 2층 취업상담실',
    },
    officialUrl: 'https://job.inha.ac.kr',
    tags: ['취업특강', '자기소개서첨삭', '모의면접', '인하대경력'],
    createdAt: '2026-10-26',
  },
  {
    id: 'notice-07',
    title: 'AI 서비스 개발 해커톤 (온라인 예선)',
    category: 'competition',
    subcategory: 'SW/AI 해커톤',
    organizer: '인하대 SW중심대학사업단 & 인하컴퓨터연구회',
    organizerType: 'school',
    sourceTier: 'inha-dept',
    department: '컴퓨터공학과',
    sourceSiteName: 'SW중심대학사업단',
    targetAudience: '인하대학교 재학생 (개인 또는 2~4인 팀 구성)',
    targetGrades: [1, 2, 3, 4],
    benefit: '총 상금 1,000만원 (대상 400만원) + 유망 스타트업 서류 면제',
    estimatedValueNumber: 4000000,
    startDate: '2026-10-24',
    deadline: '2026-11-12',
    views: 3890,
    bookmarkedCount: 512,
    recommendationReason: '✦ 추천 · 컴퓨터공학과 인기',
    summary: '생성형 AI와 지능형 에이전트 기술을 활용하여 일상 속 문제를 해결하는 무박 2일 해커톤입니다. 클라우드 GPU 크레딧 무상 지원.',
    description: `인하대 학생들의 SW 역량을 펼칠 수 있는 2026 추계 AI 서비스 융합 해커톤입니다.

■ 대회 주제: "Generative AI Agents for Campus & Society"
■ 본선 일시: 2026년 11월 27일(금) 18:00 ~ 11월 28일(토) 18:00 (무박 2일)
■ 장소: 인하대학교 하이테크관 대강당
■ 지원 혜택:
  - 본선 진출 팀당 Google Gemini / Cloud API 크레딧 30만원 지원
  - 대상 (1팀): 상금 400만원 및 총장상
  - 최우수상 (2팀): 각 200만원
  - 우수상 (2팀): 각 100만원
  - 수상팀 전원 협력 테크 기업 인턴 지원 시 서류 가점`,
    eligibilityCriteria: [
      {
        id: 'hack-c1',
        title: '팀 구성',
        detail: '인하대학교 재학생 2~4인 (전공 무관, 타 학과 연합 권장)',
        required: true,
      },
    ],
    requiredDocuments: [
      '해커톤 참가 신청서 및 기획 제안서 (PDF 3장 이내)',
    ],
    scheduleSteps: [
      { step: '예선 접수 마감', date: '2026.11.12 23:59' },
      { step: '본선 진출 15팀 발표', date: '2026.11.18' },
      { step: '무박 2일 본선 대회', date: '2026.11.27 ~ 11.28' },
    ],
    contact: {
      department: 'SW중심대학사업단',
      personName: '박준혁 연구원',
      phone: '032-860-9251',
      email: 'sw-hackathon@inha.ac.kr',
    },
    officialUrl: 'https://swcenter.inha.ac.kr',
    tags: ['해커톤', 'AI_SW', '상금1000만원', '컴공인기', '팀프로젝트'],
    createdAt: '2026-10-24',
  },
  {
    id: 'notice-08',
    title: '학과 연구실 학부 연구보조원(RA) 모집',
    category: 'work',
    subcategory: '학과 RA/TA',
    organizer: '인하대학교 인공지능융합연구센터',
    organizerType: 'school',
    sourceTier: 'inha-dept',
    department: '컴퓨터공학과',
    sourceSiteName: '소프트웨어융합대학',
    targetAudience: '머신러닝·데이터 엔지니어링에 관심 있는 2~4학년 학부생',
    targetGrades: [2, 3, 4],
    benefit: '월 40만원 연구장학금 + 연구실 좌석 및 GPU 서버 계정',
    estimatedValueNumber: 1200000,
    startDate: '2026-10-28',
    deadline: '2026-11-15',
    views: 2210,
    bookmarkedCount: 340,
    recommendationReason: '✦ 추천 · 연구실 진학 희망자',
    summary: '시각지능 및 멀티모달 파운데이션 모델 파인튜닝 정부과제 데이터 전처리 및 실험을 보조할 학부생 RA를 모집합니다.',
    description: `인하대 인공지능융합연구센터 멀티모달 인텔리전스 랩에서 2026년 동계 및 차기 학기 학부 연구보조원(RA)을 모집합니다.

■ 주요 업무:
  - 오픈소스 멀티모달 데이터셋 구축 및 어노테이션 정제
  - PyTorch 기반 모델 벤치마크 평가 스크립트 작성 보조
  - 주 1회 연구실 정기 세미나(Paper Reading) 참석
■ 혜택:
  - 인하대 산학협력단 공식 RA 연구장학금 월 40만원 지급
  - 연구실 개인 좌석, 고사양 모니터, RTX 4090 GPU 클러스터 계정 제공
  - 대학원 진학 희망 시 지도교수 특별 추천`,
    eligibilityCriteria: [
      {
        id: 'ra-c1',
        title: '전공 요건',
        detail: '컴퓨터공학, 인공지능공학, 전자공학 재학생',
        required: true,
        criterionType: 'major',
        allowedMajors: ['software', 'engineering'],
      },
      {
        id: 'ra-c2',
        title: '성적 기준',
        detail: '전체 평점평균 3.3 / 4.5 이상',
        required: true,
        criterionType: 'gpa',
        minGpa: 3.3,
      },
    ],
    requiredDocuments: [
      '간단한 자기소개서 및 관심 연구분야 (A4 1장)',
      '성적증명서 사본 1부',
    ],
    scheduleSteps: [
      { step: '서류 접수 마감', date: '2026.11.15 18:00' },
      { step: '교수님 면담', date: '2026.11.18' },
      { step: '연구실 배정', date: '2026.11.23' },
    ],
    contact: {
      department: '인공지능융합연구센터 랩',
      personName: '정성훈 수석연구원',
      email: 'ai-lab@inha.ac.kr',
      officeLocation: '하이테크관 7층 712호',
    },
    officialUrl: 'https://ailab.inha.ac.kr',
    tags: ['연구보조원', 'RA', '월40만원', 'AI연구', '연구실'],
    createdAt: '2026-10-28',
  },
  {
    id: 'notice-09',
    title: '대학생 아이디어·기획 공모전',
    category: 'competition',
    subcategory: '아이디어/기획',
    organizer: '인천광역시 & 인천테크노파크',
    organizerType: 'government',
    sourceTier: 'external',
    sourceSiteName: '위비티',
    targetAudience: '인천 지역 대학 재학생 누구나',
    targetGrades: [1, 2, 3, 4],
    benefit: '대상 500만원 + 시장상 + 테크노파크 청년인턴 기회',
    estimatedValueNumber: 5000000,
    startDate: '2026-10-18',
    deadline: '2026-11-17',
    views: 2450,
    bookmarkedCount: 305,
    summary: '인천 원도심 활성화 및 스마트 모빌리티 전환을 위한 대학생 청년 혁신 아이디어를 공모합니다.',
    description: `인천의 미래 비전을 그릴 창의적인 대학생 아이디어를 기다립니다.

■ 공모 분야:
  1. 원도심-송도 간 스마트 교통/모빌리티 연계 아이디어
  2. 친환경 항만 탄소중립 실현을 위한 대학생 제안
  3. 청년 1인 가구를 위한 지역 커뮤니티 플랫폼
■ 시상 내역:
  - 대상 (1팀): 500만원 및 인천시장상
  - 최우수상 (2팀): 각 250만원
  - 우수상 (3팀): 각 100만원`,
    eligibilityCriteria: [
      {
        id: 'comp-c3',
        title: '신청 자격',
        detail: '인천 관내 대학교 재학생 또는 인천 거주 대학생',
        required: true,
      },
    ],
    requiredDocuments: [
      '공모전 참가신청서 1부',
      '아이디어 제안서 (PPT 15장 이내)',
    ],
    scheduleSteps: [
      { step: '제안서 제출 마감', date: '2026.11.17 18:00' },
      { step: '1차 서류 심사 결과', date: '2026.11.25' },
      { step: '본선 발표 평가 및 시상', date: '2026.12.08' },
    ],
    contact: {
      department: '인천테크노파크 청년정책기획단',
      phone: '032-260-0700',
      email: 'idea@itp.or.kr',
    },
    officialUrl: 'https://www.wevity.com',
    tags: ['아이디어공모전', '대상500만원', '인천시', '스펙업'],
    createdAt: '2026-10-18',
  },
  {
    id: 'notice-10',
    title: '2026 하반기 공인 어학시험 및 기사 자격증 응시료 실비 지원',
    category: 'support',
    subcategory: '어학/자격증 응시료',
    organizer: '인하대학교 학생경력개발원',
    organizerType: 'school',
    sourceTier: 'inha-main',
    sourceSiteName: '인하대 경력개발팀',
    targetAudience: '인하대학교 정규학기 재학생 전원',
    targetGrades: [1, 2, 3, 4],
    benefit: '1인당 연 최대 30만원 (토익, 오픽, 기사 자격증 전액 환급)',
    estimatedValueNumber: 300000,
    startDate: '2026-10-01',
    deadline: '2026-11-20',
    views: 5210,
    bookmarkedCount: 780,
    summary: '토익, 토스, 오픽 및 정보처리기사 등 국가공인 자격증 응시료를 계좌로 전액 현금 환급해 드립니다.',
    description: `인하대 학생들의 취업 스펙 준비 비용을 덜어주기 위한 2026 하반기 어학/자격증 응시료 지원 프로그램입니다.

■ 대상 시험:
  - 어학: TOEIC, TOEIC Speaking, OPIc, TOEFL, TEPS, JLPT, HSK
  - 전공/IT: 정보처리기사, SQLD, 빅데이터분석기사, 전기기사, 일반기계기사, 화공기사 등
■ 지원 금액: 1인당 연간 최대 30만원 한도 내 실비 전액 환급
■ 신청 조건: 2026년 7월 1일 이후 응시한 시험에 한함 (성적 무관 응시만 해도 지원)`,
    eligibilityCriteria: [
      {
        id: 'sup-c1',
        title: '재학 요건',
        detail: '신청일 기준 인하대 정규학기 재학생',
        required: true,
      },
    ],
    requiredDocuments: [
      '응시료 지원 신청서 (경력개발 포털)',
      '공식 성적표 사본',
      '결제 영수증(카드 전표 or 현금영수증)',
      '본인 명의 통장 사본',
    ],
    scheduleSteps: [
      { step: '신청 접수 마감', date: '2026.11.20 18:00' },
      { step: '영수증 검증', date: '2026.11.25' },
      { step: '지원금 계좌 입금', date: '2026.11.30' },
    ],
    contact: {
      department: '인하대 학생경력개발원',
      phone: '032-860-7082',
      email: 'career-exam@inha.ac.kr',
    },
    officialUrl: 'https://job.inha.ac.kr',
    tags: ['응시료환급', '토익환급', '정보처리기사', '연30만원', '실비지원'],
    createdAt: '2026-10-01',
  },
  {
    id: 'notice-11',
    title: '2026-2학기 인하 미래인재 성적우수 및 동문 장학생 선발',
    category: 'scholarship',
    subcategory: '성적우수',
    organizer: '인하대학교 총동창회 & 장학복지팀',
    organizerType: 'school',
    sourceTier: 'inha-main',
    sourceSiteName: '인하대 장학복지팀',
    targetAudience: '직전학기 평점 3.8 이상 재학생',
    targetGrades: [2, 3, 4],
    benefit: '등록금 전액 면제 + 학업장려비 200만원 일시금 지급',
    estimatedValueNumber: 5800000,
    startDate: '2026-10-25',
    deadline: '2026-11-21',
    views: 3820,
    bookmarkedCount: 610,
    recommendationReason: '✦ 추천 · 평점 3.8 이상 충족',
    summary: '동문 선배들의 후원으로 모교의 우수 인재를 육성하는 장학금으로 직전학기 학업성적과 미래 발전 가능성을 평가하여 선발합니다.',
    description: `인하대학교 총동창회 장학재단에서 2026학년도 후반기 우수 장학생을 선발합니다.

■ 선발 인원: 단과대학별 각 3명 (총 30명 내외)
■ 장학 혜택:
  - 1년간 등록금 전액 지원
  - 학업장려 생활비 200만원 일시금 지급
  - 동문 CEO 멘토링 결연 기회 제공
■ 자격 요건:
  - 직전학기 15학점 이상 이수 및 평점 3.80 / 4.50 이상
  - 학과장 또는 지도교수 추천을 받은 학생`,
    eligibilityCriteria: [
      {
        id: 'sch-c4',
        title: '평점 기준',
        detail: '직전학기 평점 3.80 / 4.50 이상',
        required: true,
        criterionType: 'gpa',
        minGpa: 3.8,
      },
      {
        id: 'sch-c5',
        title: '학년 기준',
        detail: '2~4학년 재학생',
        required: true,
        criterionType: 'grade',
        allowedGrades: [2, 3, 4],
      },
    ],
    requiredDocuments: [
      '동문장학재단 지원서 1부',
      '자기소개 및 학업계획서 (자유양식 2매)',
      '성적증명서 원본 1부',
      '학과장 추천서 1부',
    ],
    scheduleSteps: [
      { step: '신청서 접수 마감', date: '2026.11.21 17:00' },
      { step: '동문 심사위원회 면접', date: '2026.11.28' },
      { step: '장학증서 수여식', date: '2026.12.05' },
    ],
    contact: {
      department: '인하대학교 총동창회 장학팀',
      phone: '032-860-7061',
      email: 'alumni-scholarship@inha.ac.kr',
    },
    officialUrl: 'https://alumni.inha.ac.kr',
    tags: ['성적우수', '동문장학금', '등록금전액', '생활비200만원', '멘토링'],
    createdAt: '2026-10-25',
  },
  {
    id: 'notice-12',
    title: '2026 삼성꿈장학재단 대학희망 장학생 신규 선발',
    category: 'scholarship',
    subcategory: '외부재단·기업',
    organizer: '삼성꿈장학재단',
    organizerType: 'foundation',
    sourceTier: 'external',
    sourceSiteName: '삼성꿈장학재단',
    targetAudience: '소득구간 0~4구간 이내 재학생',
    targetGrades: [1, 2, 3],
    benefit: '연간 500만원 생활비 장학금 (타 장학금과 전액 중복수혜 가능)',
    estimatedValueNumber: 5000000,
    startDate: '2026-10-20',
    deadline: '2026-11-22',
    views: 4120,
    bookmarkedCount: 540,
    summary: '경제적 여건이 어려운 학생들이 등록금 외에 식비, 주거비 걱정 없이 학업에 전념할 수 있도록 생활비를 통장에 직접 무상 지급합니다.',
    description: `■ 지원 내용: 연간 500만원 (학기당 250만원 분할 지급)
■ 특전: 국가장학금 및 교내 성적장학금과 전액 중복 수혜 가능
■ 자격: 한국장학재단 소득구간 0~4구간 재학생 (평점 3.0 이상)`,
    eligibilityCriteria: [
      {
        id: 'sam-c1',
        title: '소득구간 요건',
        detail: '한국장학재단 0~4구간 이내',
        required: true,
        criterionType: 'income',
        maxIncomeDecile: 4,
      },
      {
        id: 'sam-c2',
        title: '평점 요건',
        detail: '직전학기 평점 3.0 이상',
        required: true,
        criterionType: 'gpa',
        minGpa: 3.0,
      },
    ],
    requiredDocuments: [
      '재단 온라인 신청서',
      '소득구간 통지서',
      '성적증명서 원본',
    ],
    scheduleSteps: [
      { step: '신청 마감', date: '2026.11.22 18:00' },
      { step: '재단 서류 심사', date: '2026.11.29' },
      { step: '장학금 1차 입금', date: '2026.12.10' },
    ],
    contact: {
      department: '삼성꿈장학재단 장학사업부',
      phone: '02-727-5400',
      email: 'dream@samsungdreamfund.or.kr',
    },
    officialUrl: 'https://www.samsungdreamfund.or.kr',
    tags: ['외부장학금', '생활비500만원', '중복수혜가능', '소득구간연계'],
    createdAt: '2026-10-20',
  },
  {
    id: 'notice-13',
    title: 'NVIDIA H100 고성능 GPU 연산서버 학부생 연구계정 무상 지원',
    category: 'support',
    subcategory: 'GPU/클라우드',
    organizer: '인하대학교 AI혁신센터 & 슈퍼컴퓨팅센터',
    organizerType: 'school',
    sourceTier: 'inha-dept',
    department: '컴퓨터공학과',
    sourceSiteName: '인하대 AI혁신센터',
    targetAudience: '인공지능 연구를 수행하는 컴퓨터·SW 학부생',
    targetGrades: [2, 3, 4],
    benefit: 'H100 GPU 2기 할당 (300 연산시간) + 2TB 고속 NVMe 스토리지',
    estimatedValueNumber: 2000000,
    startDate: '2026-10-28',
    deadline: '2026-11-24',
    views: 3100,
    bookmarkedCount: 460,
    recommendationReason: '✦ 추천 · AI 연구 희망자',
    summary: '대규모 언어모델(LLM) 및 비전 생성 모델 연구를 진행하는 학부생을 위해 학교 슈퍼컴퓨팅 노드를 무상 개방합니다.',
    description: `인하대 AI혁신센터에서 학부생 연구역량 강화를 위해 H100 SXM5 GPU 클러스터를 지원합니다.

■ 지원 스펙:
  - NVIDIA H100 80GB 노드 계정 발급
  - 1인당 기본 300 compute hours 및 고속 NVMe 2TB
  - JupyterHub 및 Slurm 배치 스케줄러 지원`,
    eligibilityCriteria: [
      {
        id: 'gpu-c1',
        title: '신청 조건',
        detail: '연구 계획서(A4 1장) 작성자',
        required: true,
      },
    ],
    requiredDocuments: [
      'GPU 연산서버 이용 신청서',
      '연구 계획서 1부',
    ],
    scheduleSteps: [
      { step: '신청 접수 마감', date: '2026.11.24 18:00' },
      { step: '심사 및 계정 발급', date: '2026.11.28' },
    ],
    contact: {
      department: '인하대 슈퍼컴퓨팅센터',
      phone: '032-860-9119',
      email: 'hpc@inha.ac.kr',
    },
    officialUrl: 'https://hpc.inha.ac.kr',
    tags: ['GPU지원', 'H100', '슈퍼컴퓨팅', '인공지능', '크레딧지원'],
    createdAt: '2026-10-28',
  },
  {
    id: 'notice-14',
    title: '2027 전기 졸업종합시험 및 학위청구논문 계획서 제출 안내',
    category: 'academic',
    subcategory: '졸업요건',
    organizer: '인하대학교 교무처 학적팀',
    organizerType: 'school',
    sourceTier: 'inha-main',
    sourceSiteName: '인하대 교무처',
    targetAudience: '3~4학년 졸업예정자 (취득학점 98학점 이상)',
    targetGrades: [3, 4],
    benefit: '졸업 심사 자격 획득 및 지도교수 승인 완료',
    startDate: '2026-10-25',
    deadline: '2026-11-25',
    views: 2890,
    bookmarkedCount: 310,
    summary: '2027년 2월 또는 8월 졸업 예정인 학생은 기한 내에 지도교수 서명을 받은 졸업연구 계획서를 학과 사무실에 제출해야 합니다.',
    description: `■ 제출 대상: 3~4학년 졸업예정자
■ 제출 방법: 포털 온라인 등록 후 지도교수 날인본 학과 사무실 제출
■ 주의사항: 기한 내 미제출 시 해당 학기 졸업 논문 심사 대상에서 자동 제외됩니다.`,
    eligibilityCriteria: [
      {
        id: 'grad-c1',
        title: '이수학점',
        detail: '취득학점 98학점 이상',
        required: true,
        criterionType: 'grade',
        allowedGrades: [3, 4],
      },
    ],
    requiredDocuments: ['졸업연구 계획서 1부', '지도교수 확인서 1부'],
    scheduleSteps: [
      { step: '계획서 제출 마감', date: '2026.11.25 18:00' },
      { step: '학과 심의 결과 공지', date: '2026.12.05' },
    ],
    contact: {
      department: '인하대 교무처 학적팀',
      phone: '032-860-7051',
      email: 'graduation@inha.ac.kr',
    },
    officialUrl: 'https://www.inha.ac.kr',
    tags: ['졸업논문', '졸업시험', '필수제출', '학적팀'],
    createdAt: '2026-10-25',
  },
  {
    id: 'notice-15',
    title: '제9회 전국 대학생 수리과학 및 양자 알고리즘 챌린지',
    category: 'competition',
    subcategory: 'SW/AI 해커톤',
    organizer: '국가수리과학연구소 & 기초과학연구원(IBS)',
    organizerType: 'government',
    sourceTier: 'external',
    sourceSiteName: '국가수리과학연구소',
    targetAudience: '수학, 컴퓨터공학, 물리 학부생 (개인 또는 3인 팀)',
    targetGrades: [1, 2, 3, 4],
    benefit: '총 상금 1,500만원 + 국가연구소 인턴십 우선 선발권',
    estimatedValueNumber: 5000000,
    startDate: '2026-10-20',
    deadline: '2026-11-27',
    views: 2150,
    bookmarkedCount: 280,
    summary: '양자컴퓨팅 SDK(Qiskit)를 활용하여 최적화 및 복잡계 알고리즘 문제를 해결하는 전국 경진대회입니다.',
    description: `■ 참가 자격: 전국 대학 학부생 누구나
■ 지원 혜택: 대상 600만원 및 장관상, 국가수리과학연구소 인턴십 서류 면제`,
    eligibilityCriteria: [
      {
        id: 'math-1',
        title: '신청 자격',
        detail: '대학 재학생 또는 휴학생',
        required: true,
      },
    ],
    requiredDocuments: ['대회 참가신청서', '재학증명서'],
    scheduleSteps: [
      { step: '접수 마감', date: '2026.11.27' },
      { step: '예선 문제 공개', date: '2026.12.01' },
      { step: '결선 및 시상', date: '2026.12.18' },
    ],
    contact: {
      department: '대회 운영사무국',
      phone: '042-869-8080',
      email: 'quantum@nims.re.kr',
    },
    officialUrl: 'https://www.nims.re.kr',
    tags: ['양자컴퓨팅', '알고리즘', '상금1500만', '연구소인턴'],
    createdAt: '2026-10-20',
  },
  {
    id: 'notice-16',
    title: '중앙 알고리즘 학술동아리 [ALGO] 겨울방학 집중 스터디원 모집',
    category: 'activity',
    subcategory: '동아리',
    organizer: '인하대 중앙동아리 ALGO',
    organizerType: 'club',
    sourceTier: 'inha-dept',
    department: '컴퓨터공학과',
    sourceSiteName: '소프트웨어융합대학 동아리',
    targetAudience: '백준/프로그래머스 코딩테스트 및 ICPC 준비 학생',
    targetGrades: [1, 2, 3, 4],
    benefit: '전용 동아리방 좌석 + 코딩테스트 그룹 스터디 + 선배 코드리뷰',
    startDate: '2026-11-01',
    deadline: '2026-11-28',
    views: 2800,
    bookmarkedCount: 390,
    summary: '방학 동안 알고리즘 문제해결 역량을 확실히 다질 2026 겨울 코딩 캠프 회원을 모집합니다.',
    description: `■ 스터디 트랙:
  1. 기초 알고리즘 (백준 실버~골드 목표)
  2. 코딩테스트 집중반 (삼성, 카카오, 현대 기출 풀이)
  3. ICPC 대회 준비반`,
    eligibilityCriteria: [
      {
        id: 'club-1',
        title: '참여 요건',
        detail: '주 1회 대면 모임 참석 가능한 학생',
        required: true,
      },
    ],
    requiredDocuments: ['구글폼 지원서'],
    scheduleSteps: [
      { step: '지원서 마감', date: '2026.11.28' },
      { step: '온라인 OT', date: '2026.12.02' },
    ],
    contact: {
      department: '중앙동아리 ALGO',
      email: 'algo@inha.org',
      officeLocation: '학생회관 402호',
    },
    officialUrl: 'https://github.com/algo-inha',
    tags: ['동아리', '알고리즘', '코딩테스트', '백준', '동아리방'],
    createdAt: '2026-11-01',
  },
  {
    id: 'notice-17',
    title: '정석학술정보관(도서관) 시험기간 24시간 개방 및 야식마차 행사',
    category: 'academic',
    subcategory: '도서관/시설',
    organizer: '정석학술정보관 & 제42대 총학생회',
    organizerType: 'school',
    sourceTier: 'inha-main',
    sourceSiteName: '정석학술정보관',
    targetAudience: '인하대학교 구성원 전체',
    targetGrades: [1, 2, 3, 4],
    benefit: '열람실 24시간 연속 개방 + 야간 햄버거/간식 1,000인분 무료 배부',
    startDate: '2026-11-01',
    deadline: '2026-11-30',
    views: 6890,
    bookmarkedCount: 920,
    summary: '기말고사 기간 정석학술정보관 1~3열람실을 24시간 개방하며, 총학생회에서 학생들을 응원하는 야식마차 간식 행사를 진행합니다.',
    description: `■ 24시간 열람실 개방 기간: 2026년 11월 15일(일) 08:00 ~ 12월 5일(토) 24:00
■ 야식마차 행사: 11월 24일(화), 11월 26일(목) 21:00 정석도서관 1층 로비
■ 주의사항: 모바일 학생증 태그 입장 필수`,
    eligibilityCriteria: [
      {
        id: 'lib-1',
        title: '입장 조건',
        detail: '인하대 모바일 학생증 소지자',
        required: true,
      },
    ],
    requiredDocuments: ['모바일 학생증'],
    scheduleSteps: [
      { step: '24시간 운영 시작', date: '2026.11.15' },
      { step: '1차 야식 배부', date: '2026.11.24 21:00' },
      { step: '2차 야식 배부', date: '2026.11.26 21:00' },
    ],
    contact: {
      department: '정석학술정보관 학술정보운영팀',
      phone: '032-860-9000',
      email: 'library@inha.ac.kr',
    },
    officialUrl: 'https://lib.inha.ac.kr',
    tags: ['정석도서관', '24시간개방', '야식행사', '열람실', '시험기간'],
    createdAt: '2026-11-01',
  },
  {
    id: 'notice-18',
    title: '인천 지역 취약계층 청소년 SW 코딩 멘토링 봉사단 모집',
    category: 'activity',
    subcategory: '멘토링 봉사',
    organizer: '인하 사회봉사단 & 인천시 미추홀구',
    organizerType: 'school',
    sourceTier: 'inha-main',
    sourceSiteName: '인하 사회봉사단',
    targetAudience: '기초 코딩 지도가 가능한 학부 재학생',
    targetGrades: [1, 2, 3, 4],
    benefit: '사회봉사 60시간 인정 + 1365 등록 + 활동 지원금 학기당 30만원',
    estimatedValueNumber: 300000,
    startDate: '2026-10-25',
    deadline: '2026-12-05',
    views: 2100,
    bookmarkedCount: 270,
    summary: '지역아동센터 청소년들에게 엔트리, 스크래치, 파이썬 기초를 가르쳐주며 따뜻한 나눔을 실천할 인하대 멘토를 모집합니다.',
    description: `■ 활동 기간: 2026년 12월 ~ 2027년 2월 (주 1회 2시간)
■ 혜택: 인하대 사회봉사 학점(1학점) 인정 또는 봉사시간 60시간 부여, 활동비 지급`,
    eligibilityCriteria: [
      {
        id: 'vol-1',
        title: '신청 조건',
        detail: '책임감 있고 아이들을 좋아하는 재학생',
        required: true,
      },
    ],
    requiredDocuments: ['멘토 지원서 1부'],
    scheduleSteps: [
      { step: '신청 마감', date: '2026.12.05' },
      { step: '멘토 사전 교육', date: '2026.12.12' },
    ],
    contact: {
      department: '인하 사회봉사단',
      phone: '032-860-7067',
      email: 'volunteer@inha.ac.kr',
    },
    officialUrl: 'https://volunteer.inha.ac.kr',
    tags: ['사회봉사', '코딩멘토링', '봉사시간', '활동비지원'],
    createdAt: '2026-10-25',
  },
  {
    id: 'notice-19',
    title: '글로벌 빅테크 기업 테크 서밋 참관단 교비 파견 지원',
    category: 'support',
    subcategory: '연구지원금(URP)',
    organizer: '인하대학교 국제처 & 링크3.0사업단',
    organizerType: 'school',
    sourceTier: 'inha-dept',
    department: '학과 공통',
    sourceSiteName: '소프트웨어융합대학 / 링크3.0',
    targetAudience: '공학/SW계열 3~4학년 (토익 750점 이상)',
    targetGrades: [3, 4],
    benefit: '미국 실리콘밸리 테크 컨퍼런스 항공권 및 체재비 전액 지원',
    estimatedValueNumber: 4500000,
    startDate: '2026-10-20',
    deadline: '2026-12-10',
    views: 4890,
    bookmarkedCount: 740,
    recommendationReason: '✦ 추천 · 글로벌 진로 희망자',
    summary: '미국 샌프란시스코에서 열리는 글로벌 개발자 컨퍼런스 참관 및 현지 테크 기업 탐방 경비를 교비로 전액 지원합니다.',
    description: `■ 선발 인원: 총 12명 (공학/SW 계열)
■ 파견 일정: 2027년 1월 중순 (7박 9일)
■ 지원 내용: 왕복 항공권, 호텔 숙박비, 컨퍼런스 입장권, 일비 전액 지원`,
    eligibilityCriteria: [
      {
        id: 'global-1',
        title: '어학 요건',
        detail: 'TOEIC 750점 이상 또는 OPIc IM2 이상',
        required: true,
      },
      {
        id: 'global-2',
        title: '학년 요건',
        detail: '3~4학년 재학생',
        required: true,
        criterionType: 'grade',
        allowedGrades: [3, 4],
      },
    ],
    requiredDocuments: ['파견 지원서 및 영문 동기서', '공인 어학성적표'],
    scheduleSteps: [
      { step: '서류 마감', date: '2026.12.10' },
      { step: '영어 면접', date: '2026.12.17' },
      { step: '최종 합격자 발표', date: '2026.12.22' },
    ],
    contact: {
      department: '인하대 국제처 글로벌지원팀',
      phone: '032-860-7033',
      email: 'global@inha.ac.kr',
    },
    officialUrl: 'https://international.inha.ac.kr',
    tags: ['해외탐방', '실리콘밸리', '항공권지원', '링크사업단', '글로벌'],
    createdAt: '2026-10-20',
  },
  {
    id: 'notice-20',
    title: '정석 창업경진대회 및 예비창업패키지 시제품 제작 지원',
    category: 'competition',
    subcategory: '창업 경진대회',
    organizer: '인하대학교 창업지원단',
    organizerType: 'school',
    sourceTier: 'inha-main',
    sourceSiteName: '인하대 창업지원단',
    targetAudience: '창업 아이디어를 보유한 학부생 또는 팀',
    targetGrades: [1, 2, 3, 4],
    benefit: '시제품 제작비 팀당 최대 1,000만원 + 창업보육센터 입주 지원',
    estimatedValueNumber: 10000000,
    startDate: '2026-10-20',
    deadline: '2026-12-15',
    views: 3120,
    bookmarkedCount: 420,
    summary: '실제 사업화가 가능한 우수 창업 아이디어를 발굴하여 시제품 제작 예산과 전담 멘토링, 무료 사무공간을 제공합니다.',
    description: `■ 지원 규모: 총 10팀 선발
■ 지원 항목: 시제품 개발비 팀당 500만원~1,000만원 차등 지원, 특허 출원비 지원, 인하 벤처플라자 입주 무상 지원`,
    eligibilityCriteria: [
      {
        id: 'start-1',
        title: '신청 자격',
        detail: '인하대 학부생 대표 1인 포함 팀',
        required: true,
      },
    ],
    requiredDocuments: ['창업 사업계획서 1부'],
    scheduleSteps: [
      { step: '사업계획서 마감', date: '2026.12.15' },
      { step: 'IR 피칭 데모데이', date: '2026.12.23' },
    ],
    contact: {
      department: '인하대 창업지원단',
      phone: '032-860-7250',
      email: 'startup@inha.ac.kr',
    },
    officialUrl: 'https://startup.inha.ac.kr',
    tags: ['창업경진대회', '시제품지원', '창업보육', '상금1000만원'],
    createdAt: '2026-10-20',
  },
  {
    id: 'notice-21',
    title: '2026 기계공학과 스마트모빌리티 캡스톤 디자인 재료비 지원',
    category: 'support',
    subcategory: '캡스톤/재료비',
    organizer: '인하대학교 공과대학 기계공학과',
    organizerType: 'school',
    sourceTier: 'inha-dept',
    department: '기계공학과',
    sourceSiteName: '인하대 기계공학과',
    targetAudience: '기계공학과 3~4학년 캡스톤디자인 수강생 팀',
    targetGrades: [3, 4],
    benefit: '팀당 시제품 제작비 최대 200만원 + CAD/CAM 정밀가공실 우선 배정',
    estimatedValueNumber: 2000000,
    startDate: '2026-10-28',
    deadline: '2026-11-14',
    views: 1980,
    bookmarkedCount: 310,
    recommendationReason: '✦ 기계공학과 전공 특화',
    summary: '자율주행 모빌리티, 로봇 매니퓰레이터 등 기계공학과 졸업 캡스톤 프로젝트 팀을 위한 가공 재료비와 3D 프린팅 가공비를 무상 지원합니다.',
    description: `2026학년도 기계공학과 종합설계(캡스톤디자인) 수강생을 위한 시작품 제작비 지원 사업입니다.

■ 지원 대상: 기계공학과 종합설계 과목 수강 팀 (팀당 3~5인)
■ 지원 금액: 팀당 최대 200만원 실비 지원 (부품 구매, CNC/3D 프린팅 가공비)
■ 지원 분야: 자율주행 차체 샤시, 스마트 액추에이터, 친환경 에너지 하베스팅 장치, 로보틱스
■ 우수팀 특전: 현대차·현대로템 산학 멘토링 결연 및 기계공학과 학술제 본선 진출`,
    eligibilityCriteria: [
      {
        id: 'mech-c1',
        title: '전공 요건',
        detail: '기계공학과 주전공 또는 복수전공 재학생',
        required: true,
        criterionType: 'major',
      },
    ],
    requiredDocuments: ['캡스톤 과제 계획서 1부', '예산 산출 내역서 1부'],
    scheduleSteps: [
      { step: '신청서 접수 마감', date: '2026.11.14 18:00' },
      { step: '재료비 심사 승인', date: '2026.11.19' },
      { step: '시제품 중간 점검', date: '2026.12.10' },
    ],
    contact: {
      department: '기계공학과 학과사무실',
      phone: '032-860-7300',
      email: 'mech@inha.ac.kr',
      officeLocation: '2호관 남쪽 204호',
    },
    officialUrl: 'https://mech.inha.ac.kr',
    tags: ['기계공학과', '캡스톤디자인', '스마트모빌리티', '재료비지원', '공과대학'],
    createdAt: '2026-10-28',
  },
  {
    id: 'notice-22',
    title: '기계공학과 정밀열유체 및 지능형 로봇설계 연구실 2026 동계 URP 학부연구생 모집',
    category: 'work',
    subcategory: '학과 RA/TA',
    organizer: '기계공학과 첨단로봇메카트로닉스 연구실',
    organizerType: 'school',
    sourceTier: 'inha-dept',
    department: '기계공학과',
    sourceSiteName: '기계공학과 연구실',
    targetAudience: '기계설계 및 열유체 시뮬레이션에 관심 있는 2~4학년',
    targetGrades: [2, 3, 4],
    benefit: '월 45만원 학부연구생 장학금 + 최신 제어계측 장비 활용',
    estimatedValueNumber: 1350000,
    startDate: '2026-10-29',
    deadline: '2026-11-19',
    views: 1670,
    bookmarkedCount: 245,
    summary: 'CFD 유체해석 및 4족 보행 로봇 다이나믹스 제어 실험을 함께할 2026 동계 학부 연구생(URP)을 선발합니다.',
    description: `기계공학과 지능형 로봇메카트로닉스 랩에서 동계 방학 연구 프로젝트를 수행할 학부생을 모집합니다.

■ 주요 업무:
  - ANSYS Fluent를 활용한 고발열 전자부품 수냉 히트싱크 유동 해석
  - ROS2 기반 로봇 관절 모터 구동 드라이버 펌웨어 테스트
■ 연구 환경: 개인 연구 좌석, 고사양 워크스테이션, 3D 프린터 및 오실로스코프 풀세트 완비`,
    eligibilityCriteria: [
      {
        id: 'mech-c2',
        title: '신청 자격',
        detail: '기계공학과, 항공우주공학과 2~4학년 (평점 3.0 이상)',
        required: true,
        criterionType: 'gpa',
        minGpa: 3.0,
      },
    ],
    requiredDocuments: ['간단한 자기소개서 및 성적증명서'],
    scheduleSteps: [
      { step: '지원서 마감', date: '2026.11.19 18:00' },
      { step: '교수님 면담', date: '2026.11.23' },
    ],
    contact: {
      department: '기계공학과 로봇연구실',
      personName: '김진우 지도교수',
      email: 'robot-mech@inha.ac.kr',
      officeLocation: '하이테크관 315호',
    },
    officialUrl: 'https://mech.inha.ac.kr',
    tags: ['기계공학과', '학부연구생', 'URP', '로봇설계', '연구장학금'],
    createdAt: '2026-10-29',
  },
  {
    id: 'notice-23',
    title: '2026-2학기 경영대학 Bloomberg Terminal 금융데이터 실무 수료과정 4기 모집',
    category: 'support',
    subcategory: '실무자격/특강',
    organizer: '인하대학교 경영대학 금융투자분석센터',
    organizerType: 'school',
    sourceTier: 'inha-dept',
    department: '경영학과',
    sourceSiteName: '인하대 경영대학',
    targetAudience: '금융투자 및 기업 재무데이터 분석에 관심 있는 경영대 재학생',
    targetGrades: [2, 3, 4],
    benefit: '블룸버그 터미널 라이선스 무상 제공 + BMC 국제공인 인증서 취득 전액 지원',
    estimatedValueNumber: 1500000,
    startDate: '2026-10-27',
    deadline: '2026-11-16',
    views: 3120,
    bookmarkedCount: 520,
    recommendationReason: '✦ 경영학과 인기 커리어 트랙',
    summary: '월스트리트 표준 금융정보 단말기인 Bloomberg Terminal 실무 조작법을 익히고 블룸버그 공인 자격증(BMC)을 무료로 취득하는 특별 과정입니다.',
    description: `인하대학교 경영대학에서 재학생들의 글로벌 금융 투자 역량을 위해 2026 하반기 블룸버그 실무 과정을 개설합니다.

■ 교육 내용:
  - 글로벌 주식·채권·파생상품 실시간 데이터 크롤링 및 백테스팅
  - ESG 지표 및 M&A 재무제표 펀더멘털 분석 실습
  - Bloomberg Market Concepts (BMC) 자격증 전원 무료 응시권 부여
■ 교육 장소: 인하대 9호관 경영대 금융랩실`,
    eligibilityCriteria: [
      {
        id: 'biz-c1',
        title: '신청 대상',
        detail: '경영학과, 글로벌금융학과, 아태물류학부 재학생',
        required: true,
      },
    ],
    requiredDocuments: ['온라인 신청서 (경영대 홈페이지)'],
    scheduleSteps: [
      { step: '수강 접수 마감', date: '2026.11.16 18:00' },
      { step: '선발자 안내', date: '2026.11.20' },
      { step: '교육 시작', date: '2026.11.25' },
    ],
    contact: {
      department: '경영대학 행정실',
      phone: '032-860-7730',
      email: 'biz@inha.ac.kr',
      officeLocation: '9호관 114호',
    },
    officialUrl: 'https://biz.inha.ac.kr',
    tags: ['경영학과', '블룸버그', '금융데이터', '경영대학', '자격인증'],
    createdAt: '2026-10-27',
  },
  {
    id: 'notice-24',
    title: '경영학과 비즈니스 애널리틱스 & 글로벌 마케팅 전략 학술제 공모전',
    category: 'competition',
    subcategory: '아이디어/기획',
    organizer: '인하대 경영대학 학생회 & 경영학과',
    organizerType: 'school',
    sourceTier: 'inha-dept',
    department: '경영학과',
    sourceSiteName: '인하대 경영학과',
    targetAudience: '경영학과 및 상경계열 학부생 (개인 또는 팀)',
    targetGrades: [1, 2, 3, 4],
    benefit: '총 상금 450만원 (대상 200만원) + 경영대 학장 명의 표창',
    estimatedValueNumber: 2000000,
    startDate: '2026-10-30',
    deadline: '2026-11-23',
    views: 2410,
    bookmarkedCount: 380,
    summary: '이커머스 및 리테일 빅데이터를 분석하여 차세대 신규 비즈니스 모델과 디지털 마케팅 전략을 수립하는 경영학과 공식 학술제입니다.',
    description: `■ 대회 주제: "AI 기반 초개인화 비즈니스 모델 및 글로벌 시장 진출 전략"
■ 시상 내역:
  - 대상 (1팀): 상금 200만원 및 경영대학장상
  - 최우수상 (1팀): 상금 150만원
  - 우수상 (2팀): 각 50만원`,
    eligibilityCriteria: [
      {
        id: 'biz-c2',
        title: '팀 구성',
        detail: '경영대 소속 1인 이상 포함 2~4인 팀',
        required: true,
      },
    ],
    requiredDocuments: ['학술제 제안서 (PPT 20장 이내)'],
    scheduleSteps: [
      { step: '제안서 마감', date: '2026.11.23 23:59' },
      { step: '본선 발표회', date: '2026.12.02' },
    ],
    contact: {
      department: '경영학과 학과사무실',
      phone: '032-860-7735',
      email: 'biz-contest@inha.ac.kr',
    },
    officialUrl: 'https://biz.inha.ac.kr',
    tags: ['경영학과', '학술제', '마케팅전략', '상금450만', '경영대'],
    createdAt: '2026-10-30',
  },
  {
    id: 'notice-25',
    title: '물리학과 첨단 양자물질·펨토초 레이저 나노광학 연구실 동계 인턴십(Lab Rotation)',
    category: 'work',
    subcategory: '학과 RA/TA',
    organizer: '인하대학교 자연과학대학 물리학과',
    organizerType: 'school',
    sourceTier: 'inha-dept',
    department: '물리학과',
    sourceSiteName: '인하대 물리학과',
    targetAudience: '양자정보 및 응집물질물리 실험에 관심 있는 2~4학년 학부생',
    targetGrades: [2, 3, 4],
    benefit: '월 40만원 인턴 연구비 + 방학 중 4주 랩 로테이션 실습',
    estimatedValueNumber: 800000,
    startDate: '2026-10-26',
    deadline: '2026-11-18',
    views: 1420,
    bookmarkedCount: 195,
    recommendationReason: '✦ 물리학과 전공 특화 연구실',
    summary: '2차원 초전도체, 위상절연체, 펨토초 레이저 분광학 등 첨단 물리 실험 장비를 직접 다뤄볼 수 있는 학부생 랩 인턴십 프로그램입니다.',
    description: `인하대 물리학과에서 미래 순수과학 및 양자기술 연구자를 꿈꾸는 학부생을 위한 2026 동계 연구실 순환 인턴십을 모집합니다.

■ 인턴십 혜택:
  - 4주간 주 15시간 연구 참여 시 월 40만원 연구지원금 지급
  - 액체 헬륨 극저온 측정 장치 및 클린룸 장비 조작 실습
  - 학부 졸업논문 주제 사전 확정 가능`,
    eligibilityCriteria: [
      {
        id: 'phy-c1',
        title: '신청 조건',
        detail: '물리학과 주전공 또는 복수전공 재학생 (성적 3.0 이상)',
        required: true,
        criterionType: 'gpa',
        minGpa: 3.0,
      },
    ],
    requiredDocuments: ['인턴십 지원동기서 (A4 1장)', '성적증명서'],
    scheduleSteps: [
      { step: '지원서 마감', date: '2026.11.18 18:00' },
      { step: '면담 및 랩 배정', date: '2026.11.24' },
    ],
    contact: {
      department: '물리학과 학과사무실',
      phone: '032-860-7650',
      email: 'physics@inha.ac.kr',
      officeLocation: '5호관 403호',
    },
    officialUrl: 'https://physics.inha.ac.kr',
    tags: ['물리학과', '양자물리', '나노광학', '랩로테이션', '학부인턴', '자연과학대학'],
    createdAt: '2026-10-26',
  },
  {
    id: 'notice-26',
    title: '물리학과 2026 동계 수리물리 및 양자역학 기초 학술 튜터링 튜터 선발',
    category: 'support',
    subcategory: '튜터링/학습지원',
    organizer: '인하대학교 물리학과 학과사무실',
    organizerType: 'school',
    sourceTier: 'inha-dept',
    department: '물리학과',
    sourceSiteName: '인하대 물리학과',
    targetAudience: '수리물리학/양자역학 전공과목 A0 이상 취득한 3~4학년',
    targetGrades: [3, 4],
    benefit: '튜터 활동비 시간당 14,000원 + 학과장 봉사활동 인증서',
    estimatedValueNumber: 560000,
    startDate: '2026-10-31',
    deadline: '2026-11-26',
    views: 1180,
    bookmarkedCount: 160,
    summary: '후배 재학생들의 전공 진입 장벽을 낮추기 위해 수리물리학 및 기초물리 문제풀이를 지도해줄 전공 튜터를 선발합니다.',
    description: `■ 활동 기간: 2026년 동계 계절학기 (총 40시간 활동)
■ 활동비: 시간당 14,000원 (총 56만원 지급)
■ 역할: 주 2회 전공 기초 문제풀이 세미나 및 1:1 질의응답 지도`,
    eligibilityCriteria: [
      {
        id: 'phy-c2',
        title: '성적 요건',
        detail: '해당 전공과목 A0 이상 취득자',
        required: true,
      },
    ],
    requiredDocuments: ['튜터 지원서 1부'],
    scheduleSteps: [
      { step: '지원 마감', date: '2026.11.26 18:00' },
      { step: '튜터 사전 OT', date: '2026.12.03' },
    ],
    contact: {
      department: '물리학과 학과사무실',
      phone: '032-860-7651',
      email: 'physics-tutor@inha.ac.kr',
    },
    officialUrl: 'https://physics.inha.ac.kr',
    tags: ['물리학과', '수리물리', '튜터링', '활동비지급', '학과사무실'],
    createdAt: '2026-10-31',
  },
  {
    id: 'notice-27',
    title: '에너지자원공학과 친환경 신재생에너지 및 지하자원 AI탐사 현장실습 프로그램',
    category: 'support',
    subcategory: '현장실습/견학',
    organizer: '인하대학교 공과대학 에너지자원공학과',
    organizerType: 'school',
    sourceTier: 'inha-dept',
    department: '에너지자원공학과',
    sourceSiteName: '에너지자원공학과',
    targetAudience: '신재생에너지 및 자원개발에 관심 있는 에너지자원공학과 재학생',
    targetGrades: [2, 3, 4],
    benefit: '실습 지원비 80만원 + 한국지질자원연구원(KIGAM) 연수 수료증',
    estimatedValueNumber: 800000,
    startDate: '2026-10-25',
    deadline: '2026-11-17',
    views: 1540,
    bookmarkedCount: 220,
    recommendationReason: '✦ 에너지자원공학과 전공 특화',
    summary: '지열·풍력·태양광 등 신재생에너지 단지 및 지하자원 3D 지표투과레이더 탐사 현장을 견학하고 데이터 분석 실습을 진행합니다.',
    description: `에너지자원공학과 학부생들의 실무 현장 감각을 극대화하기 위한 산학연 연계 단기 인턴십입니다.

■ 프로그램 개요:
  - 국내 주요 지열발전 및 해상풍력 실증단지 탐방 (3박 4일)
  - 한국지질자원연구원(KIGAM) 지하공간 물리탐사 AI 소프트웨어 실습
  - 참가자 전원 숙식 및 실습비 80만원 전액 교비 지원`,
    eligibilityCriteria: [
      {
        id: 'ene-c1',
        title: '신청 대상',
        detail: '에너지자원공학과 재학생 (선착순 20명)',
        required: true,
      },
    ],
    requiredDocuments: ['참가신청서 1부'],
    scheduleSteps: [
      { step: '신청 마감', date: '2026.11.17 18:00' },
      { step: '사전 안전교육', date: '2026.11.28' },
    ],
    contact: {
      department: '에너지자원공학과 학과사무실',
      phone: '032-860-7540',
      email: 'energy@inha.ac.kr',
      officeLocation: '2호관 북쪽 312호',
    },
    officialUrl: 'https://energy.inha.ac.kr',
    tags: ['에너지자원공학과', '신재생에너지', '현장실습', 'KIGAM', '실습비지원', '공과대학'],
    createdAt: '2026-10-25',
  },
  {
    id: 'notice-28',
    title: '에너지자원공학과 탄소중립 CCUS(탄소포집·저장) 산학연계 연구보조원 모집',
    category: 'work',
    subcategory: '학과 RA/TA',
    organizer: '에너지자원공학과 지구환경시스템 연구실',
    organizerType: 'school',
    sourceTier: 'inha-dept',
    department: '에너지자원공학과',
    sourceSiteName: '에너지자원공학과 연구실',
    targetAudience: '탄소중립 기술 및 지하 다공질 매체 유체역학 관심 학생',
    targetGrades: [3, 4],
    benefit: '월 45만원 산학장학금 + 국책과제 연구 참여확인서 발급',
    estimatedValueNumber: 1350000,
    startDate: '2026-10-29',
    deadline: '2026-11-27',
    views: 1290,
    bookmarkedCount: 180,
    summary: '동해가스전 해저 지중 CO2 저장 실증 연구사업단에서 수치 시뮬레이션 및 코어 시편 분석을 지원할 연구보조원을 선발합니다.',
    description: `■ 업무 내용:
  - 고압 이산화탄소 주입 코어플러딩 실험 보조
  - ECLIPSE / CMG 소프트웨어를 활용한 저류층 유동 모델링 결과 정리
■ 근무 시간: 주 12시간 (학업 병행 가능 탄력 근무)`,
    eligibilityCriteria: [
      {
        id: 'ene-c2',
        title: '신청 자격',
        detail: '에너지자원공학과, 화학공학과 3~4학년 (평점 3.2 이상)',
        required: true,
        criterionType: 'gpa',
        minGpa: 3.2,
      },
    ],
    requiredDocuments: ['자기소개서 및 성적표'],
    scheduleSteps: [
      { step: '지원서 마감', date: '2026.11.27 18:00' },
      { step: '연구실 면담', date: '2026.12.02' },
    ],
    contact: {
      department: '에너지자원공학과 환경저류층랩',
      email: 'ccus-lab@inha.ac.kr',
      officeLocation: '2호관 318호',
    },
    officialUrl: 'https://energy.inha.ac.kr',
    tags: ['에너지자원공학과', '탄소중립', 'CCUS', '연구보조원', '월45만원'],
    createdAt: '2026-10-29',
  },
  {
    id: 'notice-29',
    title: '전자공학과 지능형 반도체 소자 및 시스템 집적회로(IC) 설계 실무 워크숍',
    category: 'academic',
    subcategory: '특강/세미나',
    organizer: '인하대학교 IT공과대학 전자공학과',
    organizerType: 'school',
    sourceTier: 'inha-dept',
    department: '전자공학과',
    sourceSiteName: '인하대 전자공학과',
    targetAudience: '반도체 회로 설계 및 임베디드 시스템 관심 학부생',
    targetGrades: [2, 3, 4],
    benefit: 'Cadence Virtuoso EDA 라이선스 실습 + 반도체 트랙 수료증 발급',
    startDate: '2026-10-28',
    deadline: '2026-11-20',
    views: 2950,
    bookmarkedCount: 440,
    recommendationReason: '✦ 전자공학과 반도체 트랙',
    summary: '글로벌 파운드리 산업에서 표준으로 사용하는 Cadence EDA 툴을 활용하여 아날로그/디지털 혼성 신호 집적회로를 직접 레이아웃하는 3주 집중 워크숍입니다.',
    description: `인하대 전자공학과에서 차세대 시스템반도체 인재 양성을 위해 산업체 전문 엔지니어 초청 실습 과정을 진행합니다.

■ 교육 커리큘럼:
  - CMOS 인버터 및 증폭기 트랜지스터 레벨 스케매틱 설계
  - DRC/LVS 물리적 디자인 룰 검증
  - 수료자 전원 삼성전자·SK하이닉스 산학 장학생 추천 시 가점 부여`,
    eligibilityCriteria: [
      {
        id: 'ee-c1',
        title: '신청 조건',
        detail: '전자공학과, 전기공학과 재학생 (선착순 35명)',
        required: true,
      },
    ],
    requiredDocuments: ['워크숍 참가신청서 (포털 신청)'],
    scheduleSteps: [
      { step: '참가 접수 마감', date: '2026.11.20 18:00' },
      { step: '1회차 워크숍', date: '2026.11.27' },
    ],
    contact: {
      department: '전자공학과 학과사무실',
      phone: '032-860-7410',
      email: 'ee@inha.ac.kr',
      officeLocation: '하이테크관 202호',
    },
    officialUrl: 'https://ee.inha.ac.kr',
    tags: ['전자공학과', '반도체설계', 'Cadence', '집적회로', 'IT공대'],
    createdAt: '2026-10-28',
  },
];
