// [공유] 사이트 모음(외부 사이트 소개·링크 카드) 타입 — 수정 시 팀 전원 confirm 필요
export type SiteGroup = 'gov_training' | 'paid_course' | 'free_study' | 'career';

/** 비용 성격: 카드에 배지로 표시 (국비 vs 기업 지원 무료 vs 유료를 구분하기 위함) */
export type SiteCost = 'gov' | 'sponsored' | 'free' | 'paid' | 'mixed';

/** 사이트 메인이 아닌 '구체적인 화면'으로 바로 연결되는 링크 (예: 인턴 공고 목록) */
export interface SiteEntry {
  label: string; // 예: '인턴 공고 목록'
  url: string;
}

export interface SiteLink {
  id: string;            // 영문 슬러그 (예: 'ssafy')
  name: string;          // 사이트 이름
  org: string;           // 운영 기관
  group: SiteGroup;      // 사이트 모음 탭의 분류
  url: string;           // 사이트 메인 주소
  description: string;   // 카드 소개 1~2문장
  tags: string[];
  cost?: SiteCost;       // 비용 성격 배지
  entries?: SiteEntry[]; // 구체 화면 바로가기. 첫 항목이 카드의 주 버튼이 됩니다
  searchUrl?: string;    // 검색 결과 주소 템플릿. '{q}' 자리에 검색어가 들어갑니다
  note?: string;         // 카드 하단 안내 (모집 시기, 참여 조건 등)
  hasApi?: boolean;      // 공식 API가 있어 서버 연결 후 공고 자동 수집 대상
}
