// [공유] 프로젝트 전역 상수·설정 — 변수는 가능한 한 여기에 모읍니다. 수정 시 팀 전원 confirm 필요
import type {
  ApplicationStage, CareerField, FilterState, NoticeCategory, NoticeSource, SortKey, StatusFilter, TabKey,
} from '@/types';

// ───────── 앱 기본 정보 ─────────
export const APP_NAME = '스쿨모아';
export const SCHOOL_NAME = '인하대학교';

// ───────── 환경변수 (.env.local) ─────────
export const ENV = {
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined,
  naverClientId: import.meta.env.VITE_NAVER_CLIENT_ID as string | undefined,
  naverCallbackUrl: (import.meta.env.VITE_NAVER_CALLBACK_URL as string | undefined) ?? window.location.origin + '/',
  fixedToday: import.meta.env.VITE_FIXED_TODAY as string | undefined, // 데모용 오늘 날짜 고정 (YYYY-MM-DD)
};
// 소셜 로그인 키가 없거나 개발 모드일 때 '체험 로그인' 버튼 노출
export const SHOW_DEMO_LOGIN = import.meta.env.DEV || (!ENV.googleClientId && !ENV.naverClientId);

// ───────── 날짜 ─────────
export const CLOSING_SOON_DAYS = 7;
export function getToday(): Date {
  if (ENV.fixedToday) {
    const [y, m, d] = ENV.fixedToday.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

// ───────── localStorage 키 (백엔드 연동 전 임시 저장소) ─────────
export const STORAGE_KEYS = {
  customNotices: 'schoolmoa:custom-notices',
  authUser: 'schoolmoa:auth-user',
  profile: (uid: string) => `schoolmoa:profile:${uid}`,
  bookmarks: (uid: string) => `schoolmoa:bookmarks:${uid}`,
  records: (uid: string) => `schoolmoa:records:${uid}`,
};

// ───────── 카테고리 ─────────
export const CATEGORIES: { key: NoticeCategory; label: string; subcategories: string[] }[] = [
  { key: 'work', label: '근로·알바', subcategories: ['교내 근로장학', '교내 행정·연구 보조', '교외 아르바이트', '재택·단기 알바'] },
  { key: 'career', label: '인턴·취업', subcategories: ['인턴십', '채용공고', '현장실습', '채용설명회·박람회', '직무 멘토링'] },
  { key: 'scholarship', label: '장학금', subcategories: ['성적우수', '소득연계', '외부재단·기업', '특성화'] },
  { key: 'competition', label: '공모전·해커톤', subcategories: ['해커톤', 'AI·데이터', '아이디어·기획', '디자인·영상', '창업'] },
  { key: 'activity', label: '봉사·대외활동', subcategories: ['봉사활동', '서포터즈', '동아리·소모임', '해외·교환', '멘토링'] },
  { key: 'support', label: '학생지원', subcategories: ['학술·연구비', '자격증·어학', '생활·복지', '상담·진로'] },
  { key: 'academic', label: '인하대 공지', subcategories: ['학사', '수강', '장학·등록', '행사·특강', '시설'] },
];
export const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label])) as Record<NoticeCategory, string>;

// ───────── 공고 출처 사이트 ─────────
export const SOURCES: Record<NoticeSource, { label: string; url: string }> = {
  inha: { label: '인하대학교', url: 'https://www.inha.ac.kr' },
  jobkorea: { label: '잡코리아', url: 'https://www.jobkorea.co.kr' },
  saramin: { label: '사람인', url: 'https://www.saramin.co.kr' },
  albamon: { label: '알바몬', url: 'https://www.albamon.com' },
  linkareer: { label: '링커리어', url: 'https://linkareer.com' },
  campuspick: { label: '캠퍼스픽', url: 'https://www.campuspick.com' },
  wevity: { label: '위비티', url: 'https://www.wevity.com' },
  dacon: { label: '데이콘', url: 'https://dacon.io' },
  vms1365: { label: '1365 자원봉사포털', url: 'https://www.1365.go.kr' },
  kosaf: { label: '한국장학재단', url: 'https://www.kosaf.go.kr' },
  user: { label: '학생 제보', url: '' },
};

// ───────── 희망 진로 / 학과 ─────────
export const CAREER_FIELDS: { key: CareerField; label: string }[] = [
  { key: 'software', label: 'SW·개발' },
  { key: 'ai', label: 'AI·데이터' },
  { key: 'engineering', label: '전기·기계·공학' },
  { key: 'science', label: '자연과학·연구' },
  { key: 'business', label: '경영·마케팅·금융' },
  { key: 'design', label: '디자인·콘텐츠' },
  { key: 'public', label: '공공·행정·복지' },
  { key: 'education', label: '교육·강의' },
  { key: 'global', label: '국제·무역·어학' },
];
export const CAREER_LABELS = Object.fromEntries(CAREER_FIELDS.map((c) => [c.key, c.label])) as Record<CareerField, string>;
// 입력 편의용 예시 (자유 입력 가능)
export const DEPARTMENT_SUGGESTIONS = [
  '컴퓨터공학과', '정보통신공학과', '인공지능공학과', '데이터사이언스학과', '전기공학과', '기계공학과',
  '산업경영공학과', '경영학과', '국제통상학과', '디자인테크놀로지학과', '화학공학과', '수학과',
];

// ───────── 필터 / 정렬 ─────────
export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'deadline', label: '마감일 빠른순' },
  { key: 'latest', label: '최신 등록순' },
  { key: 'popular', label: '조회/인기순' },
  { key: 'benefit', label: '지원규모 높은순' },
];
export const STATUS_OPTIONS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'recruiting', label: '접수중' },
  { key: 'closing-soon', label: `마감임박(D-${CLOSING_SOON_DAYS})` },
  { key: 'ongoing', label: '상시모집' },
];
export const DEFAULT_FILTERS: FilterState = {
  category: 'all', subcategory: 'all', source: 'all', status: 'all',
  sortBy: 'deadline', searchQuery: '', onlyRecommended: false, includeClosed: false,
};

// ───────── 지원 진행 단계 (보관함) ─────────
export const STAGES: { key: ApplicationStage; label: string; color: string }[] = [
  { key: 'saved', label: '관심 등록', color: 'bg-neutral-100 text-neutral-700' },
  { key: 'preparing', label: '준비중', color: 'bg-amber-100 text-amber-800' },
  { key: 'submitted', label: '지원 완료', color: 'bg-indigo-100 text-indigo-800' },
  { key: 'accepted', label: '최종 선정', color: 'bg-emerald-100 text-emerald-800' },
  { key: 'rejected', label: '미선정', color: 'bg-rose-100 text-rose-800' },
];

// ───────── 상단 내비게이션 ─────────
export const NAV_TABS: { key: TabKey; label: string; mobileLabel: string }[] = [
  { key: 'browse', label: '공고 둘러보기', mobileLabel: '공고 탐색' },
  { key: 'calendar', label: '캘린더 일정', mobileLabel: '캘린더' },
  { key: 'custom', label: '맞춤 추천', mobileLabel: '맞춤추천' },
  { key: 'bookmarks', label: '관심 보관함', mobileLabel: '보관함' },
];
