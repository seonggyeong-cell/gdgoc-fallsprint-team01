// [담당: 역할 A] 샘플 공고 (인하대 공지 제외). ※ 전부 예시 데이터입니다.
// officialUrl을 생략하면 출처 사이트 메인으로 연결됩니다 → 실제 공고를 찾으면 개별 공고 URL로 교체하세요.
import type { NoticeItem } from '@/types';
import { build, Seed } from './seed';

const seeds: Seed[] = [
  // ── 근로·알바 ──
  { id: 'work-01', title: '2학기 교내 근로장학생 추가 모집 (도서관·행정부서)', category: 'work', subcategory: '교내 근로장학', organizer: '학생지원팀', source: 'inha',
    benefit: '시급 11,000원 + 근로장학금', estimatedValueNumber: 900000, summary: '교내 부서에서 근무하며 학비 부담을 줄일 수 있는 근로장학생을 추가로 모집합니다.',
    tags: ['근로장학', '교내', '학비지원'], dueIn: 6, views: 1420, saves: 210, postedAgo: 2 },
  { id: 'work-02', title: '학과 연구실 학부 연구보조원(RA) 모집', category: 'work', subcategory: '교내 행정·연구 보조', organizer: '공과대학 연구실', source: 'inha',
    benefit: '월 40만원 + 연구 경험', estimatedValueNumber: 2400000, summary: '데이터 정리와 실험 보조 업무를 맡을 학부 연구보조원을 모집합니다.',
    tags: ['연구보조', 'RA', '대학원진학'], careerFields: ['science', 'engineering'], majors: ['화학', '물리', '전기', '기계', '신소재'], dueIn: 14, views: 540, saves: 66 },
  { id: 'work-03', title: '재택 가능 데이터 라벨링·검수 단기 알바', category: 'work', subcategory: '재택·단기 알바', organizer: '데이터 서비스 업체', source: 'albamon',
    benefit: '건당 보수 / 주 10시간 내외', estimatedValueNumber: 400000, summary: '시간 조율이 쉬운 재택 단기 알바로 방학·시험 기간에도 병행할 수 있습니다.',
    tags: ['재택', '단기알바', '데이터'], careerFields: ['ai'], isOngoing: true, views: 880, saves: 95 },

  // ── 인턴·취업 ──
  { id: 'career-01', title: '국내 IT 기업 개발자 체험형 인턴 채용', category: 'career', subcategory: '인턴십', organizer: 'IT 서비스 기업', source: 'jobkorea',
    benefit: '월 220만원 + 정규직 전환 심사', estimatedValueNumber: 4400000, summary: '백엔드·프론트엔드·모바일 직무 인턴을 모집하며 우수자는 정규직 전환 기회가 있습니다.',
    tags: ['인턴', '개발자', '정규직전환'], careerFields: ['software', 'ai'], majors: ['컴퓨터', '정보통신', '소프트웨어', '인공지능', '데이터'], dueIn: 9, views: 3200, saves: 520, postedAgo: 4 },
  { id: 'career-02', title: '대기업 계열사 대학생 하계·동계 인턴 공개채용', category: 'career', subcategory: '인턴십', organizer: '대기업 계열사', source: 'saramin',
    benefit: '인턴 급여 + 우수자 서류전형 면제', estimatedValueNumber: 3500000, summary: '직무별 현업 체험과 수료 후 채용 연계 혜택이 제공됩니다.',
    tags: ['대기업', '인턴', '채용연계'], careerFields: ['business', 'engineering'], dueIn: 18, views: 2750, saves: 430 },
  { id: 'career-03', title: '스타트업 마케팅·기획 인턴 (주 3일 근무 가능)', category: 'career', subcategory: '인턴십', organizer: '초기 스타트업', source: 'linkareer',
    benefit: '월 120만원 + 실무 포트폴리오', estimatedValueNumber: 1200000, summary: '학업과 병행 가능한 파트타임 인턴으로 콘텐츠 기획과 마케팅 실무를 경험합니다.',
    tags: ['스타트업', '마케팅', '파트타임'], careerFields: ['business', 'design'], majors: ['경영', '통상', '디자인'], dueIn: 12, views: 960, saves: 120 },
  { id: 'career-04', title: '재학생 현장실습(학기제) 참여 학생 모집', category: 'career', subcategory: '현장실습', organizer: '현장실습지원센터', source: 'inha',
    benefit: '학점 인정 + 실습 지원비', estimatedValueNumber: 1500000, summary: '학기 중 협력 기업에서 실습하며 학점도 인정받는 프로그램입니다.',
    tags: ['현장실습', '학점인정', '산학'], careerFields: ['engineering', 'software'], dueIn: 21, views: 700, saves: 88 },

  // ── 장학금 ──
  { id: 'sch-01', title: '국가장학금 2차 신청 안내', category: 'scholarship', subcategory: '소득연계', organizer: '한국장학재단', source: 'kosaf',
    benefit: '소득구간별 등록금 지원', estimatedValueNumber: 3000000, summary: '한국장학재단 신청 기간 내 소득·성적 요건에 맞춰 신청합니다.',
    tags: ['국가장학금', '등록금'], dueIn: 5, views: 4100, saves: 640, postedAgo: 6 },
  { id: 'sch-02', title: '민간 장학재단 장학생 선발 (통합 공고)', category: 'scholarship', subcategory: '외부재단·기업', organizer: '민간 장학재단', source: 'kosaf',
    benefit: '학기당 200만원', estimatedValueNumber: 2000000, summary: '성적·경제 여건 등을 고려해 선발하는 외부 장학금입니다.',
    tags: ['외부장학', '민간재단'], dueIn: 25, views: 1200, saves: 150 },

  // ── 공모전·해커톤 ──
  { id: 'comp-01', title: 'AI 서비스 개발 해커톤 (온라인 예선 + 오프라인 본선)', category: 'competition', subcategory: '해커톤', organizer: '데이터 경진대회 플랫폼', source: 'dacon',
    benefit: '총 상금 1,000만원 + 채용 연계', estimatedValueNumber: 4000000, summary: '생성형 AI를 활용한 서비스 아이디어를 구현하는 해커톤입니다.',
    tags: ['해커톤', 'AI', '개발'], careerFields: ['ai', 'software'], majors: ['컴퓨터', '인공지능', '데이터', '정보통신'], dueIn: 11, views: 2600, saves: 380 },
  { id: 'comp-02', title: '대학생 아이디어·기획 공모전 (사회문제 해결)', category: 'competition', subcategory: '아이디어·기획', organizer: '공공기관', source: 'wevity',
    benefit: '대상 500만원 + 인턴 기회', estimatedValueNumber: 5000000, summary: '지역·환경 문제를 해결하는 기획안을 제출하는 공모전입니다.',
    tags: ['공모전', '기획', '아이디어'], careerFields: ['business', 'public'], dueIn: 16, views: 1800, saves: 240 },
  { id: 'comp-03', title: '영상·디자인 콘텐츠 공모전', category: 'competition', subcategory: '디자인·영상', organizer: '미디어 기업', source: 'linkareer',
    benefit: '총 상금 700만원', estimatedValueNumber: 3000000, summary: '숏폼 영상과 포스터 부문에서 작품을 모집합니다.',
    tags: ['영상', '디자인', '콘텐츠'], careerFields: ['design'], majors: ['디자인', '미디어'], dueIn: 30, views: 950, saves: 110 },

  // ── 봉사·대외활동 ──
  { id: 'act-01', title: '지역 아동 학습 멘토링 봉사 (주 1회)', category: 'activity', subcategory: '봉사활동', organizer: '지역 아동센터', source: 'vms1365',
    benefit: '봉사시간 인정 (VMS)', summary: '초·중등 학생의 학습을 돕는 정기 봉사로 활동 시간이 인정됩니다.',
    tags: ['봉사', '멘토링', '교육'], careerFields: ['education', 'public'], isOngoing: true, views: 620, saves: 70 },
  { id: 'act-02', title: '대학생 서포터즈 모집 (활동비 + 수료증)', category: 'activity', subcategory: '서포터즈', organizer: '공공·기업 서포터즈', source: 'campuspick',
    benefit: '월 활동비 + 수료증', estimatedValueNumber: 600000, summary: 'SNS 콘텐츠 제작과 오프라인 행사 참여로 스펙을 쌓는 대외활동입니다.',
    tags: ['서포터즈', '대외활동', '스펙'], careerFields: ['business', 'design'], dueIn: 8, views: 1500, saves: 190 },
  { id: 'act-03', title: '중앙동아리 신입 부원 모집 (개발·밴드·봉사 등)', category: 'activity', subcategory: '동아리·소모임', organizer: '총동아리연합회', source: 'inha',
    benefit: '활동 지원비 + 인맥·경험', summary: '다양한 분야의 중앙동아리가 신입 부원을 모집합니다.',
    tags: ['동아리', '신입모집'], dueIn: 13, views: 1100, saves: 140 },

  // ── 학생지원 ──
  { id: 'sup-01', title: '어학시험(토익·토플 등) 응시료 지원', category: 'support', subcategory: '자격증·어학', organizer: '진로취업지원팀', source: 'inha',
    benefit: '응시료 최대 5만원 지원', estimatedValueNumber: 50000, summary: '공인어학시험 응시 후 영수증을 제출하면 응시료를 지원합니다.',
    tags: ['어학', '토익', '응시료'], careerFields: ['global'], dueIn: 20, views: 1300, saves: 175 },
];

export const MOCK_NOTICES: NoticeItem[] = seeds.map(build);
