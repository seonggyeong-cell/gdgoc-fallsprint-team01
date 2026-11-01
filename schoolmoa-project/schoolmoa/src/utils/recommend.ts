// [담당: 역할 B] 맞춤 추천 로직. 점수 규칙을 바꾸려면 이 파일만 수정하면 됩니다.
import { CAREER_LABELS, CATEGORY_LABELS, CLOSING_SOON_DAYS } from '@/config/constants';
import type { NoticeItem, UserProfile } from '@/types';
import { calculateDDay } from './dateUtils';

export interface Recommendation {
  notice: NoticeItem;
  score: number;
  reasons: string[];
}

export const hasProfileInfo = (p: UserProfile | null | undefined) =>
  !!p && (p.department.trim() !== '' || p.careerFields.length > 0 || p.interestCategories.length > 0);

/** 학과·희망 진로·관심 분야와 맞는 공고를 점수순으로 반환 (마감된 공고 제외) */
export function recommendNotices(notices: NoticeItem[], profile: UserProfile | null): Recommendation[] {
  if (!profile || !hasProfileInfo(profile)) return [];
  const dept = profile.department.trim();

  const result: Recommendation[] = [];
  for (const notice of notices) {
    const dday = calculateDDay(notice.deadline, notice.isOngoing);
    if (dday.status === 'closed') continue;

    let score = 0;
    const reasons: string[] = [];

    for (const f of notice.careerFields ?? []) {
      if (profile.careerFields.includes(f)) {
        score += 4;
        reasons.push(`희망 진로(${CAREER_LABELS[f]})와 관련`);
      }
    }
    if (dept && notice.majors?.some((m) => dept.includes(m))) {
      score += 3;
      reasons.push(`${dept} 관련 공고`);
    }
    if (profile.interestCategories.includes(notice.category)) {
      score += 2;
      reasons.push(`관심 분야(${CATEGORY_LABELS[notice.category]})`);
    }
    if (score === 0) continue;
    if (dday.diffDays <= CLOSING_SOON_DAYS) {
      score += 1;
      reasons.push('마감 임박');
    }
    result.push({ notice, score, reasons });
  }

  return result.sort((a, b) => b.score - a.score || a.notice.deadline.localeCompare(b.notice.deadline));
}
