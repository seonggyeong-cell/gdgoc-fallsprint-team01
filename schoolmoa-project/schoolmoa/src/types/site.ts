// [공유] 사이트 모음(외부 사이트 소개·링크 카드) 타입 — 수정 시 팀 전원 confirm 필요
export type SiteGroup = 'gov_training' | 'paid_course' | 'free_study' | 'career';

export interface SiteLink {
  id: string;            // 영문 슬러그 (예: 'ssafy')
  name: string;          // 사이트 이름
  org: string;           // 운영 기관
  group: SiteGroup;      // 사이트 모음 탭의 분류
  url: string;           // 사이트 주소 (새 탭으로 열림)
  description: string;   // 카드 소개 1~2문장
  tags: string[];
  note?: string;         // 카드 하단 안내 (모집 시기, 참여 조건 등)
  hasApi?: boolean;      // 공식 API가 있어 서버 연결 후 공고 자동 수집 대상
}
