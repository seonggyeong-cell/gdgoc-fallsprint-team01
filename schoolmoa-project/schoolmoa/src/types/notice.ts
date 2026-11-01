// [공유] 타입 정의 — 수정 시 팀 전원 confirm 필요
export type NoticeCategory = 'work' | 'career' | 'scholarship' | 'competition' | 'activity' | 'support' | 'academic';
export type CareerField = 'software' | 'ai' | 'engineering' | 'science' | 'business' | 'design' | 'public' | 'education' | 'global';
export type NoticeSource = 'inha' | 'jobkorea' | 'saramin' | 'albamon' | 'linkareer' | 'campuspick' | 'wevity' | 'dacon' | 'vms1365' | 'kosaf' | 'user';

export interface NoticeItem {
  id: string;
  title: string;
  category: NoticeCategory;
  subcategory: string;
  organizer: string;
  source: NoticeSource;          // 공고를 가져온 사이트
  officialUrl: string;           // 원문(신청) 링크 — 필수
  benefit: string;               // 예: '시급 11,000원', '총 상금 1,000만원'
  estimatedValueNumber?: number; // 원 단위, '지원규모 높은순' 정렬/보관함 합계에 사용
  startDate: string;             // YYYY-MM-DD
  deadline: string;              // YYYY-MM-DD (due date)
  isOngoing?: boolean;           // 상시모집
  summary: string;
  description?: string;
  tags: string[];
  careerFields?: CareerField[];  // 추천용: 관련 진로 분야
  majors?: string[];             // 추천용: 학과명에 포함되면 매칭되는 키워드 (예: '컴퓨터')
  views: number;
  bookmarkedCount: number;
  createdAt: string;
  isUserSubmitted?: boolean;
}

// ---- UI 공통 ----
export type TabKey = 'browse' | 'calendar' | 'custom' | 'bookmarks';
export type ViewMode = 'grid' | 'table' | 'calendar';
export type StatusFilter = 'all' | 'recruiting' | 'closing-soon' | 'ongoing';
export type SortKey = 'deadline' | 'latest' | 'popular' | 'benefit';

export interface FilterState {
  category: NoticeCategory | 'all';
  subcategory: string;
  source: NoticeSource | 'all';
  status: StatusFilter;
  sortBy: SortKey;
  searchQuery: string;
  onlyRecommended: boolean;
  includeClosed: boolean;
}
