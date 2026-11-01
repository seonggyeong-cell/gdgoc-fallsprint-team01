// [공유] 사용자/보관함 타입 — 수정 시 팀 전원 confirm 필요
import type { CareerField, NoticeCategory } from './notice';

export type AuthProvider = 'google' | 'naver' | 'demo';

export interface AuthUser {
  id: string; // 'google:xxxx' 형태 (provider 포함)
  provider: AuthProvider;
  name: string;
  email?: string;
  picture?: string;
}

export interface UserProfile {
  department: string;                   // 학과(본과)
  careerFields: CareerField[];          // 희망 진로 분야
  interestCategories: NoticeCategory[]; // 우선 보고 싶은 공고 분야
  onboarded: boolean;                   // 최초 정보 입력(또는 건너뛰기) 완료 여부
}

export type ApplicationStage = 'saved' | 'preparing' | 'submitted' | 'accepted' | 'rejected';

export interface BookmarkRecord {
  noticeId: string;
  stage: ApplicationStage;
  savedAt: string;
  memo?: string;
}
